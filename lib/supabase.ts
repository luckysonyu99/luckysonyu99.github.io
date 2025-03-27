import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 创建一个单例实例
const supabase = createClientComponentClient();

export { supabase }; 