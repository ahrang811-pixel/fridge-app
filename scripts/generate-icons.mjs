import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sourcePath = path.join(__dirname, 'icon-source.png')
const publicDir = path.join(__dirname, '..', 'public')

const targets = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

// pwa-512x512.png doubles as the manifest's "maskable" icon (see
// vite.config.js), so the artwork must stay inside the safe zone that
// circular/squircle OS masks won't clip - keep a margin around the
// trimmed artwork instead of letting it run edge-to-edge.
const CONTENT_FRACTION = 0.8

// icon-source.png has soft/noisy edges (AI-generated grain), so sharp's
// built-in trim() can't find a clean uniform border to cut - scan for the
// actual drawn content ourselves using a brightness threshold instead.
async function findContentBounds(image) {
  const { data, info } = await image
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const isBackground = (r, g, b) => r > 240 && g > 240 && b > 240

  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (!isBackground(data[i], data[i + 1], data[i + 2])) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

const source = sharp(sourcePath)
const bounds = await findContentBounds(source)
const cropped = await source.clone().extract(bounds).toBuffer()

for (const { file, size } of targets) {
  const innerSize = Math.round(size * CONTENT_FRACTION)
  const resized = await sharp(cropped)
    .resize(innerSize, innerSize, { fit: 'inside' })
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, file))

  console.log(`generated ${file}`)
}
