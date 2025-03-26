'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardStats {
  milestones: number;
  gallery: number;
  records: number;
}

interface RecentActivity {
  type: 'milestone' | 'gallery' | 'record';
  title: string;
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    milestones: 0,
    gallery: 0,
    records: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 获取里程碑数量
        const { count: milestonesCount } = await supabase
          .from('milestones')
          .select('*', { count: 'exact', head: true });

        // 获取相册数量
        const { count: galleryCount } = await supabase
          .from('gallery')
          .select('*', { count: 'exact', head: true });

        // 获取记录数量
        const { count: recordsCount } = await supabase
          .from('records')
          .select('*', { count: 'exact', head: true });

        setStats({
          milestones: milestonesCount || 0,
          gallery: galleryCount || 0,
          records: recordsCount || 0,
        });

        // 获取最近活动
        const { data: recentMilestones } = await supabase
          .from('milestones')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: recentGallery } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: recentRecords } = await supabase
          .from('records')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        const activities: RecentActivity[] = [
          ...(recentMilestones?.map(m => ({
            type: 'milestone' as const,
            title: `添加了新里程碑：${m.title}`,
            date: new Date(m.created_at).toLocaleDateString('zh-CN'),
          })) || []),
          ...(recentGallery?.map(g => ({
            type: 'gallery' as const,
            title: `上传了新照片：${g.title}`,
            date: new Date(g.created_at).toLocaleDateString('zh-CN'),
          })) || []),
          ...(recentRecords?.map(r => ({
            type: 'record' as const,
            title: `添加了新记录：${r.title}`,
            date: new Date(r.created_at).toLocaleDateString('zh-CN'),
          })) || []),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">⚙️</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-6 animate-float tracking-wider">
          管理后台 
          <span className="inline-block animate-wiggle ml-2">⚙️</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 tracking-wide">
          在这里管理宝宝成长的点点滴滴
        </p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center"
        >
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-xl font-qingke text-candy-purple mb-2">里程碑</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.milestones}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center"
        >
          <div className="text-4xl mb-2">📸</div>
          <h3 className="text-xl font-qingke text-candy-purple mb-2">相册</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.gallery}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center"
        >
          <div className="text-4xl mb-2">📝</div>
          <h3 className="text-xl font-qingke text-candy-purple mb-2">日常记录</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.records}</p>
        </motion.div>
      </div>

      {/* 最近活动 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
      >
        <h2 className="text-2xl font-qingke text-candy-purple mb-6">最近更新</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
              <span className="text-2xl">
                {activity.type === 'milestone' ? '🎯' : activity.type === 'gallery' ? '📸' : '📝'}
              </span>
              <div>
                <p className="text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 快捷操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link href="/admin/milestones/new" className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 text-center hover:bg-white/80 transition-colors">
          <span className="text-2xl block mb-2">🎯</span>
          <span className="text-gray-900">添加里程碑</span>
        </Link>
        <Link href="/admin/gallery/new" className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 text-center hover:bg-white/80 transition-colors">
          <span className="text-2xl block mb-2">📸</span>
          <span className="text-gray-900">上传照片</span>
        </Link>
        <Link href="/admin/records/new" className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 text-center hover:bg-white/80 transition-colors">
          <span className="text-2xl block mb-2">📝</span>
          <span className="text-gray-900">写日常</span>
        </Link>
        <Link href="/admin/settings" className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 text-center hover:bg-white/80 transition-colors">
          <span className="text-2xl block mb-2">⚙️</span>
          <span className="text-gray-900">设置</span>
        </Link>
      </motion.div>
    </div>
  );
} 