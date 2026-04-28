'use client';

import { useState } from 'react';
import ScheduleCard from './ScheduleCard';

interface ScheduleItem {
  id: string;
  time: string;
  endTime: string;
  subject: string;
  class: string;
  room: string;
  type: 'physical' | 'virtual' | 'lab' | 'lecture';
  students: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export default function DailySchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      time: '08:00 AM',
      endTime: '09:30 AM',
      subject: 'Advanced Mathematics',
      class: 'Grade 12-A',
      room: 'Room 301',
      type: 'physical',
      students: 32,
      status: 'completed',
    },
    {
      id: '2',
      time: '10:00 AM',
      endTime: '11:30 AM',
      subject: 'Physics Lab',
      class: 'Grade 12-A',
      room: 'Lab 204',
      type: 'lab',
      students: 28,
      status: 'ongoing',
    },
    {
      id: '3',
      time: '12:00 PM',
      endTime: '01:00 PM',
      subject: 'Computer Science',
      class: 'Grade 11-B',
      room: 'Virtual Room',
      type: 'virtual',
      students: 25,
      status: 'upcoming',
    },
    {
      id: '4',
      time: '02:00 PM',
      endTime: '03:30 PM',
      subject: 'Statistics',
      class: 'Grade 12-B',
      room: 'Room 405',
      type: 'lecture',
      students: 30,
      status: 'upcoming',
    },
  ];

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daily Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">{formatDateHeader(selectedDate)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="divide-y divide-gray-100">
        {scheduleItems.length > 0 ? (
          scheduleItems.map((item) => (
            <ScheduleCard key={item.id} item={item} />
          ))
        ) : (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Classes Scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">You have no classes scheduled for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
}