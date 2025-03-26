'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from '@/models/auth';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors">
                Luca 🦖
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-pink-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                首页 🏠
              </Link>
              <Link
                href="/milestones"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/milestones'
                    ? 'border-pink-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                里程碑 🎯
              </Link>
              <Link
                href="/gallery"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/gallery'
                    ? 'border-pink-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                相册 📸
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {!loading && (
              user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname.startsWith('/admin')
                        ? 'border-pink-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    管理面板 ⚙️
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                  >
                    退出登录 👋
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors ${
                    pathname === '/login' ? 'bg-pink-700' : ''
                  }`}
                >
                  管理员登录 🔑
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 