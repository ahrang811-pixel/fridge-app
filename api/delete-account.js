import { deleteAccountByToken } from './_lib/deleteAccountService.js'

function getAccessToken(req) {
  const header = req.headers?.authorization || req.headers?.Authorization
  if (!header || !header.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    await deleteAccountByToken(getAccessToken(req))
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || '회원탈퇴 처리 중 오류가 발생했습니다.',
    })
  }
}
