'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      {/* 移动端悬浮按钮和菜单 */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* 圆形菜单 */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="absolute bottom-16 right-0 w-64 h-64 bg-white rounded-full shadow-xl border border-white/20"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/"
                      className="flex flex-col items-center justify-center p-4 rounded-full hover:bg-candy-pink/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl mb-1">🏠</span>
                      <span className="text-sm font-medium text-gray-700">首页</span>
                    </Link>
                    <Link
                      href="/milestones"
                      className="flex flex-col items-center justify-center p-4 rounded-full hover:bg-candy-pink/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl mb-1">📝</span>
                      <span className="text-sm font-medium text-gray-700">里程碑</span>
                    </Link>
                    <Link
                      href="/gallery"
                      className="flex flex-col items-center justify-center p-4 rounded-full hover:bg-candy-pink/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl mb-1">📸</span>
                      <span className="text-sm font-medium text-gray-700">相册</span>
                    </Link>
                    <Link
                      href="/admin/login"
                      className="flex flex-col items-center justify-center p-4 rounded-full hover:bg-candy-pink/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl mb-1">🔑</span>
                      <span className="text-sm font-medium text-gray-700">管理后台</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 悬浮按钮 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 bg-candy-pink rounded-full shadow-lg flex items-center justify-center text-white hover:bg-candy-purple transition-colors"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.button>
      </div>
    </>
  );
} 