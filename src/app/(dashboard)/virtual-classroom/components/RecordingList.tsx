'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UploadRecordingDialog from './UploadRecording';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon, Delete01Icon, Download01Icon, MoreVertical, PlayIcon, Search01Icon, Share01Icon, Time04Icon, Upload01Icon, ViewIcon } from '@hugeicons/core-free-icons';

interface Recording {
  id: string;
  title: string;
  sessionTitle: string;
  course: string;
  date: string;
  duration: string;
  views: number;
  size: string;
  thumbnail: string;
  url: string;
}

export default function RecordingsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const recordings: Recording[] = [
    {
      id: '1',
      title: 'Data Structures - Binary Trees',
      sessionTitle: 'Data Structures & Algorithms Review',
      course: 'Computer Science',
      date: '2026-04-20',
      duration: '1:25:30',
      views: 24,
      size: '245 MB',
      thumbnail: '/thumbnails/ds-lecture.jpg',
      url: '#',
    },
    {
      id: '2',
      title: 'Physics Lab Results Discussion',
      sessionTitle: 'Physics Lab Discussion',
      course: 'Physics Lab',
      date: '2026-04-18',
      duration: '55:15',
      views: 18,
      size: '180 MB',
      thumbnail: '/thumbnails/physics-lab.jpg',
      url: '#',
    },
  ];

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4 mr-2" />
          Upload Recording
        </Button>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRecordings.map((recording) => (
          <Card key={recording.id} className="hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900 rounded-t-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <HugeiconsIcon icon={PlayIcon} className="h-12 w-12 text-white opacity-75 hover:opacity-100 cursor-pointer transition-opacity" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {recording.duration}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{recording.title}</h3>
                  <p className="text-sm text-gray-600">{recording.course}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HugeiconsIcon icon={MoreVertical} className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
                      Play
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={Share01Icon} className="h-4 w-4 mr-2" />
                      Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <HugeiconsIcon icon={Delete01Icon}className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Calendar01Icon} className="h-3 w-3" />
                  {recording.date}
                </div>
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={ViewIcon} className="h-3 w-3" />
                  {recording.views} views
                </div>
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Time04Icon} className="h-3 w-3" />
                  {recording.duration}
                </div>
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={Download01Icon} className="h-3 w-3" />
                  {recording.size}
                </div>
              </div>

              <Button className="w-full mt-3" variant="outline" size="sm">
                <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
                Watch Recording
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <UploadRecordingDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
    </div>
  );
}