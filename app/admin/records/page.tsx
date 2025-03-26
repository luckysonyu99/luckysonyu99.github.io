'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface RecordItem {
  id: string;
  title: string;
  content: string;
  date: string;
  created_at: string;
}

export default function RecordsAdmin() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Omit<RecordItem, 'id' | 'created_at'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const { error } = await supabase
        .from('records')
        .insert([newItem]);

      if (error) throw error;

      await fetchRecords();
      setNewItem({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">📝</div>
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
          日常记录管理 
          <span className="inline-block animate-wiggle ml-2">📝</span>
        </h1>
      </motion.div>

      {/* 添加新记录表单 */}
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <h2 className="text-2xl font-qingke text-candy-blue mb-6">添加新记录</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              placeholder="输入记录标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
              type="date"
              value={newItem.date}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              rows={6}
              placeholder="输入记录内容"
            />
          </div>

          <button
            onClick={handleAddItem}
            className="w-full bg-gradient-to-r from-candy-pink to-candy-purple text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            添加记录
          </button>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="space-y-6">
        {records.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-qingke text-candy-purple">{item.title}</h3>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-candy-pink hover:text-red-500 transition-colors"
              >
                删除
              </button>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{item.content}</p>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <time>记录日期：{new Date(item.date).toLocaleDateString('zh-CN')}</time>
              <time>创建时间：{new Date(item.created_at).toLocaleString('zh-CN')}</time>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 