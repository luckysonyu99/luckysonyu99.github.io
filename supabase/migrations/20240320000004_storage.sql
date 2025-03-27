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