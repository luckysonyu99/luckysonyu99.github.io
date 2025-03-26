'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Milestone, milestoneService } from '../lib/milestoneService';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{milestone.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-kuaile text-candy-purple">{milestone.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{milestone.description}</p>
                  <div className="mt-4">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-candy-purple bg-candy-purple/10 rounded-full">
                      {milestone.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 