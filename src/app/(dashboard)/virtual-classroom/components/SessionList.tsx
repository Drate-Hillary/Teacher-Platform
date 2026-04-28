'use client';

import { useState } from 'react';
import { useSession } from '@/context/session_context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Calendar02Icon, CameraVideoIcon, Cancel01Icon, Copy01Icon, Delete02Icon, Edit01Icon, File01Icon, FilterVerticalIcon, More01Icon, PlayIcon, Search01Icon, Time04Icon, UserGroupIcon } from '@hugeicons/core-free-icons';

interface SessionListProps {
  type: 'upcoming' | 'past';
}

export default function SessionList({ type }: SessionListProps) {
  const { sessions, updateSession, deleteSession } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredSessions = sessions
    .filter(session => {
      if (type === 'upcoming') return session.status === 'scheduled' || session.status === 'live';
      return session.status === 'completed' || session.status === 'cancelled';
    })
    .filter(session => {
      if (platformFilter !== 'all') return session.platform === platformFilter;
      return true;
    })
    .filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const platformColors = {
    zoom: 'bg-blue-100 text-blue-700',
    'google-meet': 'bg-green-100 text-green-700',
    'microsoft-teams': 'bg-purple-100 text-purple-700',
  };

  const platformLabels = {
    zoom: 'Zoom',
    'google-meet': 'Google Meet',
    'microsoft-teams': 'Teams',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 animate-pulse">Live Now</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Meeting link copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <HugeiconsIcon icon={FilterVerticalIcon} className="h-4 w-4 mr-2" />
              {platformFilter === 'all' ? 'All Platforms' : platformLabels[platformFilter as keyof typeof platformLabels]}
              <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPlatformFilter('all')}>
              All Platforms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlatformFilter('zoom')}>
              Zoom
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlatformFilter('google-meet')}>
              Google Meet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlatformFilter('microsoft-teams')}>
              Microsoft Teams
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(session.status)}
                      <Badge className={platformColors[session.platform]} variant="secondary">
                        <HugeiconsIcon icon={CameraVideoIcon} className="h-3 w-3 mr-1" />
                        {platformLabels[session.platform]}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{session.course} • {session.class}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HugeiconsIcon icon={More01Icon} className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyMeetingLink(session.meetingLink)}>
                        <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 mr-2" />
                        Copy Meeting Link
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={Edit01Icon} className="h-4 w-4 mr-2" />
                        Edit Session
                      </DropdownMenuItem>
                      {session.status === 'scheduled' && (
                        <DropdownMenuItem onClick={() => updateSession(session.id, { status: 'cancelled' })}>
                          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 mr-2" />
                          Cancel Session
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => deleteSession(session.id)} className="text-red-600">
                        <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{session.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <HugeiconsIcon icon={Calendar02Icon} className="h-4 w-4" />
                    <span>{format(new Date(session.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HugeiconsIcon icon={Time04Icon} className="h-4 w-4" />
                    <span>{session.startTime} - {session.endTime} ({session.duration} min)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4" />
                    <span>{session.attendees} attendees</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HugeiconsIcon icon={File01Icon} className="h-4 w-4" />
                    <span>{session.attachments.length} resources</span>
                  </div>
                </div>

                {session.attachments.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Attached Resources:</h4>
                    <div className="space-y-1">
                      {session.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <HugeiconsIcon icon={File01Icon} className="h-3 w-3" />
                          <span>{att.name}</span>
                          <span className="text-xs text-gray-400">({att.size})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {session.status === 'live' || session.status === 'scheduled' ? (
                    <>
                      <Button className="flex-1" onClick={() => window.open(session.meetingLink)}>
                        <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                      <Button variant="outline" onClick={() => copyMeetingLink(session.meetingLink)}>
                        <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" />
                      </Button>
                    </>
                  ) : session.recordingUrl ? (
                    <Button className="flex-1" onClick={() => window.open(session.recordingUrl)}>
                      <HugeiconsIcon icon={CameraVideoIcon} className="h-4 w-4 mr-2" />
                      Watch Recording
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HugeiconsIcon icon={CameraVideoIcon} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-sm text-gray-600">
            {type === 'upcoming' 
              ? 'You have no upcoming sessions scheduled.' 
              : 'No past sessions to display.'}
          </p>
        </div>
      )}
    </div>
  );
}