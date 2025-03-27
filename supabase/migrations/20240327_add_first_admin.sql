-- 插入第一个管理员用户
-- 注意：这里的 user_id 和 email 需要替换为实际的值
INSERT INTO admin_users (user_id, email)
VALUES (
  'YOUR_USER_ID', -- 替换为实际的用户ID
  'YOUR_EMAIL'    -- 替换为实际的邮箱
)
ON CONFLICT (user_id) DO NOTHING; 