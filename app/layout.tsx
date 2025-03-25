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
    <html lang="zh" data-theme="cupcake">
      <body className={`${notoSansSC.variable} ${mochiyPopOne.variable} font-sans min-h-screen bg-gradient-to-b from-primary-100 to-secondary-100`}>
        <div className="container mx-auto px-4">
          <nav className="bg-white/80 backdrop-blur-sm shadow-lg rounded-b-xl">
            <div className="flex justify-between items-center h-16 px-6">
              <a href="/" className="text-2xl font-bold text-primary-400 font-mochiy hover:text-primary-500 transition-colors">
                🦖 Luca
              </a>
              <div className="flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-primary-400 transition-colors">
                  首页
                </a>
                <a href="#milestones" className="text-gray-600 hover:text-primary-400 transition-colors">
                  里程碑
                </a>
                <a href="#gallery" className="text-gray-600 hover:text-primary-400 transition-colors">
                  相册
                </a>
              </div>
            </div>
          </nav>
          
          {children}
          
          <footer className="bg-white/80 backdrop-blur-sm shadow-lg rounded-t-xl mt-16 py-8">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p className="font-mochiy">© 2024 Luca's Growing Journey</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 