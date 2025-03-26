'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getSettings, updateSettings, type Settings } from '@/models/settings';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<Partial<Settings>>({
    site_title: '',
    site_description: '',
    baby_name: '',
    baby_birthday: '',
    theme_color: 'pink',
    email_notifications: false,
    browser_notifications: false,
    public_milestones: true,
    public_photos: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchSettings();
    }
  }, [loading, user]);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      setError('获取设置失败');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateSettings(settings);
      setSuccess(true);
    } catch (err) {
      setError('保存设置失败');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">网站设置</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">网站标题</label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">网站描述</label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">宝宝名字</label>
              <input
                type="text"
                value={settings.baby_name || ''}
                onChange={(e) => setSettings({ ...settings, baby_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">宝宝生日</label>
              <input
                type="date"
                value={settings.baby_birthday || ''}
                onChange={(e) => setSettings({ ...settings, baby_birthday: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">主题颜色</label>
              <select
                value={settings.theme_color}
                onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="pink">粉色</option>
                <option value="blue">蓝色</option>
                <option value="purple">紫色</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  启用邮件通知
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.browser_notifications}
                  onChange={(e) => setSettings({ ...settings, browser_notifications: e.target.checked })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  启用浏览器通知
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.public_milestones}
                  onChange={(e) => setSettings({ ...settings, public_milestones: e.target.checked })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  公开显示里程碑
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.public_photos}
                  onChange={(e) => setSettings({ ...settings, public_photos: e.target.checked })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  公开显示相册
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="mt-4 text-green-600 text-sm">设置已保存</div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 