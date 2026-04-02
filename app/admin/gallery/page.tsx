'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Masonry from 'react-masonry-css';

interface Photo {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags?: string[];
  age_period?: string; // 年龄段：preschool（学前）, kindergarten（幼儿园）
  created_at?: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedAgePeriod, setSelectedAgePeriod] = useState<string>('全部');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '其他',
    tags: '',
    age_period: 'preschool',
  });
  const [uploading, setUploading] = useState(false);

  const categories = ['全部', '生活', '旅行', '美食', '风景', '学习', '玩耍', '其他'];
  const agePeriods = [
    { value: '全部', label: '全部' },
    { value: 'preschool', label: '学前时期' },
    { value: 'kindergarten', label: '幼儿园时期' },
  ];

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, selectedCategory, selectedAgePeriod]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPhotos(data || []);
    } catch (error) {
      console.error('获取照片失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPhotos = () => {
    let filtered = [...photos];

    if (selectedCategory !== '全部') {
      filtered = filtered.filter(photo => photo.category === selectedCategory);
    }

    if (selectedAgePeriod !== '全部') {
      filtered = filtered.filter(photo => photo.age_period === selectedAgePeriod);
    }

    setFilteredPhotos(filtered);
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
          const response = await fetch("https://luckysonyu99-github-io-git-main-luckysonyu99s-projects.vercel.app/api/upload-signed-cloudinary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageBase64: base64data,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to upload image");
          }

          setFormData({ ...formData, image_url: data.imageUrl });
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
          alert(`图片上传失败: ${(error as Error).message}`);
        }
      };
    } catch (error) {
      console.error("Error handling image upload:", error);
      alert(`图片上传失败: ${(error as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const photoData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        age_period: formData.age_period,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('photos')
          .update(photoData)
          .eq('id', isEditing);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photos')
          .insert([photoData]);

        if (error) throw error;
      }

      await fetchPhotos();
      setIsAdding(false);
      setIsEditing(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '其他',
        tags: '',
        age_period: 'preschool',
      });
    } catch (error) {
      console.error('Error saving photo:', error);
      alert(`保存照片失败: ${(error as Error).message}`);
    }
  };

  const handleEdit = (photo: Photo) => {
    if (!photo.id) return;
    setIsEditing(photo.id);
    setFormData({
      title: photo.title,
      description: photo.description,
      image_url: photo.image_url,
      category: photo.category,
      tags: photo.tags?.join(', ') || '',
      age_period: photo.age_period || 'preschool',
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

      await fetchPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert(`删除照片失败: ${(error as Error).message}`);
    }
  };

  const breakpointColumns = {
    default: 4,
    1536: 3,
    1024: 2,
    640: 1
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-qingke text-candy-purple">相册管理</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
        >
          添加照片
        </button>
      </div>

      {/* 筛选器 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 年龄段筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">年龄段</label>
            <div className="flex flex-wrap gap-2">
              {agePeriods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedAgePeriod(period.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedAgePeriod === period.value
                      ? 'bg-candy-pink text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* 分类筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-candy-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          共 {filteredPhotos.length} 张照片
        </div>
      </div>

      {/* 添加/编辑表单 */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="学习">学习</option>
                  <option value="玩耍">玩耍</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">年龄段</label>
                <select
                  value={formData.age_period}
                  onChange={(e) => setFormData({ ...formData, age_period: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required
                >
                  <option value="preschool">学前时期</option>
                  <option value="kindergarten">幼儿园时期</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="例如：户外, 春天, 公园"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                rows={3}
                required
              />
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
                    tags: '',
                    age_period: 'preschool',
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

      {/* 瀑布流照片展示 */}
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="mb-4 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative group">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleEdit(photo)}
                  className="px-4 py-2 bg-white text-candy-blue rounded-lg hover:bg-gray-100 transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => photo.id && handleDelete(photo.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-qingke text-candy-purple mb-1">{photo.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <span className="px-2 py-1 bg-candy-blue/10 text-candy-blue rounded">
                  {photo.category}
                </span>
                {photo.age_period && (
                  <span className="px-2 py-1 bg-candy-pink/10 text-candy-pink rounded">
                    {photo.age_period === 'preschool' ? '学前' : '幼儿园'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-2">{photo.description}</p>
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {photo.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </Masonry>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无照片
        </div>
      )}
    </div>
  );
}
