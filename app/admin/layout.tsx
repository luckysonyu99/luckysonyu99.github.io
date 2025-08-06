'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '../../lib/auth';
import AdminNav from '../components/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 如果当前路径是登录页面，不需要检查认证
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      try {
        const { isAuthenticated } = await checkAuthStatus();
        
        if (!isAuthenticated) {
          // 未认证，重定向到登录页面并标记为未授权访问
          router.push('/admin/login?unauthorized=true');
          return;
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('认证检查失败:', error);
        router.push('/admin/login?unauthorized=true');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]); // 移除 router 依赖，避免无限循环

  // 如果是登录页面，直接渲染子组件
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 font-kuaile">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-candy-pink mx-auto mb-4"></div>
          <p className="text-gray-600">检查登录状态中...</p>
        </div>
      </div>
    );
  }

  // 如果未认证，不渲染任何内容（因为会重定向）
  if (!isAuthenticated) {
    return null;
  }

  // 如果已认证，渲染管理后台布局
  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 font-kuaile">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 pt-20">
        {children}
      </div>
    </div>
  );
}

