'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Video, Clock, Users } from 'lucide-react';
import SessionList from './components/SessionList';
import CreateSessionDialog from './components/CreateSessionDialog';
import SessionCalendar from './components/SessionCalendar';
import RecordingsList from './components/RecordingsList';
import { SessionProvider } from '../../../context/SessionContext';

export default function VirtualClassroomClient() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <SessionProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Virtual Classroom</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your online sessions, meetings, and recordings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Today\'s Sessions',
              value: '3',
              icon: Video,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'This Week',
              value: '12',
              icon: Calendar,
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
            {
              label: 'Total Hours',
              value: '24.5',
              icon: Clock,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
            {
              label: 'Participants',
              value: '245',
              icon: Users,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <SessionList type="upcoming" />
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <SessionList type="past" />
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4">
            <RecordingsList />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <SessionCalendar />
          </TabsContent>
        </Tabs>

        {/* Create Session Dialog */}
        <CreateSessionDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog} 
        />
      </div>
    </SessionProvider>
  );
}