import { createClient } from '@supabase/supabase-js'

// 하루 사용 한도 (사용자 1명 기준)
const DAILY_LIMITS = {
  recipe_suggest: 10,
  youtube_recipe: 10,
}

const LIMIT_MESSAGE = '오늘은 한도를 다 쓰셨어요, 내일 다시 시도해주세요.'

function getAccessToken(req) {
  const header = req.headers?.authorization || req.headers?.Authorization
  if (!header || !header.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

// Authorization 헤더의 로그인 토큰으로 요청자를 식별하고, Supabase RPC
// (check_and_increment_usage)를 통해 오늘 사용 횟수를 원자적으로 확인·증가시킨다.
// 한도를 넘었으면 예외를 던져 호출자가 그대로 API 응답으로 내려보낼 수 있게 한다.
export async function enforceDailyLimit(req, feature) {
  const limit = DAILY_LIMITS[feature]
  const token = getAccessToken(req)

  if (!token) {
    const err = new Error('로그인이 필요합니다.')
    err.status = 401
    throw err
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )

  const { data, error } = await supabase
    .rpc('check_and_increment_usage', {
      p_feature: feature,
      p_daily_limit: limit,
    })
    .single()

  if (error) {
    const err = new Error('사용량 확인 중 오류가 발생했습니다.')
    err.status = 500
    throw err
  }

  if (!data?.allowed) {
    const err = new Error(LIMIT_MESSAGE)
    err.status = 429
    throw err
  }
}
