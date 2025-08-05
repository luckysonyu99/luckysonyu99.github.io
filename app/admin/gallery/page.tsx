'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import userbase from 'userbase-js';

interface Photo {
  itemId?: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

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

  useEffect(() => {
    userbase.init({ appId: '0b2844f0-e722-4251-a270-35200be9756a' })
      .then(() => {
        userbase.openDatabase({
          databaseName: 'photos',
          changeHandler: (items) => {
            setPhotos(items.map(item => item.item as Photo & { itemId: string }));
            setIsLoading(false);
          }
        })
        .catch((e) => console.error('Error opening photos database:', e));
      })
      .catch((e) => console.error('Userbase 初始化失败:', e));
  }, []);



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
      if (isEditing) {
        await userbase.updateItem({
          databaseName: 'photos',
          itemId: isEditing,
          item: formData,
        });
      } else {
        await userbase.insertItem({
          databaseName: 'photos',
          item: formData,
        });
      }

      setIsAdding(false);
      setIsEditing(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '其他',
      });
    } catch (error) {
      console.error('Error saving photo:', error);
      alert(`保存照片失败: ${(error as Error).message}`);
    }
  };

  const handleEdit = (photo: Photo) => {
    if (!photo.itemId) return;
    setIsEditing(photo.itemId);
    setFormData({
      title: photo.title,
      description: photo.description,
      image_url: photo.image_url,
      category: photo.category,
    });
    setIsAdding(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("确定要删除这张照片吗？")) return;

    try {
      await userbase.deleteItem({
        databaseName: "photos",
        itemId,
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
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
            key={index}
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
                onClick={() => photo.itemId && handleDelete(photo.itemId)}
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