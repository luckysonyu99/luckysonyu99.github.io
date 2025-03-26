'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Milestone, getMilestones, createMilestone, updateMilestone, deleteMilestone } from '@/models/milestone';

export default function MilestonesAdminPage() {
  const { data: session } = useSession();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    milestone_date: '',
    category: ''
  });

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const data = await getMilestones();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentMilestone.id) {
        await updateMilestone(currentMilestone.id, currentMilestone);
      } else {
        await createMilestone(currentMilestone as Omit<Milestone, 'id' | 'created_at' | 'updated_at'>);
      }
      setCurrentMilestone({
        title: '',
        description: '',
        milestone_date: '',
        category: ''
      });
      setIsEditing(false);
      fetchMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setCurrentMilestone(milestone);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个里程碑吗？')) {
      try {
        await deleteMilestone(id);
        fetchMilestones();
      } catch (error) {
        console.error('Error deleting milestone:', error);
      }
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600 mb-4">请先登录</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">里程碑管理</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                value={currentMilestone.title}
                onChange={(e) => setCurrentMilestone({ ...currentMilestone, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">日期</label>
              <input
                type="date"
                value={currentMilestone.milestone_date}
                onChange={(e) => setCurrentMilestone({ ...currentMilestone, milestone_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">类别</label>
              <input
                type="text"
                value={currentMilestone.category}
                onChange={(e) => setCurrentMilestone({ ...currentMilestone, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                value={currentMilestone.description}
                onChange={(e) => setCurrentMilestone({ ...currentMilestone, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink"
                rows={3}
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMilestone({
                    title: '',
                    description: '',
                    milestone_date: '',
                    category: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-candy-pink text-white rounded-md hover:bg-candy-pink/90"
            >
              {isEditing ? '更新' : '添加'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
              <p className="text-gray-600 mb-4">{milestone.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{milestone.category}</span>
                <span>{new Date(milestone.milestone_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(milestone)}
                  className="text-candy-blue hover:text-candy-blue/80"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(milestone.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 