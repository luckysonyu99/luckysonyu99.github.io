import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { ZCOOL_KuaiLe, ZCOOL_QingKe_HuangYou } from 'next/font/google';
import Navigation from '@/components/Navigation';

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
  title: 'Luca\'s Growing Journey',
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
        <Navigation />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-white/70 backdrop-blur-sm shadow-lg rounded-t-2xl border border-white/20 mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-qingke text-candy-purple">© 2022-2025 Luca's Growing Journey. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 