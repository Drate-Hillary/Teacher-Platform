'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/context/session_context';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, CameraVideoIcon, Cancel01Icon, File02Icon, Link01Icon, SchoolBell01Icon, Time04Icon, Upload01Icon } from '@hugeicons/core-free-icons';

const sessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  platform: z.enum(['zoom', 'google-meet', 'microsoft-teams']),
  course: z.string().min(1, 'Course is required'),
  class: z.string().min(1, 'Class is required'),
  notifyStudents: z.boolean().default(true),
  meetingLink: z.string().url('Please enter a valid URL').optional(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSessionDialog({ open, onOpenChange }: CreateSessionDialogProps) {
  const { createSession } = useSession();
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; size: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      notifyStudents: true,
    },
  });

  const selectedPlatform = watch('platform');

  const platforms = [
    { value: 'zoom', label: 'Zoom', icon: <HugeiconsIcon icon={CameraVideoIcon} />, color: 'text-blue-600' },
    { value: 'google-meet', label: 'Google Meet', icon: <HugeiconsIcon icon={CameraVideoIcon} />, color: 'text-green-600' },
    { value: 'microsoft-teams', label: 'Microsoft Teams', icon: <HugeiconsIcon icon={CameraVideoIcon} />, color: 'text-purple-600' },
  ];

  const courses = [
    'Advanced Mathematics',
    'Physics Lab',
    'Computer Science',
    'Statistics',
    'Chemistry',
    'Biology',
  ];

  const classes = [
    'Grade 11-A',
    'Grade 11-B',
    'Grade 12-A',
    'Grade 12-B',
    'Grade 10-A',
    'Grade 10-B',
  ];

  const generateMeetingLink = async (platform: string) => {
    setIsGenerating(true);
    // Simulate API call to generate meeting link
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const links = {
      zoom: `https://zoom.us/j/${Math.random().toString(36).substring(7)}`,
      'google-meet': `https://meet.google.com/${Math.random().toString(36).substring(2, 8)}`,
      'microsoft-teams': `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(7)}`,
    };
    
    setValue('meetingLink', links[platform as keyof typeof links]);
    setIsGenerating(false);
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} meeting link generated!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
      toast.success(`${files.length} file(s) attached successfully`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SessionFormData) => {
    const duration = calculateDuration(data.startTime, data.endTime);
    
    createSession({
      ...data,
      duration,
      meetingLink: data.meetingLink || '',
      status: 'scheduled',
      attendees: 0,
      attachments: attachments.map((att, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: att.name,
        type: att.type.includes('pdf') ? 'pdf' : att.type.includes('ppt') ? 'ppt' : 'doc',
        url: '#',
        size: att.size,
      })),
    });

    reset();
    setAttachments([]);
    onOpenChange(false);
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={CameraVideoIcon} />
            Create Virtual Session
          </DialogTitle>
          <DialogDescription>
            Set up a new online session with integrated meeting links and resources
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures Review Session"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what will be covered in this session..."
                rows={3}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select onValueChange={(value) => setValue('course', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course && (
                  <p className="text-sm text-red-500">{errors.course.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select onValueChange={(value) => setValue('class', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.class && (
                  <p className="text-sm text-red-500">{errors.class.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" />
              Schedule
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime')}
                  className={errors.startTime ? 'border-red-500' : ''}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500">{errors.startTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register('endTime')}
                  className={errors.endTime ? 'border-red-500' : ''}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-500">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {watch('startTime') && watch('endTime') && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <HugeiconsIcon icon={Time04Icon} className="h-4 w-4" />
                Duration: {calculateDuration(watch('startTime'), watch('endTime'))} minutes
              </div>
            )}
          </div>

          <Separator />

          {/* Platform & Meeting Link */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <HugeiconsIcon icon={CameraVideoIcon} className="h-4 w-4" />
              Platform & Meeting Link
            </h3>

            <div className="space-y-2">
              <Label>Platform *</Label>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => {
                      setValue('platform', platform.value);
                      setValue('meetingLink', '');
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      selectedPlatform === platform.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <HugeiconsIcon icon={platform.icon} className={`h-6 w-6 mx-auto mb-2 ${platform.color}`} />
                    <span className="text-sm font-medium">{platform.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedPlatform && (
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <HugeiconsIcon icon={Link01Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="meetingLink"
                      placeholder="Paste meeting link or generate one"
                      className="pl-9"
                      {...register('meetingLink')}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => generateMeetingLink(selectedPlatform)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      'Generate Link'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Resource Attachments */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
              Resource Attachments
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HugeiconsIcon icon={Upload01Icon} className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, PPT, DOC, or Video files (Max 50MB each)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.mov,.avi"
                  />
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon icon={File02Icon} className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="flex items-center gap-2">
                <HugeiconsIcon icon={SchoolBell01Icon} className="h-4 w-4" />
                Automated Student Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Send email and dashboard notifications to enrolled students
              </p>
            </div>
            <Switch
              id="notifications"
              checked={watch('notifyStudents')}
              onCheckedChange={(checked) => setValue('notifyStudents', checked)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Creating...
                </>
              ) : (
                'Create Session'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}