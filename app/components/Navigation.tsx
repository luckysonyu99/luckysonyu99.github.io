'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-white/70 backdrop-blur-sm shadow-lg rounded-b-2xl border border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-qingke text-candy-pink hover:text-candy-purple transition-colors">
                  🦖 Luca
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-pink transition-colors"
                >
                  首页
                </Link>
                <Link
                  href="/milestones"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-pink transition-colors"
                >
                  里程碑
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-pink transition-colors"
                >
                  相册
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/login"
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-candy-pink hover:bg-candy-purple transition-colors"
              >
                管理后台
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端顶部导航栏 */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-lg">
          <div className="flex justify-between items-center py-3 px-4 min-h-[60px]">
            {/* 站点标识 */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-lg font-bold text-candy-pink hover:text-candy-purple transition-colors font-qingke">
                🦖 Luca
              </Link>
            </div>
            
            {/* 导航按钮 */}
            <div className="flex space-x-1">
              {[
                { href: '/', label: '首页', emoji: '🏠', activeColor: 'text-candy-pink', bgColor: 'bg-candy-pink/10' },
                { href: '/milestones', label: '里程碑', emoji: '🌟', activeColor: 'text-candy-blue', bgColor: 'bg-candy-blue/10' },
                { href: '/gallery', label: '相册', emoji: '📸', activeColor: 'text-candy-yellow', bgColor: 'bg-candy-yellow/10' },
                { href: '/admin/login', label: '管理', emoji: '⚙️', activeColor: 'text-candy-purple', bgColor: 'bg-candy-purple/10' }
              ].map((item) => {
                const active = pathname === item.href || (item.href === '/admin/login' && pathname.startsWith('/admin'));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block"
                  >
                    <div
                      className={`
                        relative flex flex-col items-center justify-center p-2 rounded-xl min-w-[50px] min-h-[50px]
                        transform transition-transform duration-200 active:scale-95 hover:scale-105
                        ${active 
                          ? `${item.bgColor} ${item.activeColor} shadow-md` 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {/* Emoji 图标 */}
                      <div className="text-lg mb-1">
                        {item.emoji}
                      </div>
                      
                      {/* 文字标签 */}
                      <span className={`
                        text-xs font-medium transition-all duration-200 font-kuaile
                        ${active ? 'font-semibold' : ''}
                      `}>
                        {item.label}
                      </span>
                      
                      {/* 活跃状态指示器 */}
                      {active && (
                        <div className={`absolute -top-1 w-2 h-2 ${item.activeColor.replace('text-', 'bg-')} rounded-full`} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 