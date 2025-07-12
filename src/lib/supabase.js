import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yhcxnmmxecbsddyhxiff.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY3hubW14ZWNic2RkeWh4aWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDIwMzIsImV4cCI6MjA2NzgxODAzMn0.SvF2qHHL1c4Kf8ku_rZBWccdi7F04V1EIqccMrD18fk'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export default supabase