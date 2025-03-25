'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';

interface GrowthRecordFormProps {
  initialData?: {
    _id?: string;
    title: string;
    content: string;
    date: string;
    type: 'text' | 'photo' | 'video';
    mediaUrls: string[];
    tags: string[];
  };
}

export default function GrowthRecordForm({ initialData }: GrowthRecordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    type: initialData?.type || 'text',
    mediaUrls: initialData?.mediaUrls || [],
    tags: initialData?.tags || [],
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData?._id
        ? `/api/records/${initialData._id}`
        : '/api/records';
      
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存失败');
      }

      router.push('/admin/records');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleFileUpload = (url: string) => {
    setFormData({
      ...formData,
      mediaUrls: [...formData.mediaUrls, url],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          标题
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-boy-blue focus:ring-boy-blue sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          内容
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-boy-blue focus:ring-boy-blue sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          日期
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-boy-blue focus:ring-boy-blue sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          类型
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'text' | 'photo' | 'video' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-boy-blue focus:ring-boy-blue sm:text-sm"
        >
          <option value="text">文字</option>
          <option value="photo">照片</option>
          <option value="video">视频</option>
        </select>
      </div>

      {(formData.type === 'photo' || formData.type === 'video') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上传{formData.type === 'photo' ? '照片' : '视频'}
          </label>
          <FileUpload
            onUploadComplete={handleFileUpload}
            accept={formData.type === 'photo' ? 'image/*' : 'video/*'}
          />
          {formData.mediaUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {formData.mediaUrls.map((url, index) => (
                <div key={index} className="relative">
                  {formData.type === 'photo' ? (
                    <img
                      src={url}
                      alt={`上传的${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={url}
                      controls
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        mediaUrls: formData.mediaUrls.filter((_, i) => i !== index),
                      });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-boy-blue text-white"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-red-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddTag} className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="添加新标签"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-boy-blue focus:ring-boy-blue sm:text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-boy-blue text-white rounded-md hover:bg-boy-blue/90"
          >
            添加
          </button>
        </form>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-boy-blue text-white rounded-md hover:bg-boy-blue/90 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
} 