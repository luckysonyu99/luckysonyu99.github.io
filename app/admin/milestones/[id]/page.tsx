'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image_url?: string;
}

export async function generateStaticParams() {
  try {
    const { data: milestones } = await supabase
      .from('milestones')
      .select('id');

    return (milestones || []).map((milestone) => ({
      id: milestone.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function MilestonePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMilestone();
  }, []);

  const fetchMilestone = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setMilestone(data);
    } catch (error) {
      console.error('Error fetching milestone:', error);
      router.push('/admin/milestones');
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

  if (!milestone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-qingke text-gray-600 mb-4">里程碑不存在</h1>
        <button
          onClick={() => router.push('/admin/milestones')}
          className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
        >
          返回列表
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-qingke text-candy-purple">{milestone.title}</h1>
          <button
            onClick={() => router.push('/admin/milestones')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            返回列表
          </button>
        </div>

        {milestone.image_url && (
          <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
            <img
              src={milestone.image_url}
              alt={milestone.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">日期</h2>
            <p className="text-gray-700">{milestone.date}</p>
          </div>

          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">分类</h2>
            <p className="text-gray-700">{milestone.category}</p>
          </div>

          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">描述</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{milestone.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 