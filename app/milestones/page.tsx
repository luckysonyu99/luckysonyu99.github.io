'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMilestones } from '@/models/milestone';
import type { Milestone } from '@/models/milestone';
import Image from 'next/image';

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const data = await getMilestones();
        setMilestones(data);
      } catch (err) {
        setError('获取里程碑数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">成长里程碑 🌱</h1>
        <p className="text-center text-gray-600 mb-12">记录每一个精彩瞬间 ✨</p>
        
        <div className="relative max-w-4xl mx-auto">
          {/* 成长树装饰 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-200 via-blue-200 to-yellow-200"></div>
          
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
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-4 border-pink-400 shadow-lg flex items-center justify-center">
                  <span className="text-pink-600 text-sm">🌱</span>
                </div>

                {/* 里程碑卡片 */}
                <div className={`w-1/2 ${
                  index % 2 === 0 ? 'pr-8' : 'pl-8'
                }`}>
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow glass-card">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">✨</span>
                      <h2 className="text-xl font-bold text-pink-600">{milestone.title}</h2>
                    </div>
                    <p className="text-gray-600 mb-4">{milestone.description}</p>
                    
                    {/* 照片显示区域 */}
                    {milestone.photo_url && (
                      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={milestone.photo_url}
                          alt={milestone.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center text-gray-500">
                        <span className="mr-1">📅</span>
                        {new Date(milestone.milestone_date).toLocaleDateString()}
                      </span>
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center">
                        <span className="mr-1">🎨</span>
                        {milestone.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 底部装饰 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-16 h-16 bg-white rounded-full border-4 border-pink-400 shadow-lg flex items-center justify-center">
            <span className="text-2xl">🌳</span>
          </div>
        </div>
      </div>
    </div>
  );
} 