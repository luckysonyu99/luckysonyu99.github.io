'use client';

import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-lg w-full mx-4 text-center"
      >
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-qingke text-candy-purple mb-4">
          您已来到一个不属于你管理的地界
        </h1>
        <p className="text-gray-600 mb-6">
          需要授权请联系粑粑麻麻 👨‍👩‍👧‍👦
        </p>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-3 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
        >
          返回首页
        </motion.a>
      </motion.div>
    </div>
  );
} 