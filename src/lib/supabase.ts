import { createClient } from '@supabase/supabase-js'

// Use different Supabase projects for dev vs production
const isDev = import.meta.env.DEV

const supabaseUrl = isDev 
  ? import.meta.env.VITE_SUPABASE_DEV_URL || import.meta.env.VITE_SUPABASE_URL
  : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey = isDev
  ? import.meta.env.VITE_SUPABASE_DEV_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log(`Using Supabase project: ${isDev ? 'Development' : 'Production'}`)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})