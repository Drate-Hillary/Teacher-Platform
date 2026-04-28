'use client';

import { useState } from 'react';
import { useSession } from '@/context/session_context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, ArrowRight, CameraVideoIcon } from '@hugeicons/core-free-icons';

export default function SessionCalendar() {
  const { sessions } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getSessionsForDay = (date: Date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.date), date)
    );
  };

  return (
    <Card>
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <HugeiconsIcon icon={ArrowLeft} className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <HugeiconsIcon icon={ArrowRight} className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center text-xs font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, dayIdx) => {
            const daySessions = getSessionsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={dayIdx}
                className={`bg-white p-2 min-h-30 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {daySessions.map((session) => (
                    <div
                      key={session.id}
                      className="text-xs p-1 rounded bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
                      title={session.title}
                    >
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={CameraVideoIcon} className="h-3 w-3 shrink-0" />
                        <span className="truncate">{session.startTime}</span>
                      </div>
                      <p className="truncate font-medium mt-0.5">{session.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" />
            <span>Virtual Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-50 border border-green-200" />
            <span>Recording Available</span>
          </div>
        </div>
      </div>
    </Card>
  );
}