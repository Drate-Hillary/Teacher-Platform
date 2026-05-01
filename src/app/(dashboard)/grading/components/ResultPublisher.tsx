'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SentIcon,
  Time02Icon,
  Alert01Icon,
  ViewIcon,
  Calendar03Icon,
  UserGroupIcon,
  Globe02Icon,
  Notification03Icon,
  ArrowRight01Icon,
  SaveIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

import { useGrading } from '@/context/GradingContext';

export default function ResultPublisher() {
  const { selectedGradebook, publishResults } = useGrading();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);

  const publishingStatuses = [
    {
      assessment: 'Homework 1',
      status: 'published',
      publishedAt: '2026-03-20 09:00 AM',
      students: 30,
      viewed: 28,
      icon: SaveIcon,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      assessment: 'Quiz 1 - Calculus',
      status: 'published',
      publishedAt: '2026-03-25 10:30 AM',
      students: 30,
      viewed: 30,
      icon: CheckmarkCircle01Icon,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      assessment: 'Midterm Exam',
      status: 'ready',
      publishedAt: null,
      students: 30,
      viewed: 0,
      icon: Time02Icon,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      assessment: 'Group Project',
      status: 'draft',
      publishedAt: null,
      students: 30,
      viewed: 0,
      icon: Alert01Icon,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
  ];

  const handlePublish = () => {
    if (selectedAssessment) {
      publishResults(selectedAssessment);
      setPublishDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Publishing Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Result Publishing</h3>
              <p className="text-sm text-gray-600 mt-1">
                Control when and how grades are released to students
              </p>
            </div>
            <Button onClick={() => setPublishDialogOpen(true)}>
              <HugeiconsIcon icon={SentIcon} className="h-4 w-4 mr-2" />
              Publish Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Publishing Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={Globe02Icon} className="h-4 w-4" />
                Visibility Settings
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Grades</Label>
                    <p className="text-xs text-gray-500">Students can see their numerical scores</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Feedback</Label>
                    <p className="text-xs text-gray-500">Students can read your comments</p>
                  </div>
                  <Switch checked={showFeedback} onCheckedChange={setShowFeedback} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Class Statistics</Label>
                    <p className="text-xs text-gray-500">Students can see average, highest, lowest</p>
                  </div>
                  <Switch checked={showStatistics} onCheckedChange={setShowStatistics} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Rank</Label>
                    <p className="text-xs text-gray-500">Students can see their class rank</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={Notification03Icon} className="h-4 w-4" />
                Notification Settings
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-gray-500">Send email when results are published</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dashboard Alerts</Label>
                    <p className="text-xs text-gray-500">Show notification on student dashboard</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Parent Notifications</Label>
                    <p className="text-xs text-gray-500">Send results to parents/guardians</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Publishing Schedule */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" />
              Scheduled Publishing
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <HugeiconsIcon icon={Time02Icon} className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Automatic Publishing</p>
                  <p className="text-xs text-blue-600">
                    Results will be automatically published 48 hours after grading completion
                  </p>
                </div>
                <Switch className="ml-auto" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Status List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Assessment Publishing Status</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {publishingStatuses.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bg}`}>
                    <HugeiconsIcon icon={item.icon} className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.assessment}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <HugeiconsIcon icon={UserGroupIcon} className="h-3 w-3" />
                      <span>{item.students} students</span>
                      {item.publishedAt && (
                        <>
                          <span>•</span>
                          <HugeiconsIcon icon={Time02Icon} className="h-3 w-3" />
                          <span>Published: {item.publishedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.status === 'published' && (
                    <div className="text-right flex items-center text-xs text-gray-500">
                      <HugeiconsIcon icon={ViewIcon} className="h-3 w-3 inline mr-1" />
                      {item.viewed}/{item.students} viewed
                    </div>
                  )}
                  <Badge className={
                    item.status === 'published' ? 'bg-green-100 text-green-700' :
                    item.status === 'ready' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {item.status === 'published' ? 'Published' :
                     item.status === 'ready' ? 'Ready' : 'Draft'}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={SentIcon} className="h-5 w-5" />
              Publish Results
            </DialogTitle>
            <DialogDescription>
              Select an assessment to publish grades to student portals
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Select Assessment</Label>
              <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose assessment to publish" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a3">Midterm Exam</SelectItem>
                  <SelectItem value="a4">Group Project</SelectItem>
                  <SelectItem value="a5">Final Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students</span>
                <span className="font-medium">30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Graded</span>
                <span className="font-medium text-green-600">30/30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Notifications</span>
                <span className="font-medium">
                  {notifyStudents ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Notify students via email</Label>
              <Switch checked={notifyStudents} onCheckedChange={setNotifyStudents} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublish} disabled={!selectedAssessment}>
              <HugeiconsIcon icon={SentIcon} className="h-4 w-4 mr-2" />
              Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}