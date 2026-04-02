import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables');
  console.error('[Supabase] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '已设置' : '未设置');
  console.error('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '已设置' : '未设置');
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('[Supabase] 初始化客户端...');
console.log('[Supabase] URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

console.log('[Supabase] 客户端初始化完成');

// 类型定义
export interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}
