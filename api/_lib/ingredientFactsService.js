import { createClient } from '@supabase/supabase-js'
import { findIngredientMatch } from '../../src/features/ingredients/ingredientKnowledge.js'
import { generateIngredientFacts } from './geminiIngredientFacts.js'
import { enforceDailyLimit } from './usageLimiter.js'

function getServiceRoleClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

// ingredientKnowledge.js에 값이 이미 있으면 그걸 쓰고, 없으면 ingredient_ai_facts
// 캐시를 확인한 뒤, 캐시에도 없을 때만 하루 사용 한도를 체크하고 Gemini로 생성해서 캐싱한다.
export async function getOrCreateIngredientFacts(name, category, req) {
  const known = findIngredientMatch(name)
  if (known?.maxStorageDays != null && known?.buyingTip && known?.storageMethods?.length) {
    return {
      storageMethods: known.storageMethods,
      maxStorageDays: known.maxStorageDays,
      buyingTip: known.buyingTip,
    }
  }

  const supabase = getServiceRoleClient()

  const { data: cached, error: cacheError } = await supabase
    .from('ingredient_ai_facts')
    .select('max_storage_days, buying_tip, storage_methods')
    .eq('name', name)
    .maybeSingle()

  if (cacheError) throw cacheError

  // storage_methods가 비어있으면(보관 방식별 안내가 추가되기 전에 캐싱된 옛날 항목)
  // 캐시 미스로 취급해서 더 상세한 내용으로 다시 생성하고 덮어쓴다.
  if (cached?.storage_methods?.length) {
    return {
      storageMethods: cached.storage_methods,
      maxStorageDays: cached.max_storage_days,
      buyingTip: cached.buying_tip,
    }
  }

  await enforceDailyLimit(req, 'ingredient_facts')

  const facts = await generateIngredientFacts(name, category)

  const { error: upsertError } = await supabase.from('ingredient_ai_facts').upsert(
    {
      name,
      storage_methods: facts.storageMethods,
      max_storage_days: facts.maxStorageDays,
      buying_tip: facts.buyingTip,
    },
    { onConflict: 'name' },
  )

  if (upsertError) throw upsertError

  return facts
}
