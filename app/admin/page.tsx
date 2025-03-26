'use client';
import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    title: '里程碑',
    value: '12',
    icon: '🎯',
    color: 'candy-pink',
  },
  {
    title: '相册',
    value: '56',
    icon: '📸',
    color: 'candy-blue',
  },
  {
    title: '日常记录',
    value: '23',
    icon: '📝',
    color: 'candy-yellow',
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-qingke text-candy-purple mb-4">
          欢迎回来 👋
        </h1>
        <p className="text-gray-600">
          在这里管理宝宝成长的点点滴滴
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-gray-700">{stat.title}</h3>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
        >
          <h3 className="text-xl font-medium text-gray-700 mb-4">最近更新</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">📸</span>
              <div>
                <p className="font-medium text-gray-700">上传了新照片</p>
                <p className="text-sm text-gray-500">2024年3月15日</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-medium text-gray-700">添加了新里程碑</p>
                <p className="text-sm text-gray-500">2024年3月14日</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
        >
          <h3 className="text-xl font-medium text-gray-700 mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-4 rounded-lg bg-candy-pink/10 text-candy-pink hover:bg-candy-pink/20 transition-colors">
              <span className="text-xl">📸</span>
              <span>上传照片</span>
            </button>
            <button className="flex items-center gap-2 p-4 rounded-lg bg-candy-blue/10 text-candy-blue hover:bg-candy-blue/20 transition-colors">
              <span className="text-xl">🎯</span>
              <span>添加里程碑</span>
            </button>
            <button className="flex items-center gap-2 p-4 rounded-lg bg-candy-yellow/10 text-candy-yellow hover:bg-candy-yellow/20 transition-colors">
              <span className="text-xl">📝</span>
              <span>写日常</span>
            </button>
            <button className="flex items-center gap-2 p-4 rounded-lg bg-candy-purple/10 text-candy-purple hover:bg-candy-purple/20 transition-colors">
              <span className="text-xl">⚙️</span>
              <span>设置</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 