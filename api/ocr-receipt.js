import { callClovaOcr } from './_lib/clovaOcr.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const { imageBase64, format } = req.body ?? {}
    const data = await callClovaOcr({ imageBase64, format })
    res.status(200).json(data)
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'OCR 처리 중 오류가 발생했습니다.',
    })
  }
}
