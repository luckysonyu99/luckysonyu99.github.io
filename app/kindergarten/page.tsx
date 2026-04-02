'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
}

interface Photo {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export default function KindergartenPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .order('date', { ascending: false })
        .limit(6);

      const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('age_period', 'kindergarten')
        .order('created_at', { ascending: false })
        .limit(8);

      setMilestones(milestonesData || []);
      setPhotos(photosData || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 opacity-10"></div>
        <div className="absolute top-10 left-10 text-6xl animate-bounce">⚡</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse">💫</div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent"
          >
            幼儿园时期 ⚡
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-gray-700 font-bold"
          >
            3-6岁的冒险之旅 🚗🏰🛹
          </motion.p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-purple-600"
          >
            ✨ 成长里程碑 ✨
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300"
              >
                <div className="relative h-48">
                  <img
                    src={milestone.image_url}
                    alt={milestone.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-purple-600 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 mb-3">{milestone.description}</p>
                  <p className="text-sm text-gray-500">📅 {new Date(milestone.date).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-cyan-100 via-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: '超级英雄', desc: '勇敢探索世界', color: 'from-red-500 to-blue-500' },
              { icon: '🚗', title: '速度与激情', desc: '快乐奔跑玩耍', color: 'from-orange-500 to-yellow-500' },
              { icon: '🏰', title: '梦想城堡', desc: '想象力无限', color: 'from-pink-500 to-purple-500' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`bg-gradient-to-br ${item.color} p-8 rounded-3xl shadow-2xl text-white text-center`}
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-lg opacity-90">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
