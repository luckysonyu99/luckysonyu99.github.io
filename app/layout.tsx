import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Luca's Growing Journey",
  description: 'Following the wonderful journey of growing up!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
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
          </div>
        </nav>
        
        {children}
        
        <footer className="bg-gray-50 py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© 2024 Luca's Growing Journey. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 