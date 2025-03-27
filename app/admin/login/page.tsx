'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/auth';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // 更新登录尝试次数
        const attempts = parseInt(Cookies.get('login_attempts') || '0') + 1;
        Cookies.set('login_attempts', attempts.toString());
        Cookies.set('last_attempt_time', Date.now().toString());

        if (attempts >= 3) {
          router.push('/admin/unauthorized');
          return;
        }

        throw error;
      }

      // 登录成功，清除登录尝试记录
      Cookies.remove('login_attempts');
      Cookies.remove('last_attempt_time');
      
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || '登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md w-full mx-4"
      >
        <h1 className="text-2xl font-qingke text-candy-purple mb-8 text-center">
          后台管理登录
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
          >
            登录
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 