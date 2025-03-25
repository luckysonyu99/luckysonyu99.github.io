'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  mediaUrls: string[];
  tags: string[];
  type: 'text' | 'photo' | 'video';
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/records');
      if (!response.ok) {
        throw new Error('获取照片失败');
      }
      const data = await response.json();
      const photoItems = data.filter((item: GalleryItem) => item.type === 'photo');
      setItems(photoItems);
      
      // 收集所有标签
      const allTags = photoItems.reduce((acc: string[], item: GalleryItem) => {
        return [...acc, ...item.tags];
      }, []);
      setTags(Array.from(new Set(allTags)));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取照片失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedTag
    ? items.filter(item => item.tags.includes(selectedTag))
    : items;

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">照片墙</h1>

      {/* 标签筛选 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedTag === null
                ? 'bg-boy-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTag === tag
                  ? 'bg-boy-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 照片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-64">
              <Image
                src={item.mediaUrls[0]}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 mb-4">{item.content}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          没有找到相关照片
        </div>
      )}
    </div>
  );
} 