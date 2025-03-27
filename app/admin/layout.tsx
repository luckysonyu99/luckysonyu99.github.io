'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, signOut } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setEmail(user?.email || null);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/admin/login');
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (pathname === '/admin/login') {
    return children;
  }

  const navItems = [
    { href: '/admin', label: '首页', match: pathname === '/admin' },
    { href: '/admin/milestones', label: '里程碑', match: pathname.startsWith('/admin/milestones') },
    { href: '/admin/gallery', label: '相册', match: pathname.startsWith('/admin/gallery') },
    { href: '/admin/settings', label: '设置', match: pathname.startsWith('/admin/settings') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/20 to-candy-purple/20">
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-qingke text-candy-purple">
                  后台管理
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      item.match
                        ? 'border-candy-pink text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{email}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    退出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 