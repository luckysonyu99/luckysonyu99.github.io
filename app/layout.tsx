import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_SC, Mochiy_Pop_One } from 'next/font/google';

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
});

const mochiyPopOne = Mochiy_Pop_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mochiy',
});

export const metadata: Metadata = {
  title: "小朋友的成长记录",
  description: "记录成长的每一个精彩瞬间",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" data-theme="mytheme">
      <body className={`${notoSansSC.variable} ${mochiyPopOne.variable} font-sans min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5`}>
        <div className="container mx-auto px-4">
          <nav className="bg-white/70 backdrop-blur-sm shadow-lg rounded-b-2xl border border-white/20">
            <div className="flex justify-between items-center h-16 px-6">
              <a href="/" className="text-2xl font-bold text-candy-pink font-mochiy hover:text-candy-purple transition-colors group">
                <span className="inline-block group-hover:animate-wiggle">🦖</span> Luca
              </a>
              <div className="flex space-x-8">
                <a href="/" className="text-gray-600 hover:text-candy-blue transition-colors">
                  首页
                </a>
                <a href="#milestones" className="text-gray-600 hover:text-candy-yellow transition-colors">
                  里程碑
                </a>
                <a href="#gallery" className="text-gray-600 hover:text-candy-green transition-colors">
                  相册
                </a>
              </div>
            </div>
          </nav>
          
          {children}
          
          <footer className="bg-white/70 backdrop-blur-sm shadow-lg rounded-t-2xl border border-white/20 mt-16 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="font-mochiy text-candy-purple">© 2024 Luca's Growing Journey</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 