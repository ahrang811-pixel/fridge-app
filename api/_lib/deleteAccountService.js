import { createClient } from '@supabase/supabase-js'

// 클라이언트가 보낸 사용자 id를 그대로 믿지 않고, access token으로 서버에서
// 직접 본인 확인을 한 뒤 Supabase Auth Admin API로 계정을 삭제한다.
// (스페이스/데이터 정리는 호출하는 쪽에서 이미 prepare_account_deletion()
// RPC로 끝낸 뒤 이 함수를 호출한다는 전제.)
export async function deleteAccountByToken(token) {
  if (!token) {
    const err = new Error('로그인이 필요합니다.')
    err.status = 401
    throw err
  }

  const authedClient = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )

  const {
    data: { user },
    error: userError,
  } = await authedClient.auth.getUser()

  if (userError || !user) {
    const err = new Error('로그인이 필요합니다.')
    err.status = 401
    throw err
  }

  const adminClient = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
  if (deleteError) throw deleteError
}
