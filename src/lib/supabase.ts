import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://avxobkcqhcmzmorxuiua.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dKLJeO0bK_jXR8-V-K_9sA_N_QG9RU3'

// createClient will no longer throw an error during build time even if env vars are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
