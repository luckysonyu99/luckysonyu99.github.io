import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 创建一个单例实例
const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

export { supabase }; 