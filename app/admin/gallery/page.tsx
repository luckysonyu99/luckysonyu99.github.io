'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id' | 'created_at'>>({
    title: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGallery(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const { error } = await supabase
        .from('gallery')
        .insert([newItem]);

      if (error) throw error;

      await fetchGallery();
      setNewItem({
        title: '',
        description: '',
        image_url: '',
      });
    } catch (error) {
      console.error('Error adding gallery item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">📸</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-6 animate-float tracking-wider">
          相册管理 
          <span className="inline-block animate-wiggle ml-2">📸</span>
        </h1>
      </motion.div>

      {/* 添加新照片表单 */}
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <h2 className="text-2xl font-qingke text-candy-blue mb-6">添加新照片</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              placeholder="输入照片标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              rows={3}
              placeholder="输入照片描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
            <input
              type="text"
              value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              placeholder="输入图片URL"
            />
          </div>

          <button
            onClick={handleAddItem}
            className="w-full bg-gradient-to-r from-candy-pink to-candy-purple text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            添加照片
          </button>
        </div>
      </div>

      {/* 照片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-qingke text-candy-purple mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <time className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString('zh-CN')}
                </time>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-candy-pink hover:text-red-500 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 