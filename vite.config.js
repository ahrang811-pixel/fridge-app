import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { callClovaOcr } from './api/_lib/clovaOcr.js'

// `vite dev`에는 Vercel 서버리스 함수(api/ocr-receipt.js)가 실행되지 않으므로,
// 로컬 개발 중에도 영수증 OCR 기능을 테스트할 수 있도록 같은 로직을 미들웨어로 재사용한다.
// 실제 배포(vite build) 결과물에는 영향이 없다 - configureServer는 dev 서버에서만 호출된다.
function clovaOcrDevMiddleware() {
  return {
    name: 'clova-ocr-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/ocr-receipt', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8') || '{}')
          const data = await callClovaOcr(body)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = err.status || 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              message: err.message || 'OCR 처리 중 오류가 발생했습니다.',
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

  return {
    plugins: [
      react(),
      tailwindcss(),
      clovaOcrDevMiddleware(),
      VitePWA({
        registerType: 'autoUpdate',
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
