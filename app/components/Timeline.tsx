'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200" />
      
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className={`flex items-center justify-${index % 2 === 0 ? 'end' : 'start'} mb-8`}
        >
          <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-sm text-blue-500 font-semibold">{event.date}</span>
              <h3 className="text-xl font-bold mt-2">{event.title}</h3>
              <p className="text-gray-600 mt-2">{event.description}</p>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-md mt-4"
                />
              )}
            </div>
          </div>
          
          {/* Timeline dot */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
} 