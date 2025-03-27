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

-- 允许管理员读取所有记录
CREATE POLICY "Allow admins to read all admin users"
    ON admin_users FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
        )
    );

-- 允许管理员插入记录
CREATE POLICY "Allow admins to insert admin users"
    ON admin_users FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
        )
    );

-- 允许管理员更新记录
CREATE POLICY "Allow admins to update admin users"
    ON admin_users FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
        )
    );

-- 允许管理员删除记录
CREATE POLICY "Allow admins to delete admin users"
    ON admin_users FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
        )
    );

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

    -- 创建 RLS 策略
    DROP POLICY IF EXISTS "Allow admins to read all admin users" ON admin_users;
    DROP POLICY IF EXISTS "Allow admins to insert admin users" ON admin_users;
    DROP POLICY IF EXISTS "Allow admins to update admin users" ON admin_users;
    DROP POLICY IF EXISTS "Allow admins to delete admin users" ON admin_users;

    CREATE POLICY "Allow admins to read all admin users"
        ON admin_users FOR SELECT
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE user_id = auth.uid()
            )
        );

    CREATE POLICY "Allow admins to insert admin users"
        ON admin_users FOR INSERT
        TO authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE user_id = auth.uid()
            )
        );

    CREATE POLICY "Allow admins to update admin users"
        ON admin_users FOR UPDATE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE user_id = auth.uid()
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE user_id = auth.uid()
            )
        );

    CREATE POLICY "Allow admins to delete admin users"
        ON admin_users FOR DELETE
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE user_id = auth.uid()
            )
        );
END;
$$; 