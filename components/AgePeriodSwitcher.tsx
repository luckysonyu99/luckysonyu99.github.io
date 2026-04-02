'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AgePeriodSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const periods = [
    {
      id: 'preschool',
      name: '学前时期',
      age: '0-3岁',
      icon: '🦖',
      color: 'from-pink-500 to-purple-500',
      path: '/',
    },
    {
      id: 'kindergarten',
      name: '幼儿园时期',
      age: '3-6岁',
      icon: '⚡',
      color: 'from-red-500 to-blue-500',
      path: '/kindergarten',
    },
  ];

  const handleSwitch = (path: string) => {
    setIsOpen(false);

    // 添加页面过渡动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';

    setTimeout(() => {
      router.push(path);
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 100);
    }, 500);
  };

  return (
    <div className="fixed top-24 right-6 z-40">
      {/* 切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-candy-pink to-candy-purple shadow-lg flex items-center justify-center text-2xl"
      >
        🔄
      </motion.button>

      {/* 选择面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-0 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 w-64"
          >
            <h3 className="text-sm font-bold text-gray-800 mb-3 text-center">
              切换年龄段
            </h3>

            <div className="space-y-2">
              {periods.map((period) => (
                <motion.button
                  key={period.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwitch(period.path)}
                  className={`w-full p-3 rounded-xl bg-gradient-to-r ${period.color} text-white flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{period.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{period.name}</div>
                      <div className="text-xs opacity-90">{period.age}</div>
                    </div>
                  </div>
                  <span className="text-xl">→</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-3 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
