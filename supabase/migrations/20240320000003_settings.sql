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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建设置更新时间触发器
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 设置 RLS 策略
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取
CREATE POLICY "允许所有用户读取设置"
  ON settings FOR SELECT
  USING (true);

-- 只允许管理员写入
CREATE POLICY "只允许管理员写入设置"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

-- 插入默认设置
INSERT INTO settings (site_title, site_description, theme_color)
VALUES ('宝宝成长记录', '记录宝宝成长的点点滴滴', 'pink')
ON CONFLICT DO NOTHING; 