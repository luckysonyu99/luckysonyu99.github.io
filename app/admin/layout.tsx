'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: '后台首页',
    href: '/admin',
    icon: '📊',
  },
  {
    title: '里程碑管理',
    href: '/admin/milestones',
    icon: '🎯',
  },
  {
    title: '相册管理',
    href: '/admin/gallery',
    icon: '📸',
  },
  {
    title: '日常记录',
    href: '/admin/records',
    icon: '📝',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <div className="w-64 bg-white/70 backdrop-blur-sm shadow-lg border-r border-white/20">
        <div className="p-6">
          <h2 className="text-2xl font-qingke text-candy-purple mb-6">
            管理后台
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-candy-pink/10 text-candy-pink'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 