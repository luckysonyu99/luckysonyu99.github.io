'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Photo, getPhotos, uploadPhoto, createPhoto, updatePhoto, deletePhoto } from '@/models/gallery';

export default function GalleryAdminPage() {
  const { user, loading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Partial<Photo>>({
    title: '',
    description: '',
    url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchPhotos();
    }
  }, [loading, user]);

  const fetchPhotos = async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
    } catch (err) {
      setError('获取照片失败');
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadPhoto(file);
      if (url) {
        setCurrentPhoto({ ...currentPhoto, url });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPhoto.url) return;

    try {
      if (currentPhoto.id) {
        await updatePhoto(currentPhoto.id, currentPhoto);
      } else {
        await createPhoto(currentPhoto as Omit<Photo, 'id' | 'created_at' | 'updated_at'>);
      }
      await fetchPhotos();
      setCurrentPhoto({
        title: '',
        description: '',
        url: ''
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving photo:', err);
    }
  };

  const handleEdit = (photo: Photo) => {
    setCurrentPhoto(photo);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这张照片吗？')) return;

    try {
      await deletePhoto(id);
      await fetchPhotos();
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600 mb-4">请先登录</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">相册管理</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">照片</label>
              <div className="mt-1 flex items-center space-x-4">
                {currentPhoto.url && (
                  <img
                    src={currentPhoto.url}
                    alt="预览"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-pink-600 file:text-white
                      hover:file:bg-pink-700"
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                value={currentPhoto.title}
                onChange={(e) => setCurrentPhoto({ ...currentPhoto, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                value={currentPhoto.description}
                onChange={(e) => setCurrentPhoto({ ...currentPhoto, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPhoto({
                    title: '',
                    description: '',
                    url: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={!currentPhoto.url || uploading}
            >
              {uploading ? '上传中...' : '保存'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{photo.title}</h3>
                <p className="text-gray-600 mb-4">{photo.description}</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 