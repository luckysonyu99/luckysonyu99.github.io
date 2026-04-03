'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
}

interface Photo {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export default function KindergartenPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .order('date', { ascending: false })
        .limit(6);

      const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('age_period', 'kindergarten')
        .order('created_at', { ascending: false })
        .limit(8);

      setMilestones(milestonesData || []);
      setPhotos(photosData || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-600 via-blue-600 to-yellow-500">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="text-8xl"
        >
          ⚡
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* 动态背景 - 漫画风格 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-blue-900 to-yellow-900 opacity-80"></div>
        {/* 漫画爆炸效果 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['💥', '⚡', '💫', '✨', '🔥'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* 英雄区 - 奥特曼变身效果 */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* 能量光束 */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(0,100,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(255,200,0,0.3) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="text-center relative z-10 px-4">
            {/* 主标题 - 漫画爆炸框 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              className="relative inline-block mb-12"
            >
              {/* 爆炸边框 */}
              <div className="absolute -inset-8 bg-yellow-400 transform rotate-3"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                }}
              ></div>
              <div className="absolute -inset-6 bg-red-500 transform -rotate-2"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                }}
              ></div>
              <div className="relative bg-white px-16 py-8 transform rotate-1"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                }}
              >
                <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-blue-600 to-yellow-500"
                  style={{
                    textShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                    WebkitTextStroke: '2px black',
                  }}
                >
                  超级英雄时代
                </h1>
              </div>
            </motion.div>

            {/* 副标题 - 滑板形状 */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative inline-block"
            >
              <div className="bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500 px-12 py-4 rounded-full transform -skew-x-12 shadow-2xl border-4 border-white">
                <p className="text-3xl font-black text-white transform skew-x-12">
                  3-6岁 · 冒险开始！🚀
                </p>
              </div>
            </motion.div>

            {/* 主题图标 - 赛车排列 */}
            <div className="mt-16 flex justify-center gap-8 flex-wrap">
              {[
                { icon: '⚡', label: '奥特曼', color: 'from-red-500 to-blue-500' },
                { icon: '🚗', label: '赛车', color: 'from-orange-500 to-yellow-500' },
                { icon: '🏰', label: '城堡', color: 'from-pink-500 to-purple-500' },
                { icon: '📚', label: '漫画', color: 'from-yellow-500 to-red-500' },
                { icon: '🛹', label: '滑板', color: 'from-green-500 to-cyan-500' },
              ].map((theme, i) => (
                <motion.div
                  key={theme.label}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                  className={`bg-gradient-to-br ${theme.color} w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-4 border-white cursor-pointer transform hover:-translate-y-2 transition-transform`}
                >
                  <div className="text-4xl">{theme.icon}</div>
                  <div className="text-xs font-bold text-white mt-1">{theme.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 装饰元素 - 飞行的奥特曼 */}
          <motion.div
            className="absolute text-8xl"
            animate={{
              x: [-100, window.innerWidth + 100],
              y: [100, 50, 150, 100],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ⚡
          </motion.div>
        </section>

        {/* 里程碑区 - 漫画格子风格 */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            {/* 标题 - 爆炸框 */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block relative">
                <div className="absolute -inset-4 bg-yellow-400 transform rotate-2"
                  style={{
                    clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                  }}
                ></div>
                <h2 className="relative bg-white px-12 py-4 text-5xl font-black text-red-600 border-4 border-black">
                  成长大事件！💥
                </h2>
              </div>
            </motion.div>

            {/* 漫画格子布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* 漫画边框 */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400 to-orange-500 transform rotate-1"></div>
                  <div className="relative bg-white border-4 border-black overflow-hidden">
                    {/* 图片 */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={milestone.image_url}
                        alt={milestone.title}
                        className="w-full h-full object-cover"
                      />
                      {/* 漫画效果叠加 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      {/* 爆炸标签 */}
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 font-black text-sm transform rotate-12 border-2 border-white shadow-lg">
                        NEW!
                      </div>
                    </div>

                    {/* 内容 */}
                    <div className="p-6 bg-white">
                      <h3 className="text-2xl font-black text-gray-900 mb-2 border-b-4 border-yellow-400 pb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{milestone.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-red-600">
                          📅 {new Date(milestone.date).toLocaleDateString()}
                        </span>
                        <span className="text-2xl">💥</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 查看更多按钮 - 滑板形状 */}
            <motion.div
              className="text-center mt-12"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                href="/milestones"
                className="inline-block bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500 text-white px-12 py-4 rounded-full font-black text-xl transform -skew-x-12 shadow-2xl border-4 border-white hover:shadow-3xl transition-all"
              >
                <span className="transform skew-x-12 inline-block">
                  查看全部冒险 🛹 →
                </span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 精彩瞬间 - 赛车道风格 */}
        <section className="py-20 px-4 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 relative overflow-hidden">
          {/* 赛道线条 */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 bg-white"
                style={{ top: `${20 * i}%`, width: '200%' }}
                animate={{
                  x: ['-100%', '0%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-6xl font-black text-white text-center mb-16 drop-shadow-2xl"
              style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
            >
              🏁 精彩瞬间 🏁
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    zIndex: 10,
                  }}
                  className="relative aspect-square cursor-pointer"
                >
                  <div className="absolute -inset-1 bg-white transform rotate-3"></div>
                  <div className="relative h-full border-4 border-black overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                      <p className="text-white font-black text-sm">{photo.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                href="/gallery"
                className="inline-block bg-white text-red-600 px-12 py-4 rounded-full font-black text-xl shadow-2xl border-4 border-yellow-400 hover:bg-yellow-400 hover:text-white transition-all"
              >
                查看相册 🚗 →
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
