import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, ZCOOL_KuaiLe, ZCOOL_QingKe_HuangYou } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
const kuaile = ZCOOL_KuaiLe({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kuaile',
});
const qingke = ZCOOL_QingKe_HuangYou({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-qingke',
});

export const metadata: Metadata = {
  title: "Luca's Growing Journey",
  description: '记录喻言小朋友的成长点滴',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} ${kuaile.variable} ${qingke.variable} bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 min-h-screen`}>
        <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-sm shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-kuaile text-candy-purple">🦖 Luca</span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-purple">
                    首页
                  </Link>
                  <Link href="/milestones" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-purple">
                    里程碑
                  </Link>
                  <Link href="/gallery" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-candy-purple">
                    相册
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
        <footer className="bg-white/70 backdrop-blur-sm mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            ©2022-2025 Luca's Growing Journey
          </div>
        </footer>
      </body>
    </html>
  );
} 