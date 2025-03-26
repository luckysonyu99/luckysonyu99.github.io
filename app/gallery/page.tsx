'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Gallery() {
  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-qingke text-candy-purple mb-6 animate-float tracking-wider">
          精彩瞬间 
          <span className="inline-block animate-wiggle ml-2">📸</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 tracking-wide">
          记录每一个美好时刻
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 这里可以添加照片网格 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <p className="text-gray-600">相册功能开发中...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 