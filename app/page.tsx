'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary-600 mb-6">
          欢迎来到小朋友的成长乐园！
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          在这里记录每一个精彩瞬间 🌟
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🦖</span>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">恐龙探险</h3>
          <p className="text-gray-600 text-center">发现神奇的恐龙世界</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚗</span>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">汽车总动员</h3>
          <p className="text-gray-600 text-center">一起驾驶梦想的车轮</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🐕</span>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">汪汪队出动</h3>
          <p className="text-gray-600 text-center">和狗狗们一起冒险</p>
        </motion.div>
      </div>
    </main>
  );
} 