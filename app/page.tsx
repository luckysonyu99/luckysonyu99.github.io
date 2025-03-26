'use client';

import { useEffect, useState } from 'react';
import { getSettings } from '@/models/settings';
import { getMilestones } from '@/models/milestone';
import { getPhotos } from '@/models/gallery';
import type { Settings } from '@/models/settings';
import type { Milestone } from '@/models/milestone';
import type { Photo } from '@/models/gallery';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, milestonesData, photosData] = await Promise.all([
          getSettings(),
          getMilestones(),
          getPhotos(),
        ]);
        setSettings(settingsData);
        setMilestones(milestonesData);
        setPhotos(photosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 font-qingke text-candy-pink">
          {settings?.site_title || 'Luca\'s Growing Journey'} 🌱
        </h1>
        <p className="text-xl text-gray-600 mb-8 font-kuaile">
          {settings?.site_description || '记录成长的每一个精彩瞬间'} ✨
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/milestones"
            className="btn btn-primary font-kuaile"
          >
            查看里程碑 🎯
          </a>
          <a
            href="/gallery"
            className="btn btn-secondary font-kuaile"
          >
            浏览相册 📸
          </a>
        </div>
      </section>

      {/* Latest Milestones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center font-qingke text-candy-purple">
            最新里程碑 🎯
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="card card-hover">
                <h3 className="text-xl font-bold mb-2 font-qingke text-candy-blue">
                  {milestone.title}
                </h3>
                <p className="text-gray-600 mb-4 font-kuaile">
                  {milestone.description}
                </p>
                <p className="text-sm text-gray-500 font-kuaile">
                  {new Date(milestone.milestone_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/milestones"
              className="text-candy-pink hover:text-candy-purple transition-colors font-kuaile"
            >
              查看更多里程碑 →
            </a>
          </div>
        </div>
      </section>

      {/* Latest Photos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center font-qingke text-candy-yellow">
            最新照片 📸
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.slice(0, 8).map((photo) => (
              <div key={photo.id} className="relative aspect-square group">
                <Image
                  src={photo.url}
                  alt={photo.title || '照片'}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4 font-kuaile">
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/gallery"
              className="text-candy-pink hover:text-candy-purple transition-colors font-kuaile"
            >
              查看更多照片 →
            </a>
          </div>
        </div>
      </section>

      {/* Fun Cards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center font-qingke text-candy-green">
            趣味探索 🎮
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card card-hover">
              <h3 className="text-xl font-bold mb-2 font-qingke text-candy-pink">
                恐龙探险 🦖
              </h3>
              <p className="text-gray-600 mb-4 font-kuaile">
                和Luca一起探索神秘的恐龙世界，认识各种有趣的史前生物！
              </p>
            </div>
            <div className="card card-hover">
              <h3 className="text-xl font-bold mb-2 font-qingke text-candy-blue">
                汽车总动员 🚗
              </h3>
              <p className="text-gray-600 mb-4 font-kuaile">
                和闪电麦昆一起驰骋在赛道上，体验速度与激情！
              </p>
            </div>
            <div className="card card-hover">
              <h3 className="text-xl font-bold mb-2 font-qingke text-candy-yellow">
                汪汪队出动 🐕
              </h3>
              <p className="text-gray-600 mb-4 font-kuaile">
                和阿奇、毛毛一起拯救冒险湾，成为小英雄！
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 