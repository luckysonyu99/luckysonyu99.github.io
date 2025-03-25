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
        <h1 className="text-4xl md:text-5xl font-mochiy text-candy-pink mb-6 animate-float">
          欢迎来到小朋友的成长乐园！
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          在这里记录每一个精彩瞬间 
          <span className="inline-block animate-wiggle">🌟</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-candy-blue/30 to-white backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:rotate-2 transition-all duration-300"
        >
          <div className="bg-candy-blue/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="text-5xl">🦖</span>
          </div>
          <h3 className="text-2xl font-mochiy text-candy-blue text-center mb-4">恐龙探险</h3>
          <p className="text-gray-600 text-center">和小恐龙一起探索神奇的世界</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-candy-yellow/30 to-white backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:-rotate-2 transition-all duration-300"
        >
          <div className="bg-candy-yellow/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="text-5xl">🚗</span>
          </div>
          <h3 className="text-2xl font-mochiy text-candy-orange text-center mb-4">汽车总动员</h3>
          <p className="text-gray-600 text-center">驾驶着梦想的小车车出发啦</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-candy-purple/30 to-white backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:rotate-2 transition-all duration-300"
        >
          <div className="bg-candy-purple/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="text-5xl">🐕</span>
          </div>
          <h3 className="text-2xl font-mochiy text-candy-purple text-center mb-4">汪汪队出动</h3>
          <p className="text-gray-600 text-center">和可爱的狗狗们一起冒险吧</p>
        </motion.div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute w-64 h-64 bg-candy-pink/10 rounded-full blur-3xl -top-32 -left-32 animate-float"></div>
        <div className="absolute w-64 h-64 bg-candy-blue/10 rounded-full blur-3xl top-1/4 -right-32 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 bg-candy-yellow/10 rounded-full blur-3xl bottom-1/4 -left-32 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </main>
  );
} 