import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { ZCOOL_KuaiLe, ZCOOL_QingKe_HuangYou } from 'next/font/google';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const zcoolKuaiLe = ZCOOL_KuaiLe({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kuaile',
  display: 'swap',
});

const zcoolQingKe = ZCOOL_QingKe_HuangYou({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-qingke',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '宥宥小朋友的成长记录',
  description: '记录宝宝成长的点点滴滴',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`${zcoolKuaiLe.variable} ${zcoolQingKe.variable}`}>
      <body className="font-kuaile min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5">
        <nav className="bg-white/70 backdrop-blur-sm shadow-lg rounded-b-2xl border border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-2xl font-qingke text-candy-pink hover:text-candy-purple transition-colors">
                    🌟 宥宥的成长乐园
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
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-candy-pink hover:bg-candy-purple transition-colors"
                >
                  管理后台
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-white/70 backdrop-blur-sm shadow-lg rounded-t-2xl border border-white/20 mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-qingke text-candy-purple">© {new Date().getFullYear()} 宥宥的成长乐园. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 