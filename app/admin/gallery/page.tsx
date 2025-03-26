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
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setMessage('获取相册数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setNewItem(prev => ({ ...prev, image_url: publicUrl }));
      setMessage('图片上传成功');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('gallery')
        .insert([newItem]);

      if (error) throw error;

      setNewItem({ title: '', description: '', image_url: '' });
      setMessage('添加成功');
      fetchGalleryItems();
    } catch (error) {
      console.error('Error adding gallery item:', error);
      setMessage('添加失败');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('删除成功');
      fetchGalleryItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      setMessage('删除失败');
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
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-6 animate-float tracking-wider">
          相册管理
        </h1>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-2xl font-kuaile text-candy-purple mb-4">添加新照片</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">图片</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full"
                required
              />
              {newItem.image_url && (
                <img
                  src={newItem.image_url}
                  alt="预览"
                  className="mt-2 h-32 w-32 object-cover rounded-lg"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-candy-purple text-white py-2 px-4 rounded-md hover:bg-candy-purple/90 focus:outline-none focus:ring-2 focus:ring-candy-purple focus:ring-offset-2"
            >
              {uploading ? '上传中...' : '添加照片'}
            </button>
          </form>
        </div>

        {message && (
          <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-kuaile text-candy-purple mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 