'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getMilestone, updateMilestone, uploadMilestonePhoto } from '@/models/milestone';
import type { Milestone } from '@/models/milestone';
import Image from 'next/image';

export default function EditMilestonePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestone_date: '',
    category: '',
    photo_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchMilestone = async () => {
      try {
        const data = await getMilestone(parseInt(params.id));
        if (data) {
          setMilestone(data);
          setFormData({
            title: data.title,
            description: data.description,
            milestone_date: data.milestone_date.split('T')[0],
            category: data.category,
            photo_url: data.photo_url || '',
          });
        }
      } catch (err) {
        setError('获取里程碑数据失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestone();
  }, [loading, user, router, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedMilestone = await updateMilestone(parseInt(params.id), formData);
      if (updatedMilestone) {
        router.push('/admin/milestones');
      }
    } catch (err) {
      setError('更新里程碑失败');
      console.error(err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const photoUrl = await uploadMilestonePhoto(file);
      if (photoUrl) {
        setFormData(prev => ({ ...prev, photo_url: photoUrl }));
      } else {
        setError('上传照片失败');
      }
    } catch (err) {
      setError('上传照片失败');
      console.error(err);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">未找到里程碑</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">编辑里程碑 ✨</h1>
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
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={formData.photo_url}
                  alt="里程碑照片"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
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
    </div>
  );
} 