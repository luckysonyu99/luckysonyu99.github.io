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
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image_url: '',
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('milestones')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('milestones')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('milestones')
          .update(formData)
          .eq('id', isEditing);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('milestones')
          .insert([formData]);

        if (error) throw error;
      }

      setIsAdding(false);
      setIsEditing(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        image_url: '',
      });
      fetchMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setIsEditing(milestone.id);
    setFormData({
      title: milestone.title,
      description: milestone.description,
      date: milestone.date,
      image_url: milestone.image_url,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个里程碑吗？')) return;

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
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
        <h1 className="text-3xl font-qingke text-candy-purple">里程碑管理</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
        >
          添加里程碑
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">日期</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">图片</label>
              <div className="flex items-center space-x-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="预览"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required={!isEditing}
                  disabled={uploading}
                />
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    image_url: '',
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors disabled:opacity-50"
              >
                {isEditing ? '保存修改' : '添加里程碑'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <img
                src={milestone.image_url}
                alt={milestone.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-qingke text-candy-purple mb-2">{milestone.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span>{new Date(milestone.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 mb-4">{milestone.description}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleEdit(milestone)}
                className="text-candy-blue hover:text-candy-purple transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(milestone.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
