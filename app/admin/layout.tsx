'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AdminNav from '../components/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 如果当前路径是登录页面，不需要检查认证
    if (pathname === '/admin/login') {
      return;
    }

    // 如果认证检查完成且未认证，重定向到登录页面
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login?unauthorized=true');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

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

