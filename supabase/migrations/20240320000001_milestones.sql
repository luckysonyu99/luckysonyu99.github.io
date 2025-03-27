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