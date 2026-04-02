'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('获取里程碑失败:', error);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-4">
          ✨ 成长里程碑
        </h1>
        <p className="text-gray-600">记录每一个重要时刻</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative h-48">
              <img
                src={milestone.image_url}
                alt={milestone.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-qingke text-candy-purple mb-2">{milestone.title}</h2>
              <p className="text-sm text-gray-500 mb-3">
                📅 {new Date(milestone.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-700">{milestone.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {milestones.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无里程碑记录
        </div>
      )}
    </div>
  );
}
