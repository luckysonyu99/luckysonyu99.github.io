'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/auth';

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
      console.error('Error fetching milestones:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-qingke text-center text-candy-purple mb-4">成长里程碑 🌱</h1>
        <p className="text-center text-gray-600 mb-12">记录每一个精彩瞬间 ✨</p>
        
        <div className="relative max-w-4xl mx-auto">
          {/* 成长树装饰 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-candy-pink via-candy-blue to-candy-purple"></div>
          
          {/* 里程碑列表 */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* 时间轴节点 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-4 border-candy-pink shadow-lg flex items-center justify-center">
                  <span className="text-candy-pink text-sm">🌱</span>
                </div>

                {/* 里程碑卡片 */}
                <div className={`w-1/2 ${
                  index % 2 === 0 ? 'pr-8' : 'pl-8'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">✨</span>
                      <h2 className="text-xl font-qingke text-candy-purple">{milestone.title}</h2>
                    </div>
                    
                    {milestone.image_url && (
                      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                        <img
                          src={milestone.image_url}
                          alt={milestone.title}
                          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{milestone.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 底部装饰 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-16 h-16 bg-white rounded-full border-4 border-candy-pink shadow-lg flex items-center justify-center">
            <span className="text-2xl">🌳</span>
          </div>
        </div>
      </div>
    </div>
  );
} 