'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth';

interface Stats {
  milestones: number;
  photos: number;
  users: number;
}

export default function AdminHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ milestones: 0, photos: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [milestonesCount, photosCount, usersCount] = await Promise.all([
          supabase.from('milestones').select('*', { count: 'exact', head: true }),
          supabase.from('photos').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          milestones: milestonesCount.count || 0,
          photos: photosCount.count || 0,
          users: usersCount.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: '里程碑', value: stats.milestones, icon: '🎯', color: 'from-pink-500 to-rose-500' },
    { label: '相册照片', value: stats.photos, icon: '🖼️', color: 'from-purple-500 to-indigo-500' },
    { label: '用户数量', value: stats.users, icon: '👥', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <span className="text-3xl lg:text-4xl">👋</span>
        <h1 className="text-2xl lg:text-3xl font-qingke text-candy-purple">
          欢迎回来！
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${card.color} p-4 lg:p-6 rounded-2xl shadow-lg text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl lg:text-4xl mb-2">{card.icon}</div>
                <h2 className="text-base lg:text-lg font-medium opacity-90">{card.label}</h2>
                <div className="text-2xl lg:text-3xl font-bold mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-white/20 h-6 lg:h-8 w-12 lg:w-16 rounded" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.5 + index * 0.1
                }}
                className="text-4xl lg:text-6xl opacity-25"
              >
                {card.icon}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-xl lg:text-2xl">💡</span>
          <h2 className="text-lg lg:text-xl font-medium text-gray-800">快捷操作</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[
            { label: '添加里程碑', icon: '✨', path: '/admin/milestones' },
            { label: '上传照片', icon: '📸', path: '/admin/gallery' },
            { label: '管理用户', icon: '👥', path: '/admin/users' },
            { label: '系统设置', icon: '⚙️', path: '/admin/settings' },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(action.path)}
              className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl lg:text-2xl">{action.icon}</span>
              <span className="font-medium text-sm lg:text-base text-gray-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 