'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-candy-pink hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-candy-pink"
              >
                <span className="sr-only">打开菜单</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-candy-pink hover:bg-candy-purple transition-colors"
            >
              管理后台
            </Link>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-candy-pink hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/milestones"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-candy-pink hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                里程碑
              </Link>
              <Link
                href="/gallery"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-candy-pink hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                相册
              </Link>
              <Link
                href="/admin/login"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-candy-pink hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                管理后台
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 