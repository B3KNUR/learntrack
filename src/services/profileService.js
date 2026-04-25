import { supabase } from './supabaseClient'

export async function getProfile(userId) {
  return supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle()
}
