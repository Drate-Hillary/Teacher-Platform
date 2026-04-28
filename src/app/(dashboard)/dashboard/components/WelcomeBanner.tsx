'use client';

import { useState, useEffect } from 'react';

interface WelcomeBannerProps {
  teacherName: string;
}

export default function WelcomeBanner({ teacherName }: WelcomeBannerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {greeting}, {teacherName}! 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium backdrop-blur-sm transition-colors duration-200">
              Start Virtual Class
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200">
              View Full Schedule
            </button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs">Today&apos;s Classes</p>
            <p className="text-white text-xl font-bold">4</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs">Pending Tasks</p>
            <p className="text-white text-xl font-bold">12</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs">Online Students</p>
            <p className="text-white text-xl font-bold">89</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs">Unread Messages</p>
            <p className="text-white text-xl font-bold">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}