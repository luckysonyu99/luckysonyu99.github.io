'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface Settings {
  site_title: string;
  site_description: string;
  baby_name: string;
  baby_birthday: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>({
    site_title: '',
    site_description: '',
    baby_name: '',
    baby_birthday: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('settings')
        .upsert(settings);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: '设置已保存',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: '保存设置时出错',
      });
    } finally {
      setSaving(false);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">⚙️</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">设置</h1>

        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {/* 基本设置 */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本设置</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">网站标题</label>
                <input
                  type="text"
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink"
                  placeholder="输入网站标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">网站描述</label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink"
                  rows={3}
                  placeholder="输入网站描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">主题颜色</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-candy-pink focus:ring-candy-pink">
                  <option value="pink">粉色</option>
                  <option value="blue">蓝色</option>
                  <option value="purple">紫色</option>
                </select>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">通知设置</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-candy-pink focus:ring-candy-pink border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  启用邮件通知
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-candy-pink focus:ring-candy-pink border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  启用浏览器通知
                </label>
              </div>
            </div>
          </div>

          {/* 隐私设置 */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">隐私设置</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-candy-pink focus:ring-candy-pink border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  公开显示里程碑
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-candy-pink focus:ring-candy-pink border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  公开显示相册
                </label>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="px-6 py-4 bg-gray-50 text-right rounded-b-lg">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-candy-pink text-white rounded-md hover:bg-candy-pink/90"
            >
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 