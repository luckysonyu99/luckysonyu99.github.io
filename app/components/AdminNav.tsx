import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose } from 'react-icons/io5';
import { FaHome, FaImages, FaBookmark, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: '管理首页', icon: FaHome },
    { href: '/admin/albums', label: '相册管理', icon: FaImages },
    { href: '/admin/milestones', label: '里程碑管理', icon: FaBookmark },
    { href: '/admin/logout', label: '退出登录', icon: FaSignOutAlt },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 桌面端导航栏 */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-candy-purple transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>返回前台</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive(item.href)
                      ? 'bg-candy-purple text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-candy-purple'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端导航栏 */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-gray-200"
        >
          {isOpen ? (
            <IoClose className="w-6 h-6 text-gray-600" />
          ) : (
            <IoMenu className="w-6 h-6 text-gray-600" />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-0 bg-white/95 backdrop-blur-md z-40"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-6 py-3 rounded-lg text-lg font-medium text-gray-600 hover:text-candy-purple transition-colors"
                >
                  <FaArrowLeft className="w-5 h-5" />
                  <span>返回前台</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-lg font-medium transition-all
                      ${isActive(item.href)
                        ? 'bg-candy-purple text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-candy-purple'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 为固定导航栏添加顶部间距 */}
      <div className="h-16 md:block hidden" />
    </>
  );
};

export default AdminNav; 