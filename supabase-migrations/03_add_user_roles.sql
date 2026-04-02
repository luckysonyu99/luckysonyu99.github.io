-- 创建角色枚举类型
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- 更新 admin_profiles 表，添加角色字段
ALTER TABLE admin_profiles
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'viewer',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- 添加注释
COMMENT ON COLUMN admin_profiles.role IS '用户角色：admin（管理员）、editor（编辑）、viewer（查看者）';
COMMENT ON COLUMN admin_profiles.is_active IS '用户是否激活';
COMMENT ON COLUMN admin_profiles.last_login_at IS '最后登录时间';

-- 创建用户管理视图
CREATE OR REPLACE VIEW user_management AS
SELECT
  ap.id,
  ap.email,
  ap.full_name,
  ap.role,
  ap.is_active,
  ap.created_at,
  ap.updated_at,
  ap.last_login_at
FROM admin_profiles ap;

-- 授予权限
GRANT SELECT ON user_management TO authenticated;
