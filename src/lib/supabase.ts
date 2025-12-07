import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
// It reads the environment variables we set in .env.local
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)