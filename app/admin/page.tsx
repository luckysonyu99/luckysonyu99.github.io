
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '../../lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated } = await checkAuthStatus();
      if (!isAuthenticated) {
        router.push('/admin/login?unauthorized=true');
      } else {
        // 如果已认证，可以重定向到默认的管理页面，例如 /admin/dashboard 或 /admin/settings
        // 这里我们暂时重定向到 /admin/settings，因为这是用户之前访问的页面
        router.push('/admin/settings');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

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

  return null; // 或者显示一个简单的加载指示器
}


