'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Milestone, milestoneService } from '@/lib/milestoneService';

const categories = ['成长', '学习', '生活', '有趣', '其他'] as const;
const emojis = ['👶', '🔄', '😊', '🎯', '🎨', '🎵', '🎮', '📚', '🍼', '🦁', '🌟', '💫'];

export default function MilestonesAdmin() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, 'id' | 'created_at'>>({
    title: '',
    description: '',
    date: '',
    category: '成长',
    emoji: '🎯',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const data = await milestoneService.getMilestones();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      setMessage('获取里程碑数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const milestone = await milestoneService.createMilestone(newMilestone);
      setMilestones(prev => [milestone, ...prev]);
      setNewMilestone({
        title: '',
        description: '',
        date: '',
        category: '成长',
        emoji: '🎯',
      });
      setMessage('添加成功');
    } catch (error) {
      console.error('Error adding milestone:', error);
      setMessage('添加失败');
    }
  };

  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    try {
      const updatedMilestone = await milestoneService.updateMilestone(
        editingMilestone.id,
        editingMilestone
      );
      setMilestones(prev =>
        prev.map(m =>
          m.id === updatedMilestone.id ? updatedMilestone : m
        )
      );
      setEditingMilestone(null);
      setMessage('更新成功');
    } catch (error) {
      console.error('Error updating milestone:', error);
      setMessage('更新失败');
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      await milestoneService.deleteMilestone(id);
      setMilestones(prev => prev.filter(m => m.id !== id));
      setMessage('删除成功');
    } catch (error) {
      console.error('Error deleting milestone:', error);
      setMessage('删除失败');
    }
  };

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
          里程碑管理
        </h1>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-2xl font-kuaile text-candy-purple mb-4">
            {editingMilestone ? '编辑里程碑' : '添加新里程碑'}
          </h2>
          <form onSubmit={editingMilestone ? handleUpdateMilestone : handleAddMilestone} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                value={editingMilestone?.title || newMilestone.title}
                onChange={(e) => {
                  if (editingMilestone) {
                    setEditingMilestone(prev => prev ? { ...prev, title: e.target.value } : null);
                  } else {
                    setNewMilestone(prev => ({ ...prev, title: e.target.value }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                value={editingMilestone?.description || newMilestone.description}
                onChange={(e) => {
                  if (editingMilestone) {
                    setEditingMilestone(prev => prev ? { ...prev, description: e.target.value } : null);
                  } else {
                    setNewMilestone(prev => ({ ...prev, description: e.target.value }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">日期</label>
              <input
                type="date"
                value={editingMilestone?.date || newMilestone.date}
                onChange={(e) => {
                  if (editingMilestone) {
                    setEditingMilestone(prev => prev ? { ...prev, date: e.target.value } : null);
                  } else {
                    setNewMilestone(prev => ({ ...prev, date: e.target.value }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">分类</label>
              <select
                value={editingMilestone?.category || newMilestone.category}
                onChange={(e) => {
                  if (editingMilestone) {
                    setEditingMilestone(prev => prev ? { ...prev, category: e.target.value as Milestone['category'] } : null);
                  } else {
                    setNewMilestone(prev => ({ ...prev, category: e.target.value as Milestone['category'] }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                required
              >
                <option value="成长">成长</option>
                <option value="学习">学习</option>
                <option value="生活">生活</option>
                <option value="有趣">有趣</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">表情</label>
              <input
                type="text"
                value={editingMilestone?.emoji || newMilestone.emoji}
                onChange={(e) => {
                  if (editingMilestone) {
                    setEditingMilestone(prev => prev ? { ...prev, emoji: e.target.value } : null);
                  } else {
                    setNewMilestone(prev => ({ ...prev, emoji: e.target.value }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-purple focus:ring-candy-purple"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-candy-purple text-white py-2 px-4 rounded-md hover:bg-candy-purple/90 focus:outline-none focus:ring-2 focus:ring-candy-purple focus:ring-offset-2"
              >
                {editingMilestone ? '更新' : '添加'}
              </button>
              {editingMilestone && (
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  取消
                </button>
              )}
            </div>
          </form>
        </div>

        {message && (
          <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
            {message}
          </div>
        )}

        <div className="space-y-4">
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
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-candy-purple bg-candy-purple/10 rounded-full">
                      {milestone.category}
                    </span>
                    <div className="space-x-4">
                      <button
                        onClick={() => setEditingMilestone(milestone)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </div>
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