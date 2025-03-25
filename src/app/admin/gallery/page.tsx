'use client';

import { useState, useEffect } from 'react';
import ImagePreview from '@/components/ImagePreview';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface GalleryItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  mediaUrls: string[];
  tags: string[];
  type: 'photo';
  order?: number;
}

export default function GalleryManagePage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [availableTags, setAvailableTags] = useState<string[]>([]);

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
      // 按 order 字段排序，如果没有则按日期降序
      const sortedItems = photoItems.sort((a: GalleryItem, b: GalleryItem) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setItems(sortedItems);
      
      // 收集所有标签
      const allTags = photoItems.reduce((acc: string[], item: GalleryItem) => {
        return [...acc, ...item.tags];
      }, []);
      setAvailableTags(Array.from(new Set(allTags)));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取照片失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这张照片吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const currentItems = Array.from(items);
    const [reorderedItem] = currentItems.splice(result.source.index, 1);
    currentItems.splice(result.destination.index, 0, reorderedItem);

    setItems(currentItems);

    // 更新排序
    try {
      const updates = currentItems.map((item: GalleryItem, index: number) => ({
        id: item._id,
        order: index,
      }));

      const response = await fetch('/api/records/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('更新排序失败');
      }
    } catch (err) {
      console.error('更新排序失败:', err);
      // 如果更新失败，重新获取数据
      fetchGalleryItems();
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedTags.size === 0) return true;
    return item.tags.some(tag => selectedTags.has(tag));
  });

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">照片墙管理</h1>
        <Link
          href="/admin/records/new"
          className="bg-boy-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          添加新照片
        </Link>
      </div>

      {/* 标签筛选 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">标签筛选</h2>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTags.has(tag)
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white rounded-lg shadow overflow-hidden ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <div className="h-48">
                        <ImagePreview
                          src={item.mediaUrls[0]}
                          alt={item.title}
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{item.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/records/${item._id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          没有找到相关照片
        </div>
      )}
    </div>
  );
} 