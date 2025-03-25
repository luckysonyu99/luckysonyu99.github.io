import Image from 'next/image'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-boy-blue font-comic">
          Welcome to Luca's World
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          记录每一个精彩瞬间
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🦖</div>
          <h2 className="text-xl font-bold text-dino-green mb-2">恐龙世界</h2>
          <p className="text-gray-600">探索史前世界，认识各种恐龙</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🚛</div>
          <h2 className="text-xl font-bold text-truck-yellow mb-2">工程车</h2>
          <p className="text-gray-600">认识各种工程车，了解它们的工作</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🐕</div>
          <h2 className="text-xl font-bold text-paw-patrol-red mb-2">汪汪队</h2>
          <p className="text-gray-600">和汪汪队一起冒险，帮助他人</p>
        </div>
      </div>
    </div>
  )
} 