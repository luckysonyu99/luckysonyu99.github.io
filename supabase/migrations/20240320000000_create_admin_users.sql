-- 1. 删除现有的表（如果存在）
DROP TABLE IF EXISTS public.admin_users;

-- 2. 创建新的 admin_users 表
CREATE TABLE public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 创建索引
CREATE INDEX admin_users_user_id_idx ON public.admin_users(user_id);
CREATE INDEX admin_users_email_idx ON public.admin_users(email);

-- 4. 启用 RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略
CREATE POLICY "允许所有已认证用户访问 admin_users" ON public.admin_users
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. 添加管理员
DO $$
DECLARE
    existing_user_id uuid;
BEGIN
    -- 获取用户ID
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'admin@luckysonyu99.me';

    -- 如果用户存在，添加为管理员
    IF existing_user_id IS NOT NULL THEN
        INSERT INTO admin_users (user_id, email, created_at)
        VALUES (existing_user_id, 'admin@luckysonyu99.me', now());
    END IF;
END $$; 