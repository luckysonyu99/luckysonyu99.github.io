import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { ZCOOL_KuaiLe, ZCOOL_QingKe_HuangYou } from 'next/font/google';

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
  title: "宥宥小朋友的成长记录",
  description: "记录成长的每一个精彩瞬间",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" data-theme="mytheme" className={`${zcoolKuaiLe.variable} ${zcoolQingKe.variable}`}>
      <body className="font-kuaile min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5">
        <div className="container mx-auto px-4">
          <nav className="bg-white/70 backdrop-blur-sm shadow-lg rounded-b-2xl border border-white/20">
            <div className="flex justify-between items-center h-16 px-6">
              <a href="/" className="text-2xl font-bold text-candy-pink font-qingke hover:text-candy-purple transition-colors group">
                <span className="inline-block group-hover:animate-wiggle">🦖</span> Luca
              </a>
              <div className="flex space-x-8">
                <a href="/" className="text-gray-600 hover:text-candy-blue transition-colors text-lg">
                  首页
                </a>
                <a href="/milestones" className="text-gray-600 hover:text-candy-yellow transition-colors text-lg">
                  里程碑
                </a>
                <a href="/admin/milestones" className="text-gray-600 hover:text-candy-green transition-colors text-lg">
                  管理
                </a>
              </div>
            </div>
          </nav>
          
          {children}
          
          <footer className="bg-white/70 backdrop-blur-sm shadow-lg rounded-t-2xl border border-white/20 mt-16 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="font-qingke text-candy-purple">©2022-2025 Luca's Growing Journey</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 