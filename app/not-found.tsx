'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center p-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          哎呀！这个页面好像不见了 🦖
        </p>
        <a 
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          返回首页
        </a>
      </motion.div>
    </div>
  );
} 