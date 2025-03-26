'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { updateMilestone, uploadMilestonePhoto, deleteMilestonePhoto } from '@/models/milestone';
import type { Milestone } from '@/models/milestone';
import Image from 'next/image';

export default function EditMilestoneForm({ milestone }: { milestone: Milestone }) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: milestone.title,
    description: milestone.description,
    milestone_date: milestone.milestone_date.split('T')[0],
    category: milestone.category,
    photo_url: milestone.photo_url || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedMilestone = await updateMilestone(milestone.id, formData);
      if (updatedMilestone) {
        router.push('/admin/milestones');
      }
    } catch (err) {
      setError('更新里程碑失败');
      console.error(err);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建画布'));
            return;
          }

          let width = img.width;
          let height = img.height;
          const maxSize = 1200;
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('无法压缩图片'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.8
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const compressedFile = await compressImage(file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const photoUrl = await uploadMilestonePhoto(compressedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (photoUrl) {
        setFormData(prev => ({ ...prev, photo_url: photoUrl }));
      } else {
        setError('上传照片失败');
      }
    } catch (err) {
      setError('上传照片失败');
      console.error(err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePhotoDelete = async () => {
    if (!formData.photo_url) return;

    try {
      const success = await deleteMilestonePhoto(formData.photo_url);
      if (success) {
        setFormData(prev => ({ ...prev, photo_url: '' }));
      } else {
        setError('删除照片失败');
      }
    } catch (err) {
      setError('删除照片失败');
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标题 📝
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述 📄
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日期 📅
          </label>
          <input
            type="date"
            value={formData.milestone_date}
            onChange={(e) => setFormData(prev => ({ ...prev, milestone_date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分类 🎨
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            照片 📸
          </label>
          {formData.photo_url && (
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden group">
              <Image
                src={formData.photo_url}
                alt="里程碑照片"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handlePhotoDelete}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                🗑️
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="w-full max-w-xs">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    上传中... {uploadProgress}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/milestones')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消 ❌
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            保存 ✅
          </button>
        </div>
      </div>
    </form>
  );
} 