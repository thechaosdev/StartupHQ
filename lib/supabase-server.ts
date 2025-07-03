import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import { env } from "./env"

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
