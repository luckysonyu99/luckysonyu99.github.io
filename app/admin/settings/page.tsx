'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/auth';

interface Settings {
  id: string;
  site_name: string;
  site_description: string;
  avatar_url: string;
  github_url: string;
  twitter_url: string;
  email: string;
  about_me: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    avatar_url: '',
    github_url: '',
    twitter_url: '',
    email: '',
    about_me: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
        setFormData({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          avatar_url: data.avatar_url || '',
          github_url: data.github_url || '',
          twitter_url: data.twitter_url || '',
          email: data.email || '',
          about_me: data.about_me || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData({ ...formData, avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      if (settings?.id) {
        const { error } = await supabase
          .from('settings')
          .update(formData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
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
        <h1 className="text-3xl font-qingke text-candy-purple">网站设置</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">网站名称</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">网站描述</label>
              <input
                type="text"
                value={formData.site_description}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">GitHub 链接</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Twitter 链接</label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">邮箱地址</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">头像</label>
              <div className="flex items-center space-x-4">
                {formData.avatar_url && (
                  <img
                    src={formData.avatar_url}
                    alt="头像预览"
                    className="h-20 w-20 object-cover rounded-full"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  disabled={uploading}
                />
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">关于我</label>
            <textarea
              value={formData.about_me}
              onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
              rows={6}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving || uploading}
              className="px-6 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 