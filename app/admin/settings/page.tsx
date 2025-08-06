'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signOut } from '../../../lib/auth';
import { 
  SiteSettings, 
  loadSettingsFromStorage, 
  saveSettingsToDatabase, 
  applyTheme,
  updateSiteMetadata 
} from '../../../lib/settings';

export default function SettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "Luca's Growing Journey",
    siteDescription: "记录宝宝成长的点点滴滴",
    theme: 'pink-purple',
    currentPassword: '',
    newPassword: '',
  });

  // 加载设置
  useEffect(() => {
    const loadSettings = () => {
      const storedSettings = loadSettingsFromStorage();
      setSettings(prev => ({ ...prev, ...storedSettings }));
    };
    loadSettings();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // 保存设置到数据库
      const success = await saveSettingsToDatabase({
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        theme: settings.theme,
      });
      
      if (success) {
        // 应用设置
        updateSiteMetadata(settings.siteTitle, settings.siteDescription);
        applyTheme(settings.theme);
        
        setSaveMessage('设置保存成功！');
        
        // 清除密码字段
        setSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
        }));
      } else {
        setSaveMessage('保存失败，请重试');
      }
      
      // 3秒后清除消息
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      
    } catch (error) {
      setSaveMessage('保存失败，请重试');
      
      // 3秒后清除错误消息
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (theme: SiteSettings['theme']) => {
    setSettings(prev => ({ ...prev, theme }));
    applyTheme(theme);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-qingke text-candy-purple mb-6">系统设置</h1>
        
        <div className="space-y-6">
          {/* 基本设置 */}
          <div className="border-b border-pink-100 pb-6">
            <h2 className="text-xl font-qingke text-candy-blue mb-4">基本设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站标题</label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                />
              </div>
            </div>
          </div>

          {/* 主题设置 */}
          <div className="border-b border-pink-100 pb-6">
            <h2 className="text-xl font-qingke text-candy-blue mb-4">主题设置</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { theme: 'pink-purple' as const, name: '粉紫渐变', gradient: 'from-candy-pink to-candy-purple' },
                { theme: 'blue-yellow' as const, name: '蓝黄渐变', gradient: 'from-candy-blue to-candy-yellow' },
                { theme: 'green-blue' as const, name: '绿蓝渐变', gradient: 'from-green-400 to-blue-500' },
                { theme: 'purple-pink' as const, name: '紫粉渐变', gradient: 'from-purple-400 to-pink-400' }
              ].map((themeOption) => (
                <button
                  key={themeOption.theme}
                  onClick={() => handleThemeChange(themeOption.theme)}
                  className={`text-center p-2 rounded-lg transition-all ${
                    settings.theme === themeOption.theme 
                      ? 'ring-2 ring-candy-pink bg-candy-pink/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${themeOption.gradient} rounded-lg mx-auto mb-2`}></div>
                  <span className="text-sm text-gray-600">{themeOption.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 数据管理 */}
          <div className="border-b border-pink-100 pb-6">
            <h2 className="text-xl font-qingke text-candy-blue mb-4">数据管理</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-4 py-2 bg-candy-blue text-white rounded-lg hover:bg-candy-blue/80 transition-colors">
                导出数据
              </button>
              <button className="px-4 py-2 bg-candy-yellow text-white rounded-lg hover:bg-candy-yellow/80 transition-colors">
                导入数据
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                清空数据
              </button>
            </div>
          </div>

          {/* 账户设置 */}
          <div>
            <h2 className="text-xl font-qingke text-candy-blue mb-4">账户设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">修改密码</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="当前密码"
                    value={settings.currentPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  />
                  <input
                    type="password"
                    placeholder="新密码"
                    value={settings.newPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  />
                </div>
              </div>
              
              {/* 保存消息提示 */}
              {saveMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  saveMessage.includes('成功') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveMessage}
                </div>
              )}
              
              <div className="flex space-x-4">
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-6 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-pink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>保存中...</span>
                    </>
                  ) : (
                    '保存设置'
                  )}
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

