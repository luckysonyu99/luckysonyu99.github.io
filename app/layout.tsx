import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-primary-100 to-secondary-100`}>
        <div className="container mx-auto px-4">
          <nav className="bg-white shadow-lg">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="text-2xl font-bold text-blue-600">
                🦖 Luca
              </a>
              <div className="flex space-x-4">
                <a href="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </a>
                <a href="#milestones" className="text-gray-600 hover:text-blue-600">
                  Milestones
                </a>
                <a href="#gallery" className="text-gray-600 hover:text-blue-600">
                  Gallery
                </a>
              </div>
            </div>
          </nav>
          
          {children}
          
          <footer className="bg-gray-50 py-8 mt-16">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>© 2024 Luca's Growing Journey. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 