'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5">
      <nav className="bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center">
                <span className="text-2xl font-kuaile text-candy-purple">🦖 Luca</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-purple">
                  后台首页
                </Link>
                <Link href="/admin/milestones" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-purple">
                  里程碑管理
                </Link>
                <Link href="/admin/gallery" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-purple">
                  相册管理
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-candy-purple text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">
        {children}
      </main>
    </div>
  );
} 