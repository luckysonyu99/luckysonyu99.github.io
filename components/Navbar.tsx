'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors btn-animate">
                Luca 🦖
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                }`}
              >
                首页 🏠
              </Link>
              <Link
                href="/milestones"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/milestones')
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                }`}
              >
                成长记录 📝
              </Link>
              <Link
                href="/gallery"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/gallery')
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                }`}
              >
                相册 📸
              </Link>
              {user && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                  }`}
                >
                  管理后台 ⚙️
                  管理后台
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <Link
                href="/auth/signout"
                className="text-sm text-gray-500 hover:text-pink-600 transition-colors btn-animate"
              >
                退出登录
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-gray-500 hover:text-pink-600 transition-colors btn-animate"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 