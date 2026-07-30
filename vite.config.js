import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { callClovaOcr } from './api/_lib/clovaOcr.js'
import { suggestRecipes } from './api/_lib/geminiRecipes.js'
import {
  extractVideoId,
  fetchVideoSnippet,
  fetchTopComments,
  partitionComments,
} from './api/_lib/youtube.js'
import { extractRecipeFromVideo } from './api/_lib/geminiRecipeExtract.js'
import { enforceDailyLimit } from './api/_lib/usageLimiter.js'
import { runExpiryCheck } from './api/_lib/expiryCheck.js'
import { getOrCreateIngredientImageUrl } from './api/_lib/ingredientImageService.js'
import { getOrCreateIngredientFacts } from './api/_lib/ingredientFactsService.js'

// `vite dev`에는 Vercel 서버리스 함수(api/*.js)가 실행되지 않으므로, 로컬 개발
// 중에도 같은 로직을 테스트할 수 있도록 미들웨어로 재사용한다.
// 실제 배포(vite build) 결과물에는 영향이 없다 - configureServer는 dev 서버에서만 호출된다.
function apiDevMiddleware(path, defaultErrorMessage, run) {
  return {
    name: `${path.replace(/\W/g, '-')}-dev-middleware`,
    configureServer(server) {
      server.middlewares.use(path, async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8') || '{}')
          const data = await run(body, req)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = err.status || 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({ message: err.message || defaultErrorMessage }),
          )
        }
      })
    },
  }
}

function clovaOcrDevMiddleware() {
  return apiDevMiddleware(
    '/api/ocr-receipt',
    'OCR 처리 중 오류가 발생했습니다.',
    (body) => callClovaOcr(body),
  )
}

function geminiRecipesDevMiddleware() {
  return apiDevMiddleware(
    '/api/suggest-recipes',
    'AI 레시피 추천 중 오류가 발생했습니다.',
    async (body, req) => {
      await enforceDailyLimit(req, 'recipe_suggest')
      return {
        recipes: await suggestRecipes({
          ingredientNames: Array.isArray(body.ingredientNames)
            ? body.ingredientNames
            : [],
          categories:
            Array.isArray(body.categories) && body.categories.length
              ? body.categories
              : ['기타'],
          urgentIngredientNames: Array.isArray(body.urgentIngredientNames)
            ? body.urgentIngredientNames
            : [],
        }),
      }
    },
  )
}

function youtubeRecipeDevMiddleware() {
  return apiDevMiddleware(
    '/api/youtube-recipe',
    '유튜브 레시피 분석 중 오류가 발생했습니다.',
    async (body, req) => {
      await enforceDailyLimit(req, 'youtube_recipe')

      const videoId = extractVideoId(body.url)
      if (!videoId) {
        const err = new Error(
          '유효한 유튜브 링크가 아닙니다. 링크를 다시 확인해주세요.',
        )
        err.status = 400
        throw err
      }

      const safeCategories =
        Array.isArray(body.categories) && body.categories.length
          ? body.categories
          : ['기타']

      const { title, description, channelId } = await fetchVideoSnippet(videoId)
      const comments = await fetchTopComments(videoId)
      const { authorComments, topComments } = partitionComments(comments, channelId)

      const extracted = await extractRecipeFromVideo({
        title,
        description,
        authorComments,
        topComments,
        categories: safeCategories,
      })

      return { videoId, title, ...extracted }
    },
  )
}

function ingredientImageDevMiddleware() {
  return apiDevMiddleware(
    '/api/ingredient-image',
    '식재료 이미지 생성 중 오류가 발생했습니다.',
    async (body, req) => {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      if (!name) {
        const err = new Error('식재료 이름이 필요합니다.')
        err.status = 400
        throw err
      }
      return { imageUrl: await getOrCreateIngredientImageUrl(name, req) }
    },
  )
}

function ingredientFactsDevMiddleware() {
  return apiDevMiddleware(
    '/api/ingredient-facts',
    '식재료 정보 생성 중 오류가 발생했습니다.',
    async (body, req) => {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const category = typeof body.category === 'string' ? body.category : '기타'
      if (!name) {
        const err = new Error('식재료 이름이 필요합니다.')
        err.status = 400
        throw err
      }
      return getOrCreateIngredientFacts(name, category, req)
    },
  )
}

// 로컬에서 유통기한 임박 알림 크론 로직을 수동으로 확인해볼 수 있도록 하는
// 개발 전용 엔드포인트. 실제 배포본(vercel.json의 crons)에는 영향이 없다.
function expiryCheckDevMiddleware() {
  return {
    name: 'expiry-check-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/cron/check-expiry', async (req, res) => {
        try {
          const data = await runExpiryCheck()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              message: err.message || '유통기한 확인 중 오류가 발생했습니다.',
            }),
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite는 VITE_ 접두사가 없는 키를 클라이언트로 노출하지 않지만, 이 config 파일
  // 자체(Node 컨텍스트)에서 process.env로 읽으려면 명시적으로 로드해줘야 한다.
  // 세 번째 인자를 ''로 주면 접두사 제한 없이 .env의 모든 키를 가져온다.
  const env = loadEnv(mode, process.cwd(), '')
  process.env.CLOVA_OCR_INVOKE_URL ??= env.CLOVA_OCR_INVOKE_URL
  process.env.CLOVA_OCR_SECRET ??= env.CLOVA_OCR_SECRET
  process.env.GEMINI_API_KEY ??= env.GEMINI_API_KEY
  process.env.YOUTUBE_API_KEY ??= env.YOUTUBE_API_KEY
  process.env.VITE_SUPABASE_URL ??= env.VITE_SUPABASE_URL
  process.env.VITE_SUPABASE_ANON_KEY ??= env.VITE_SUPABASE_ANON_KEY
  process.env.VITE_VAPID_PUBLIC_KEY ??= env.VITE_VAPID_PUBLIC_KEY
  process.env.VAPID_PRIVATE_KEY ??= env.VAPID_PRIVATE_KEY
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= env.SUPABASE_SERVICE_ROLE_KEY

  return {
    plugins: [
      react(),
      tailwindcss(),
      clovaOcrDevMiddleware(),
      geminiRecipesDevMiddleware(),
      youtubeRecipeDevMiddleware(),
      ingredientImageDevMiddleware(),
      ingredientFactsDevMiddleware(),
      expiryCheckDevMiddleware(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        },
        // 기본값(false)이면 `vite dev`에서는 서비스워커가 전혀 등록되지 않아
        // navigator.serviceWorker.ready가 영원히 resolve되지 않는다.
        // (알림 구독 등 SW에 의존하는 기능을 로컬에서 테스트하려면 필요)
        devOptions: {
          enabled: true,
          type: 'module',
        },
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: '공유 냉장고',
          short_name: '공유 냉장고',
          description: '식재료, 장보기, 식단, 식비, 레시피를 관리하는 공유 냉장고 앱',
          lang: 'ko',
          theme_color: '#059669',
          background_color: '#FFFFFF',
          display: 'standalone',
          start_url: '/',
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
  }
})
