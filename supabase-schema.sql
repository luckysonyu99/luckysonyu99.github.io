-- =============================================
-- Luca's Growing - Supabase Database Schema
-- =============================================

-- 1. 创建相册表
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '其他',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. 创建里程碑表
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. 创建管理员表（用于存储额外的管理员信息）
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. 启用 Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略 - 相册表
-- 所有人可以查看
CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT
  USING (true);

-- 只有认证用户可以插入
CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 只有认证用户可以更新
CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 只有认证用户可以删除
CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  USING (auth.role() = 'authenticated');

-- 6. 创建 RLS 策略 - 里程碑表
-- 所有人可以查看
CREATE POLICY "Anyone can view milestones"
  ON milestones FOR SELECT
  USING (true);

-- 只有认证用户可以插入
CREATE POLICY "Authenticated users can insert milestones"
  ON milestones FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 只有认证用户可以更新
CREATE POLICY "Authenticated users can update milestones"
  ON milestones FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 只有认证用户可以删除
CREATE POLICY "Authenticated users can delete milestones"
  ON milestones FOR DELETE
  USING (auth.role() = 'authenticated');

-- 7. 创建 RLS 策略 - 管理员表
-- 只有认证用户可以查看自己的信息
CREATE POLICY "Users can view own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);

-- 只有认证用户可以更新自己的信息
CREATE POLICY "Users can update own profile"
  ON admin_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 8. 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 创建触发器 - 自动更新 updated_at
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS photos_category_idx ON photos(category);
CREATE INDEX IF NOT EXISTS milestones_date_idx ON milestones(date DESC);
CREATE INDEX IF NOT EXISTS milestones_created_at_idx ON milestones(created_at DESC);

-- 11. 插入一些示例数据（可选）
-- INSERT INTO photos (title, description, image_url, category) VALUES
--   ('第一张照片', '这是宝宝的第一张照片', 'https://example.com/photo1.jpg', '生活'),
--   ('美好时光', '记录美好的成长瞬间', 'https://example.com/photo2.jpg', '旅行');

-- INSERT INTO milestones (title, description, date, image_url) VALUES
--   ('第一次笑', '宝宝第一次露出笑容', '2024-01-15', 'https://example.com/milestone1.jpg'),
--   ('第一次走路', '宝宝迈出人生第一步', '2024-06-20', 'https://example.com/milestone2.jpg');
