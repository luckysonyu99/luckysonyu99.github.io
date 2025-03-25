'use client';

import { useState, useEffect } from 'react';
import ImagePreview from '@/components/ImagePreview';

interface TimelineItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  mediaUrls: string[];
  tags: string[];
  type: 'text' | 'photo' | 'video';
}

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'text' | 'photo' | 'video'>('all');

  useEffect(() => {
    fetchTimelineItems();
  }, []);

  const fetchTimelineItems = async () => {
    try {
      const response = await fetch('/api/records');
      if (!response.ok) {
        throw new Error('获取记录失败');
      }
      const data = await response.json();
      // 按日期降序排序
      const sortedItems = data.sort((a: TimelineItem, b: TimelineItem) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setItems(sortedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取记录失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedType === 'all'
    ? items
    : items.filter(item => item.type === selectedType);

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">成长时间线</h1>

      {/* 类型筛选 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedType === 'all'
                ? 'bg-boy-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSelectedType('text')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedType === 'text'
                ? 'bg-boy-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            文字
          </button>
          <button
            onClick={() => setSelectedType('photo')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedType === 'photo'
                ? 'bg-boy-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            照片
          </button>
          <button
            onClick={() => setSelectedType('video')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedType === 'video'
                ? 'bg-boy-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            视频
          </button>
        </div>
      </div>

      {/* 时间线 */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
        
        {filteredItems.map((item, index) => (
          <div key={item._id} className="relative mb-8">
            <div className={`flex items-center ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(item.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  
                  {item.mediaUrls.length > 0 && (
                    <div className="mb-4">
                      {item.type === 'photo' && (
                        <div className="h-48 w-full">
                          <ImagePreview
                            src={item.mediaUrls[0]}
                            alt={item.title}
                          />
                        </div>
                      )}
                      {item.type === 'video' && (
                        <video
                          src={item.mediaUrls[0]}
                          controls
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  
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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-boy-blue rounded-full"></div>
              <div className="w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          没有找到相关记录
        </div>
      )}
    </div>
  );
} 