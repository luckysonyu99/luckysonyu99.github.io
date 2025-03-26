import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const zcoolKuaile = localFont({
  src: '../public/fonts/ZCOOLKuaiLe-Regular.ttf',
  display: 'swap',
  variable: '--font-zcool-kuaile',
}); 