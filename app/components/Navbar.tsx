import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaHome, FaImages, FaBookmark, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const navItems = [
    { href: '/', label: '首页', icon: FaHome },
    { href: '/albums', label: '相册', icon: FaImages },
    { href: '/milestones', label: '里程碑', icon: FaBookmark },
    { href: '/love', label: '我们的故事', icon: FaHeart },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(item.href)
                    ? 'bg-candy-pink/10 text-candy-purple'
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
  );
};

export default Navbar; 