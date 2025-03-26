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

export default function Home() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 animate-gradient"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 animate-fade-in">
            {settings?.site_title || '宝宝成长记录'} 🌟
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-delay">
            {settings?.site_description || '记录宝宝成长的点点滴滴'} ✨
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/milestones"
              className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors btn-animate"
            >
              查看成长记录 📝
            </Link>
            <Link
              href="/gallery"
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors btn-animate"
            >
              浏览相册 📸
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Milestones */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">最新成长记录 🎯</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="glass-card rounded-xl p-6 hover-card">
                <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                <p className="text-gray-600 mb-4">{milestone.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(milestone.milestone_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/milestones"
              className="inline-block px-6 py-2 text-pink-600 hover:text-pink-700 transition-colors"
            >
              查看更多 → 🎯
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Photos */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">最新照片 📸</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.slice(0, 8).map((photo) => (
              <div key={photo.id} className="relative aspect-square group hover-card">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <h3 className="text-white text-center px-4">{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-block px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              查看更多 → 📸
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 