'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/auth';

interface Stats {
  milestones: number;
  photos: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ milestones: 0, photos: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [milestonesResponse, photosResponse] = await Promise.all([
        supabase.from('milestones').select('id', { count: 'exact' }),
        supabase.from('photos').select('id', { count: 'exact' }),
      ]);

      setStats({
        milestones: milestonesResponse.count || 0,
        photos: photosResponse.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-qingke text-candy-purple">后台管理</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-qingke text-candy-purple mb-4">里程碑</h2>
          <p className="text-4xl font-bold text-gray-700">{stats.milestones}</p>
          <p className="text-gray-500 mt-2">已创建的里程碑数量</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-qingke text-candy-purple mb-4">相册</h2>
          <p className="text-4xl font-bold text-gray-700">{stats.photos}</p>
          <p className="text-gray-500 mt-2">已上传的照片数量</p>
        </motion.div>
      </div>
    </div>
  );
} 