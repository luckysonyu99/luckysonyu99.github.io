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
      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 sticky top-4 h-[calc(100vh-2rem)] m-4 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 mb-8"
          >
            <span className="text-2xl">✨</span>
            <h1 className="text-2xl font-qingke text-candy-purple">后台管理</h1>
          </motion.div>
          <div className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.path)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-candy-pink/10 text-candy-purple'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {getNavIcon(item.path)} <span className="ml-2">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 w-full p-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm"
        >
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>👤</span>
              <span>{email}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <span>🚪</span>
              <span>退出登录</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function getNavIcon(path: string): string {
  const icons: Record<string, string> = {
    '/admin': '🏠',
    '/admin/milestones': '🎯',
    '/admin/gallery': '🖼️',
    '/admin/settings': '⚙️',
    '/admin/users': '👥',
  };
  return icons[path] || '📝';
} 