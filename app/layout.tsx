import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Luca 的成长记录 🌱',
  description: '记录 Luca 的每一个精彩瞬间 ✨',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={quicksand.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-white shadow-inner py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Made with 💖 for Luca
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    © {new Date().getFullYear()} All rights reserved 🌟
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 