'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Milestone, milestoneService } from '@/lib/milestoneService';

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const data = await milestoneService.getMilestones();
        setMilestones(data);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">🎯</div>
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
          成长里程碑 
          <span className="inline-block animate-wiggle ml-2">🎯</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 tracking-wide">
          记录每一个重要时刻
        </p>
      </motion.div>

      <div className="relative">
        {/* 时间轴线 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-candy-pink via-candy-blue to-candy-yellow rounded-full"></div>

        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              } gap-8`}
            >
              {/* 时间点 */}
              <div className={`w-1/2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <div className={`p-6 ${
                  index % 2 === 0 ? 'ml-auto' : 'mr-auto'
                } max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{milestone.emoji}</span>
                    <h3 className="text-xl font-qingke text-candy-purple tracking-wide">
                      {milestone.title}
                    </h3>
                  </div>
                  <time className="text-sm text-gray-500 mb-2 block">
                    {new Date(milestone.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <p className="text-gray-600 tracking-wide">
                    {milestone.description}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-candy-pink/10 text-candy-pink rounded-full text-sm">
                      {milestone.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 时间轴圆点 */}
              <div className="relative flex items-center justify-center w-8">
                <div className="w-4 h-4 bg-white rounded-full border-4 border-candy-pink z-10"></div>
              </div>

              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 