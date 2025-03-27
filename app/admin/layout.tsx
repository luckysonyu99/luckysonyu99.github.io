'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUser, signOut } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/admin/login') return;

      try {
        const { user, error } = await getUser();
        if (error || !user) {
          throw new Error('未登录');
        }
        setEmail(user.email || null);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { path: '/admin', label: '首页' },
    { path: '/admin/milestones', label: '里程碑' },
    { path: '/admin/gallery', label: '相册' },
    { path: '/admin/settings', label: '设置' },
    { path: '/admin/users', label: '用户' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex">
      <nav className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-qingke text-candy-purple mb-8">后台管理</h1>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.path)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-candy-pink/10 text-candy-purple'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-500">{email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </nav>
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
} 