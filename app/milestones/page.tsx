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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-qingke text-candy-purple">成长里程碑</h1>
      </div>

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className="absolute left-0 w-4 h-4 bg-candy-pink rounded-full -translate-x-2 translate-y-2"></div>
            <div className="ml-8 space-y-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-qingke text-candy-purple">{milestone.title}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(milestone.date).toLocaleDateString()}
                </span>
              </div>
              {milestone.image_url && (
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img
                    src={milestone.image_url}
                    alt={milestone.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-gray-700 whitespace-pre-wrap">{milestone.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 