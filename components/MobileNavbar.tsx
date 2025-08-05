'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MobileNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: '/',
      label: '首页',
      emoji: '🏠',
      activeColor: 'text-candy-pink',
      bgColor: 'bg-candy-pink/10'
    },
    {
      href: '/milestones',
      label: '里程碑',
      emoji: '🌟',
      activeColor: 'text-candy-blue',
      bgColor: 'bg-candy-blue/10'
    },
    {
      href: '/gallery',
      label: '相册',
      emoji: '📸',
      activeColor: 'text-candy-yellow',
      bgColor: 'bg-candy-yellow/10'
    },
    {
      href: '/admin/login',
      label: '管理',
      emoji: '⚙️',
      activeColor: 'text-candy-purple',
      bgColor: 'bg-candy-purple/10'
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 sm:hidden">
      <div className="bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-lg">
        {/* 站点标识 */}
        <div className="flex justify-center items-center py-2 border-b border-pink-100">
          <Link href="/" className="text-lg font-bold text-pink-600 hover:text-pink-700 transition-colors font-qingke">
            🦖 Luca
          </Link>
        </div>
        
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map((item, index) => {
            const active = isActive(item.href) || (item.href === '/admin/login' && pathname.startsWith('/admin'));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center min-w-0 flex-1"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: active ? 1.1 : 1,
                    y: active ? -2 : 0
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300
                    ${active 
                      ? `${item.bgColor} ${item.activeColor} shadow-md` 
                      : 'text-gray-400 hover:text-gray-600'
                    }
                  `}
                >
                  {/* 活跃状态的背景光晕 */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`absolute inset-0 ${item.bgColor} rounded-2xl blur-sm`}
                    />
                  )}
                  
                  {/* Emoji 图标 */}
                  <motion.div
                    animate={{ 
                      rotate: active ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{ 
                      duration: 0.6,
                      repeat: active ? Infinity : 0,
                      repeatDelay: 2
                    }}
                    className="text-xl mb-1 relative z-10"
                  >
                    {item.emoji}
                  </motion.div>
                  
                  {/* 文字标签 */}
                  <span className={`
                    text-xs font-medium relative z-10 transition-all duration-300 font-kuaile
                    ${active ? 'font-semibold' : ''}
                  `}>
                    {item.label}
                  </span>
                  
                  {/* 活跃状态的小圆点 */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 w-2 h-2 ${item.activeColor.replace('text-', 'bg-')} rounded-full`}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
        
        {/* 底部安全区域 */}
        <div className="h-safe-area-inset-bottom bg-white/95" />
      </div>
    </nav>
  );
}

