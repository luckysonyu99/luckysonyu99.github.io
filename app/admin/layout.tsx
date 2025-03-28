'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/auth';
import AdminNav from '../components/AdminNav';

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
  }, []);

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
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="p-4 md:p-6">{children}</main>
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