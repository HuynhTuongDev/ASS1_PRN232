import { createClient } from '@supabase/supabase-js'

// Sử dụng biến môi trường để an toàn và linh hoạt giữa Local và Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://avxobkcqhcmzmorxuiua.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
