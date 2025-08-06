
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        {/* 站点标识和导航栏在同一行 - 固定布局 */}
        <div className="flex justify-between items-center py-3 px-4 min-h-[60px]">
          {/* 站点标识 - 固定位置 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-bold text-pink-600 hover:text-pink-700 transition-colors font-qingke">
              🦖 Luca
            </Link>
          </div>
          
          {/* 导航按钮 - 固定布局 */}
          <div className="flex space-x-1 flex-shrink-0">
            {navItems.map((item) => {
              const active = isActive(item.href) || (item.href === '/admin/login' && pathname.startsWith('/admin'));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block transform transition-transform duration-200 active:scale-95 hover:scale-105"
                >
                  <div
                    className={`
                      relative flex flex-col items-center justify-center p-2 rounded-xl min-w-[50px] min-h-[50px]
                      ${active 
                        ? `${item.bgColor} ${item.activeColor} shadow-md` 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    {/* Emoji 图标 */}
                    <div className="text-lg mb-1">
                      {item.emoji}
                    </div>
                    
                    {/* 文字标签 */}
                    <span className={`
                      text-xs font-medium transition-all duration-200 font-kuaile
                      ${active ? 'font-semibold' : ''}
                    `}>
                      {item.label}
                    </span>
                    
                    {/* 活跃状态指示器 */}
                    {active && (
                      <div className={`absolute -top-1 w-2 h-2 ${item.activeColor.replace('text-', 'bg-')} rounded-full`} />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}



