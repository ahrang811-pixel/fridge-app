import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { generateIngredientImage } from './pollinationsImage.js'
import { enforceDailyLimit } from './usageLimiter.js'

const BUCKET = 'ingredient-images'

const MIME_EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

function getServiceRoleClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

// 이름으로 캐시된 이미지가 있으면 그대로 반환하고, 없을 때만 하루 사용 한도를
// 체크한 뒤 Gemini로 새로 생성해서 Storage에 올리고 ingredient_images에 캐싱한다.
export async function getOrCreateIngredientImageUrl(name, req) {
  const supabase = getServiceRoleClient()

  const { data: cached, error: cacheError } = await supabase
    .from('ingredient_images')
    .select('image_url')
    .eq('name', name)
    .maybeSingle()

  if (cacheError) throw cacheError
  if (cached?.image_url) return cached.image_url

  await enforceDailyLimit(req, 'ingredient_image')

  const { buffer, mimeType } = await generateIngredientImage(name)
  const extension = MIME_EXTENSIONS[mimeType] || 'png'
  // 이름을 그대로(또는 encodeURIComponent해서) Storage 키로 쓰면 한글 이름에서
  // 나오는 %XX 시퀀스를 Supabase Storage가 "Invalid key"로 거부한다. 사람이 읽을
  // 필요 없는 키이므로 이름의 해시값(ASCII)을 키로 쓴다.
  const hash = createHash('sha256').update(name).digest('hex')
  const path = `${hash}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimeType, upsert: true })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const imageUrl = publicUrlData.publicUrl

  const { error: upsertError } = await supabase
    .from('ingredient_images')
    .upsert({ name, image_url: imageUrl }, { onConflict: 'name' })

  if (upsertError) throw upsertError

  return imageUrl
}
