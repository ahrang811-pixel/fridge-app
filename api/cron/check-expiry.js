import { runExpiryCheck } from '../_lib/expiryCheck.js'

// Vercel Cron이 이 경로를 매일 호출한다 (vercel.json의 crons 설정 참고).
// CRON_SECRET 환경 변수를 설정해두면 Vercel이 Authorization 헤더에 자동으로
// 담아 보내주므로, 그 값으로 외부에서의 임의 호출을 막는다.
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!secret || authHeader !== `Bearer ${secret}`) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const result = await runExpiryCheck()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({
      message: err.message || '유통기한 확인 중 오류가 발생했습니다.',
    })
  }
}
