'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors btn-animate">
                🦖 Luca
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
                首页
              </Link>
              <Link
                href="/milestones"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/milestones')
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                }`}
              >
                里程碑
              </Link>
              <Link
                href="/gallery"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/gallery')
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                }`}
              >
                相册
              </Link>
              <Link
                href="/admin/login"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/admin/login') || pathname.startsWith('/admin')
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-500 hover:text-pink-600 hover:border-b-2 hover:border-pink-600'
                }`}
              >
                管理后台
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

