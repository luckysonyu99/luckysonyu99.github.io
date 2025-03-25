'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImagePreview({ src, alt, className = '' }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={`relative cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-lg hover:opacity-90 transition-opacity"
        />
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-7xl w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 