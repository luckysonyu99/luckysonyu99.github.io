'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-mochiy text-primary-400 mb-6">
          欢迎来到小朋友的成长乐园！
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          在这里记录每一个精彩瞬间 🌟
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:rotate-2 transition-transform"
        >
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🦖</span>
          </div>
          <h3 className="text-2xl font-mochiy text-primary-400 text-center mb-4">恐龙探险</h3>
          <p className="text-gray-600 text-center">和小恐龙一起探索神奇的世界</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:-rotate-2 transition-transform"
        >
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚗</span>
          </div>
          <h3 className="text-2xl font-mochiy text-primary-400 text-center mb-4">汽车总动员</h3>
          <p className="text-gray-600 text-center">驾驶着梦想的小车车出发啦</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:rotate-2 transition-transform"
        >
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🐕</span>
          </div>
          <h3 className="text-2xl font-mochiy text-primary-400 text-center mb-4">汪汪队出动</h3>
          <p className="text-gray-600 text-center">和可爱的狗狗们一起冒险吧</p>
        </motion.div>
      </div>
    </main>
  );
} 