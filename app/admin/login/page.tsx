
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { createDefaultAdmin, checkAdminExists } from '../../../lib/auth';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();

  // 如果已认证，重定向到管理后台
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/admin");
    }
  }, [isAuthenticated, authLoading, router]);

  // 处理未授权访问和检查管理员是否存在
  useEffect(() => {
    if (!authLoading) {
      const unauthorized = searchParams.get("unauthorized");
      if (unauthorized === "true" && !error) {
        setShowUnauthorized(true);
      }
      checkAdminExists().then(setAdminExists).catch(() => setAdminExists(false));
    }
  }, [authLoading, searchParams, error]);

  const handleCreateDefaultAdmin = async () => {
    setIsLoading(true);
    setError("");

    const result = await createDefaultAdmin();

    if (result.success) {
      setEmail("admin@moreyu.me");
      setPassword("luca@2026");
      setShowDefaultCredentials(true);
      setAdminExists(true);
      setError("默认管理员账号已创建，请使用以下凭据登录");
    } else {
      if (result.error?.includes("已存在")) {
        setError("管理员账号已存在，请直接登录");
        setAdminExists(true);
      } else {
        setError(result.error || "创建管理员失败");
      }
    }
    
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    setShowUnauthorized(false);

    const result = await login(email, password);

    if (result.success) {
      // 获取用户信息以显示个性化欢迎语
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('role, relationship, full_name')
          .eq('id', user.id)
          .single();

        let welcomeMessage = "欢迎回来！🎉";

        if (profile) {
          switch (profile.role) {
            case 'admin':
              welcomeMessage = "欢迎爸爸妈妈！👨‍👩‍👧‍👦 正在跳转...";
              break;
            case 'family':
              const name = profile.relationship || profile.full_name || '家人';
              welcomeMessage = `欢迎${name}！👴👵 正在跳转...`;
              break;
            case 'friend':
              welcomeMessage = "欢迎朋友！👋 正在跳转...";
              break;
            case 'visitor':
              welcomeMessage = "欢迎访客！🙋 正在跳转...";
              break;
          }
        }

        setSuccessMessage(welcomeMessage);
      }
      // 保持 loading 状态直到重定向完成
    } else {
      setError("您已来到一个不属于你管理的地界！🚫 需要授权请联系粑粑麻麻 👨‍👩‍👧‍👦 或者去找小恐龙 🦖 帮忙哦！");
      setIsLoading(false);
    }
  };

  // 如果正在检查认证状态，显示加载
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 font-kuaile">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-candy-pink mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">检查登录状态中...</p>
          <p className="text-xs text-gray-400">如果长时间无响应，请刷新页面</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 py-12 px-4 font-kuaile">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-qingke text-candy-purple">
            🦖 管理后台登录
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请输入管理员账号和密码
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
          {/* 只在未授权访问时显示警告 */}
          {showUnauthorized && (
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
          )}

          {/* 只在管理员不存在时显示创建按钮 */}
          {adminExists === false && !showDefaultCredentials && (
            <div className="text-center mb-6">
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
          )}

          {/* 显示默认凭据 */}
          {showDefaultCredentials && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-candy-pink focus:border-candy-pink focus:z-10 sm:text-sm font-kuaile"
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-candy-pink focus:border-candy-pink focus:z-10 sm:text-sm font-kuaile"
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

            {successMessage && (
              <div className="text-sm text-center text-green-600">
                {successMessage}
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
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}




