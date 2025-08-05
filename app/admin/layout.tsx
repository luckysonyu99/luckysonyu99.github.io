'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import userbase from 'userbase-js';
import AdminNav from '../components/AdminNav';
import Navbar from '../components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    userbase.init({ appId: '0b2844f0-e722-4251-a270-35200be9756a' })
      .then(() => {
        // Userbase 初始化成功，假设用户已登录
        // 在实际应用中，可以通过尝试打开数据库来验证登录状态
        setEmail('admin@luca.com');
      })
      .catch((e) => {
        console.error('Userbase 初始化失败:', e);
        router.push('/admin/login');
      });
  }, [router]);

  const handleSignOut = async () => {
    try {
      await userbase.signOut();
      router.push('/admin/login');
    } catch (e) {
      console.error('Error signing out:', e);
      alert(`登出失败: ${(e as Error).message}`);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminNav />
      <main className="p-4 md:p-6 pt-24 md:pt-28">{children}</main>
    </div>
  );
}

function getNavIcon(path: string): string {
  const icons: Record<string, string> = {
    '/admin': '🏠',
    '/admin/milestones': '🎯',
    '/admin/gallery': '🖼️',
    '/admin/settings': '⚙️',
  };
  return icons[path] || '📝';
} 