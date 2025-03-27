'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Settings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url: string;
  social_links: {
    github?: string;
    twitter?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
    [key: string]: string | undefined;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Settings>({
    id: '',
    site_name: '',
    site_description: '',
    logo_url: '',
    social_links: {},
    contact_info: {},
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
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('settings')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('settings')
        .getPublicUrl(fileName);

      setFormData({ ...formData, logo_url: publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSocialLinksChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      social_links: {
        ...formData.social_links,
        [key]: value,
      },
    });
  };

  const handleContactInfoChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      contact_info: {
        ...formData.contact_info,
        [key]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settings) {
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-qingke text-candy-purple">基本信息</h2>
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
              <textarea
                value={formData.site_description}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Logo</label>
              <div className="flex items-center space-x-4">
                {formData.logo_url && (
                  <img
                    src={formData.logo_url}
                    alt="Logo预览"
                    className="h-20 w-20 object-contain rounded-lg"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  disabled={uploading}
                />
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-qingke text-candy-purple">社交链接</h2>
            <div>
              <label className="block text-gray-700 mb-2">GitHub</label>
              <input
                type="url"
                value={formData.social_links.github || ''}
                onChange={(e) => handleSocialLinksChange('github', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                value={formData.social_links.twitter || ''}
                onChange={(e) => handleSocialLinksChange('twitter', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={formData.social_links.instagram || ''}
                onChange={(e) => handleSocialLinksChange('instagram', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-qingke text-candy-purple">联系方式</h2>
            <div>
              <label className="block text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                value={formData.contact_info.email || ''}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">电话</label>
              <input
                type="tel"
                value={formData.contact_info.phone || ''}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                placeholder="+86 123 4567 8900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">地址</label>
              <textarea
                value={formData.contact_info.address || ''}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                rows={2}
                placeholder="你的地址"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors disabled:opacity-50"
            >
              保存设置
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 