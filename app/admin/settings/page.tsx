'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
                  defaultValue="Luca's Growing Journey"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
                <input
                  type="text"
                  defaultValue="记录宝宝成长的点点滴滴"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                />
              </div>
            </div>
          </div>

          {/* 主题设置 */}
          <div className="border-b border-pink-100 pb-6">
            <h2 className="text-xl font-qingke text-candy-blue mb-4">主题设置</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-candy-pink to-candy-purple rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">粉紫渐变</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-candy-blue to-candy-yellow rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">蓝黄渐变</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">绿蓝渐变</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">紫粉渐变</span>
              </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  />
                  <input
                    type="password"
                    placeholder="新密码"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-pink/80 transition-colors">
                  保存设置
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

