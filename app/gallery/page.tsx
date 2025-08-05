'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import userbase from 'userbase-js';

interface Photo {
  itemId: string;
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
    userbase.init({ appId: '0b2844f0-e722-4251-a270-35200be9756a' })
      .then(() => {
        userbase.openDatabase({
          databaseName: 'photos',
          changeHandler: (items) => {
            setPhotos(items.map(item => ({ ...item.item, itemId: item.itemId } as Photo)));
            setIsLoading(false);
          }
        })
        .catch((e) => {
          console.error('Error opening photos database:', e);
          setIsLoading(false);
        });
      })
      .catch((e) => {
        console.error('Userbase 初始化失败:', e);
        setIsLoading(false);
      });
  }, []);

  const categories = ['全部', '生活', '旅行', '美食', '风景', '其他'];
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-qingke text-candy-purple">相册</h1>
        <div className="flex space-x-2">
          {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors font-kuaile ${
                  selectedCategory === category
                    ? 'bg-candy-pink text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-candy-pink/10'
                }`}
              >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.itemId}
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
            <p className="text-gray-700">{photo.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="h-20 sm:h-0"></div> {/* Add extra space for mobile navbar */}
    </div>
  );
}

