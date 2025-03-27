-- 创建 admin_users 表
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);

-- 创建 RLS 策略
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 允许所有已认证用户读取记录
CREATE POLICY "Allow authenticated users to read admin users"
    ON admin_users FOR SELECT
    TO authenticated
    USING (true);

-- 允许所有已认证用户插入记录
CREATE POLICY "Allow authenticated users to insert admin users"
    ON admin_users FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 允许所有已认证用户更新记录
CREATE POLICY "Allow authenticated users to update admin users"
    ON admin_users FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 允许所有已认证用户删除记录
CREATE POLICY "Allow authenticated users to delete admin users"
    ON admin_users FOR DELETE
    TO authenticated
    USING (true);

-- 创建函数用于创建 admin_users 表
CREATE OR REPLACE FUNCTION create_admin_users_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 创建 admin_users 表
    CREATE TABLE IF NOT EXISTS admin_users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);
    CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);

    -- 启用 RLS
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

    -- 删除现有策略
    DROP POLICY IF EXISTS "Allow authenticated users to read admin users" ON admin_users;
    DROP POLICY IF EXISTS "Allow authenticated users to insert admin users" ON admin_users;
    DROP POLICY IF EXISTS "Allow authenticated users to update admin users" ON admin_users;
    DROP POLICY IF EXISTS "Allow authenticated users to delete admin users" ON admin_users;

    -- 创建新策略
    CREATE POLICY "Allow authenticated users to read admin users"
        ON admin_users FOR SELECT
        TO authenticated
        USING (true);

    CREATE POLICY "Allow authenticated users to insert admin users"
        ON admin_users FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update admin users"
        ON admin_users FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to delete admin users"
        ON admin_users FOR DELETE
        TO authenticated
        USING (true);
END;
$$; 