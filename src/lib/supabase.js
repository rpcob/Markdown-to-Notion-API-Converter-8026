import { createClient } from '@supabase/supabase-js'

// These values will need to be replaced with your actual Supabase project details
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co'
const SUPABASE_ANON_KEY = '<ANON_KEY>'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  console.warn('Missing Supabase credentials. App will run in demo mode.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase