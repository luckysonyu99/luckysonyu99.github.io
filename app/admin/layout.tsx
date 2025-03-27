'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/admin', label: '首页' },
    { path: '/admin/milestones', label: '里程碑' },
    { path: '/admin/gallery', label: '相册' },
    { path: '/admin/settings', label: '设置' },
    { path: '/admin/users', label: '用户' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex">
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* 导航栏 */}
      <AnimatePresence>
        {(isMenuOpen || window.innerWidth >= 1024) && (
          <motion.nav
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="fixed lg:sticky top-0 left-0 w-64 h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-lg z-40"
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
                    onClick={() => {
                      router.push(item.path);
                      setIsMenuOpen(false);
                    }}
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
        )}
      </AnimatePresence>

      {/* 遮罩层 */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* 主内容区域 */}
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">{children}</main>
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