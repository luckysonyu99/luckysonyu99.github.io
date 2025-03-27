-- 创建里程碑表
CREATE TABLE IF NOT EXISTS milestones (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建索引
CREATE INDEX IF NOT EXISTS milestones_date_idx ON milestones(milestone_date DESC);
CREATE INDEX IF NOT EXISTS milestones_category_idx ON milestones(category);

-- 设置 RLS 策略
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取
CREATE POLICY "允许所有用户读取里程碑"
  ON milestones FOR SELECT
  USING (true);

-- 只允许管理员写入
CREATE POLICY "只允许管理员写入里程碑"
  ON milestones FOR ALL
  USING (auth.role() = 'authenticated'); 