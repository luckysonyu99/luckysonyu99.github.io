'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Milestone, milestoneService } from '@/lib/milestoneService';

const categories = ['成长', '学习', '生活', '有趣', '其他'] as const;
const emojis = ['👶', '🔄', '😊', '🎯', '🎨', '🎵', '🎮', '📚', '🍼', '🦁', '🌟', '💫'];

export default function MilestonesAdmin() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, 'id' | 'created_at'>>({
    date: '',
    title: '',
    description: '',
    category: '成长',
    emoji: '👶',
  });

  useEffect(() => {
    fetchMilestones();
  }, []);

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

  const handleAddMilestone = async () => {
    try {
      await milestoneService.addMilestone(newMilestone);
      await fetchMilestones();
      setNewMilestone({
        date: '',
        title: '',
        description: '',
        category: '成长',
        emoji: '👶',
      });
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      await milestoneService.deleteMilestone(id);
      await fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">⚙️</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-6 animate-float tracking-wider">
          里程碑管理 
          <span className="inline-block animate-wiggle ml-2">⚙️</span>
        </h1>
      </motion.div>

      {/* 添加新里程碑表单 */}
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <h2 className="text-2xl font-qingke text-candy-blue mb-6">添加新里程碑</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
              <select
                value={newMilestone.category}
                onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              placeholder="输入里程碑标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              rows={3}
              placeholder="输入里程碑描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表情</label>
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewMilestone({ ...newMilestone, emoji })}
                  className={`text-2xl p-2 rounded-lg hover:bg-gray-100 ${
                    newMilestone.emoji === emoji ? 'bg-candy-pink/10 ring-2 ring-candy-pink' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddMilestone}
            className="w-full bg-gradient-to-r from-candy-pink to-candy-purple text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            添加里程碑
          </button>
        </div>
      </div>

      {/* 里程碑列表 */}
      <div className="max-w-2xl mx-auto space-y-4">
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{milestone.emoji}</span>
                <h3 className="text-xl font-qingke text-candy-purple">{milestone.title}</h3>
              </div>
              <button
                onClick={() => handleDeleteMilestone(milestone.id)}
                className="text-candy-pink hover:text-red-500 transition-colors"
              >
                删除
              </button>
            </div>
            <time className="text-sm text-gray-500 block mb-2">
              {new Date(milestone.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <p className="text-gray-600 mb-3">{milestone.description}</p>
            <span className="inline-block px-3 py-1 bg-candy-pink/10 text-candy-pink rounded-full text-sm">
              {milestone.category}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 