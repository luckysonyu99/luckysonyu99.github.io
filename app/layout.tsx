import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { ZCOOL_KuaiLe, ZCOOL_QingKe_HuangYou } from 'next/font/google';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const zcoolKuaiLe = ZCOOL_KuaiLe({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kuaile',
  display: 'swap',
  fallback: ['cursive', 'sans-serif'],
});

const zcoolQingKe = ZCOOL_QingKe_HuangYou({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-qingke',
  display: 'swap',
  fallback: ['cursive', 'sans-serif'],
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
      <body className="font-kuaile min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24 sm:pt-8 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
} 