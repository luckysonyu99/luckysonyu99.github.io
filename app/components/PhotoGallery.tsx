'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          className="relative group"
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-semibold">{photo.title}</h3>
            <p className="text-sm">{photo.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 