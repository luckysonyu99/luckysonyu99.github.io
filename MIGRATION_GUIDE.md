# Luca's Growing - Supabase 迁移指南

## 📋 迁移步骤

### 1. 准备工作

#### 1.1 安装依赖
```bash
cd /path/to/yuyan-website
npm install @supabase/supabase-js@^2.39.3 @supabase/auth-helpers-nextjs@^0.8.7
npm uninstall userbase-js
```

#### 1.2 配置环境变量
复制 `.env.local` 文件到项目根目录，确保包含：
```env
NEXT_PUBLIC_SUPABASE_URL=https://krcihnwfatzhjlkchdrm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 设置 Supabase 数据库

#### 2.1 执行 SQL 脚本
1. 登录 Supabase Dashboard: https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧菜单 **SQL Editor**
4. 点击 **New Query**
5. 复制 `supabase-schema.sql` 的全部内容
6. 粘贴到编辑器中
7. 点击 **Run** 执行

#### 2.2 创建管理员账号
在 SQL Editor 中执行：
```sql
-- 注意：这个操作需要在 Supabase Auth 中手动创建用户
-- 或者通过应用的注册功能创建
```

**方法1：通过 Supabase Dashboard**
1. 点击左侧菜单 **Authentication**
2. 点击 **Users** 标签
3. 点击 **Add user** → **Create new user**
4. 输入：
   - Email: `admin@luca.com`
   - Password: `luca2024`
   - 勾选 **Auto Confirm User**
5. 点击 **Create user**

**方法2：通过应用注册**
- 启动应用后，访问登录页面
- 点击"创建默认管理员"按钮

### 3. 替换文件

#### 3.1 核心文件替换
```bash
# 备份旧文件
mv lib/auth.ts lib/auth-old.ts
mv app/contexts/AuthContext.tsx app/contexts/AuthContext-old.tsx

# 使用新文件
mv lib/auth-new.ts lib/auth.ts
mv app/contexts/AuthContext-new.tsx app/contexts/AuthContext.tsx
```

#### 3.2 更新相册管理页面
将以下文件内容替换 `app/admin/gallery/page.tsx`：

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Photo } from '@/lib/supabase';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '其他',
  });
  const [uploading, setUploading] = useState(false);

  // 加载照片
  useEffect(() => {
    loadPhotos();

    // 订阅实时更新
    const subscription = supabase
      .channel('photos_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'photos' },
        () => {
          loadPhotos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('加载照片失败:', error);
      alert('加载照片失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        try {
          const response = await fetch("/api/upload-signed-cloudinary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64data }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "上传失败");

          setFormData({ ...formData, image_url: data.imageUrl });
        } catch (error) {
          console.error("上传失败:", error);
          alert(`图片上传失败: ${(error as Error).message}`);
        }
      };
    } catch (error) {
      console.error("处理图片失败:", error);
      alert(`图片上传失败: ${(error as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('photos')
          .update(formData)
          .eq('id', isEditing);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photos')
          .insert([formData]);

        if (error) throw error;
      }

      setIsAdding(false);
      setIsEditing(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '其他',
      });
      loadPhotos();
    } catch (error) {
      console.error('保存照片失败:', error);
      alert(`保存照片失败: ${(error as Error).message}`);
    }
  };

  const handleEdit = (photo: Photo) => {
    setIsEditing(photo.id);
    setFormData({
      title: photo.title,
      description: photo.description,
      image_url: photo.image_url,
      category: photo.category,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这张照片吗？")) return;

    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadPhotos();
    } catch (error) {
      console.error("删除照片失败:", error);
      alert(`删除照片失败: ${(error as Error).message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-qingke text-candy-purple">相册管理</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
        >
          添加照片
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              >
                <option value="其他">其他</option>
                <option value="生活">生活</option>
                <option value="旅行">旅行</option>
                <option value="美食">美食</option>
                <option value="风景">风景</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">照片</label>
              <div className="flex items-center space-x-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="预览"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required={!isEditing}
                  disabled={uploading}
                />
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setFormData({
                    title: '',
                    description: '',
                    image_url: '',
                    category: '其他',
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors disabled:opacity-50"
              >
                {isEditing ? '保存修改' : '添加照片'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-qingke text-candy-purple mb-2">{photo.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span>{photo.category}</span>
            </div>
            <p className="text-gray-700 mb-4">{photo.description}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleEdit(photo)}
                className="text-candy-blue hover:text-candy-purple transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(photo.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### 4. 启动应用

```bash
npm run dev
```

访问 http://localhost:3000/admin/login

### 5. 测试功能

1. ✅ 登录功能
   - 使用 admin@luca.com / luca2024 登录
   
2. ✅ 相册管理
   - 添加照片
   - 编辑照片
   - 删除照片
   
3. ✅ 里程碑管理
   - 添加里程碑
   - 编辑里程碑
   - 删除里程碑

### 6. 部署到生产环境

#### 6.1 Vercel 部署
1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署

#### 6.2 GitHub Pages 部署
由于 GitHub Pages 不支持服务端渲染，建议使用 Vercel 或 Netlify。

## 🔧 故障排除

### 问题1：无法连接到 Supabase
- 检查 `.env.local` 文件是否存在
- 检查环境变量是否正确
- 检查 Supabase 项目是否处于活跃状态

### 问题2：登录失败
- 确认已在 Supabase Dashboard 中创建用户
- 检查邮箱和密码是否正确
- 查看浏览器控制台的错误信息

### 问题3：数据库操作失败
- 确认 SQL 脚本已正确执行
- 检查 RLS 策略是否正确配置
- 查看 Supabase Dashboard 的日志

## 📚 相关文档

- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [项目 GitHub](https://github.com/luckysonyu99/luckysonyu99.github.io)
