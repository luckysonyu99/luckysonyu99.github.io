'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export default function AgePeriodSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const isKindergarten = pathname?.startsWith('/kindergarten');

  const handleSwitch = () => {
    const targetPath = isKindergarten ? '/' : '/kindergarten';

    // 页面过渡动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';

    setTimeout(() => {
      router.push(targetPath);
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 100);
    }, 500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={handleSwitch}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* 主按钮 */}
        <div className={`relative w-24 h-24 rounded-full shadow-2xl flex items-center justify-center text-5xl transition-all duration-300 ${
          isKindergarten
            ? 'bg-gradient-to-br from-red-500 via-blue-500 to-yellow-500'
            : 'bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400'
        }`}>
          {isKindergarten ? (
            // 奥特曼形象
            <motion.div
              animate={{
                rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              ⚡
            </motion.div>
          ) : (
            // 汪汪队/小恐龙形象
            <motion.div
              animate={{
                y: isHovered ? [-2, 2, -2] : 0,
              }}
              transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
            >
              🦖
            </motion.div>
          )}
        </div>

        {/* 能量光环效果 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className={`absolute inset-0 rounded-full ${
                isKindergarten
                  ? 'border-4 border-red-400'
                  : 'border-4 border-pink-400'
              }`}
            />
          )}
        </AnimatePresence>

        {/* 提示文字 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-28 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className={`px-6 py-3 rounded-2xl shadow-xl font-bold text-white ${
                isKindergarten
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                  : 'bg-gradient-to-r from-red-500 to-blue-500'
              }`}>
                {isKindergarten ? (
                  <span>回到学前时期 🦖</span>
                ) : (
                  <span>进入幼儿园时期 ⚡</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 装饰粒子 */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 40,
                  y: Math.sin((i * Math.PI * 2) / 6) * 40,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
                  isKindergarten ? 'bg-yellow-400' : 'bg-pink-400'
                }`}
              />
            ))}
          </>
        )}
      </motion.button>
    </div>
  );
}
