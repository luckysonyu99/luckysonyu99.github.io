import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-boy-blue text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-comic">
          Luca's World
        </Link>
        <div className="space-x-4">
          <Link href="/timeline" className="hover:text-truck-yellow transition-colors">
            成长记录
          </Link>
          <Link href="/gallery" className="hover:text-truck-yellow transition-colors">
            照片墙
          </Link>
          <Link href="/admin" className="hover:text-truck-yellow transition-colors">
            管理后台
          </Link>
        </div>
      </div>
    </nav>
  )
} 