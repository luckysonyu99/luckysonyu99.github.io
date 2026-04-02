-- 更新角色枚举类型
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('admin', 'family', 'friend', 'visitor');

-- 更新 admin_profiles 表
ALTER TABLE admin_profiles
DROP COLUMN IF EXISTS role CASCADE;

ALTER TABLE admin_profiles
ADD COLUMN role user_role DEFAULT 'visitor',
ADD COLUMN IF NOT EXISTS relationship TEXT, -- 具体称谓：爷爷、奶奶、外公、外婆、叔叔、阿姨等
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- 添加注释
COMMENT ON COLUMN admin_profiles.role IS '用户角色：admin（爸爸妈妈）、family（爷爷奶奶外公外婆叔叔阿姨）、friend（授权访问者）、visitor（陌生人）';
COMMENT ON COLUMN admin_profiles.relationship IS '具体称谓：爷爷、奶奶、外公、外婆、叔叔、阿姨等';
COMMENT ON COLUMN admin_profiles.is_active IS '用户是否激活';
COMMENT ON COLUMN admin_profiles.last_login_at IS '最后登录时间';
