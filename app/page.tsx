'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">
            Luca's Growing Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to my wonderful adventure of growing up! 🦖🚗🐾
          </p>
        </motion.div>
        
        {/* Timeline section placeholder */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
            My Milestones
          </h2>
          {/* Timeline component will be added here */}
        </section>
        
        {/* Photo gallery placeholder */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
            Photo Gallery
          </h2>
          {/* Gallery component will be added here */}
        </section>
      </div>
    </main>
  );
} 