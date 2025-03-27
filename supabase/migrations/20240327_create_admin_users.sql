-- 创建管理员用户表
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- 创建RLS策略
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 允许所有已认证用户读取
CREATE POLICY "允许所有已认证用户读取" ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- 允许第一个管理员用户插入
CREATE POLICY "允许第一个管理员用户插入" ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- 如果表中没有数据，允许插入
    NOT EXISTS (SELECT 1 FROM admin_users)
    OR
    -- 如果用户已经是管理员，允许插入
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- 只允许管理员删除
CREATE POLICY "只允许管理员删除" ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  ); 