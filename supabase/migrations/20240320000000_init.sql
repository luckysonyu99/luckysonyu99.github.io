-- 删除现有表（如果存在）
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建里程碑表
CREATE TABLE IF NOT EXISTS milestones (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT '其他',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建里程碑更新时间触发器
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建里程碑索引
CREATE INDEX IF NOT EXISTS milestones_date_idx ON milestones(milestone_date DESC);
CREATE INDEX IF NOT EXISTS milestones_category_idx ON milestones(category);

-- 创建相册表
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '未分类',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建相册更新时间触发器
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建相册索引
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);

-- 创建设置表
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  site_title TEXT NOT NULL,
  site_description TEXT,
  baby_name TEXT,
  baby_birthday DATE,
  theme_color TEXT DEFAULT 'pink',
  email_notifications BOOLEAN DEFAULT false,
  browser_notifications BOOLEAN DEFAULT false,
  public_milestones BOOLEAN DEFAULT true,
  public_photos BOOLEAN DEFAULT true,
  logo_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建设置更新时间触发器
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 设置 RLS 策略
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取
CREATE POLICY "允许所有用户读取里程碑"
  ON milestones FOR SELECT
  USING (true);

CREATE POLICY "允许所有用户读取照片"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "允许所有用户读取设置"
  ON settings FOR SELECT
  USING (true);

-- 只允许管理员写入
CREATE POLICY "只允许管理员写入里程碑"
  ON milestones FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "只允许管理员写入照片"
  ON photos FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "只允许管理员写入设置"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

-- 插入默认设置
INSERT INTO settings (site_title, site_description, theme_color)
VALUES ('宝宝成长记录', '记录宝宝成长的点点滴滴', 'pink')
ON CONFLICT DO NOTHING;

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery', 'gallery', true),
  ('settings', 'settings', true)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶权限
CREATE POLICY "允许已认证用户上传图片"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "允许已认证用户删除图片"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "允许所有人查看图片"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "允许已认证用户上传设置文件"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'settings' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "允许已认证用户删除设置文件"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'settings' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "允许所有人查看设置文件"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'settings'); 