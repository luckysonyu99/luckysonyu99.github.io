'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMilestones } from '@/models/milestone';
import type { Milestone } from '@/models/milestone';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">成长里程碑</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{milestone.title}</h2>
            <p className="text-gray-600 mb-4">{milestone.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{new Date(milestone.milestone_date).toLocaleDateString()}</span>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                {milestone.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 