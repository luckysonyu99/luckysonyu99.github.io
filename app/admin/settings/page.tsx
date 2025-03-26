'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Settings {
  site_title: string;
  site_description: string;
  baby_name: string;
  baby_birthday: string;
}

export default function SettingsAdmin() {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-bounce text-4xl">⚙️</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-6 animate-float tracking-wider">
          网站设置 
          <span className="inline-block animate-wiggle ml-2">⚙️</span>
        </h1>
      </motion.div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">网站标题</label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              placeholder="输入网站标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
            <textarea
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              rows={3}
              placeholder="输入网站描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">宝宝名字</label>
            <input
              type="text"
              value={settings.baby_name}
              onChange={(e) => setSettings({ ...settings, baby_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
              placeholder="输入宝宝名字"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">宝宝生日</label>
            <input
              type="date"
              value={settings.baby_birthday}
              onChange={(e) => setSettings({ ...settings, baby_birthday: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-candy-pink focus:border-candy-pink"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full bg-gradient-to-r from-candy-pink to-candy-purple text-white font-medium py-2 px-4 rounded-lg transition-opacity ${
              saving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
} 