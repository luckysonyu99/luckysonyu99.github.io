import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

class SupabaseClient {
  private static instance: ReturnType<typeof createClient>;

  private constructor() {}

  public static getInstance(): ReturnType<typeof createClient> {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return SupabaseClient.instance;
  }
}

export const supabase = SupabaseClient.getInstance(); 