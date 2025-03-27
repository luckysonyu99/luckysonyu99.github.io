import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 使用全局变量来存储 Supabase 客户端实例
declare global {
  var supabaseClient: ReturnType<typeof createClient> | undefined;
}

// 确保只在服务器端或客户端首次加载时创建实例
if (typeof window !== 'undefined' && !global.supabaseClient) {
  global.supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export const supabase = global.supabaseClient || createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}); 