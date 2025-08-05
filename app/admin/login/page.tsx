'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/auth';
import { createDefaultAdmin } from '@/lib/admin-setup';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 检查是否已经登录
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // 验证用户是否是管理员
          const { data: userData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (userData) {
            router.push('/admin');
          }
        }
      } catch (error) {
        console.error('检查会话失败:', error);
      }
    };
    checkSession();
  }, [router]);

  const handleCreateDefaultAdmin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await createDefaultAdmin();
      if (result.success) {
        if (result.credentials) {
          setEmail(result.credentials.email);
          setPassword(result.credentials.password);
          setShowDefaultCredentials(true);
          setError('默认管理员账号已创建，请使用以下凭据登录');
        } else {
          setError(result.message || '管理员已存在');
        }
      } else {
        setError(result.error || '创建管理员失败');
      }
    } catch (error: any) {
      setError(error.message || '创建管理员失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // 验证用户是否是管理员
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (userError || !userData) {
          await supabase.auth.signOut();
          throw new Error('您没有管理员权限');
        }

        // 获取重定向地址
        const redirectTo = searchParams.get('redirectedFrom') || '/admin';
        router.push(redirectTo);
      }
    } catch (error: any) {
      setError(error.message || '邮箱或密码错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 创建默认管理员按钮 */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleCreateDefaultAdmin}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-candy-purple bg-candy-yellow/20 hover:bg-candy-yellow/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-candy-yellow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '创建中...' : '创建默认管理员'}
        </button>
        <p className="mt-2 text-xs text-gray-500">
          如果这是首次使用，请先创建默认管理员账号
        </p>
      </div>

      {/* 显示默认凭据 */}
      {showDefaultCredentials && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">默认管理员账号已创建</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>邮箱: {email}</p>
                <p>密码: {password}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">
              邮箱地址
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-candy-pink focus:border-candy-pink focus:z-10 sm:text-sm"
              placeholder="邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-candy-pink focus:border-candy-pink focus:z-10 sm:text-sm"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className={`text-sm text-center ${showDefaultCredentials ? 'text-green-600' : 'text-red-500'}`}>
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-candy-pink hover:bg-candy-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-candy-pink disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              '登录'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="mt-6 text-3xl font-qingke text-candy-purple">
            管理后台登录
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请输入管理员账号和密码
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20"
        >
          <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">未授权访问 ⚠️</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>您已来到一个不属于你管理的地界！🚫</p>
                  <p>需要授权请联系粑粑麻麻 👨‍👩‍👧‍👦</p>
                  <p>或者去找小恐龙 🦖 帮忙哦！</p>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="text-center">加载中...</div>}>
            <LoginForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
} 