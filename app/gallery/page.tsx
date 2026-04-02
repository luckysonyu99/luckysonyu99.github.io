'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  useEffect(() => {
    fetchPhotos();
  }, []);

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

  const categories = ['全部', '生活', '旅行', '美食', '风景', '学习', '玩耍', '其他'];
  const filteredPhotos = selectedCategory === '全部'
    ? photos
    : photos.filter(photo => photo.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-4">
          📸 成长相册
        </h1>
        <p className="text-gray-600">记录每一个精彩瞬间</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full transition-all ${
              selectedCategory === category
                ? 'bg-candy-pink text-white shadow-lg scale-105'
                : 'bg-white/80 text-gray-700 hover:bg-candy-pink/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative aspect-square">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-qingke text-candy-purple mb-1">{photo.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
              <span className="inline-block px-3 py-1 bg-candy-blue/10 text-candy-blue text-xs rounded-full">
                {photo.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无照片
        </div>
      )}
    </div>
  );
}
