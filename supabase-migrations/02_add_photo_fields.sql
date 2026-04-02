-- 为 photos 表添加新字段
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS age_period TEXT DEFAULT 'preschool';

-- 添加注释
COMMENT ON COLUMN photos.tags IS '照片标签数组';
COMMENT ON COLUMN photos.age_period IS '年龄段：preschool（学前）或 kindergarten（幼儿园）';
