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
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navItems.map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(item.path)}
                  className={`inline-flex items-center px-4 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-candy-pink text-candy-purple'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
} 