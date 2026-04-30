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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/context/AssessmentContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, CheckSquare, EncryptIcon, File01Icon, LockKeyIcon, Upload01Icon, UploadIcon, ViewIcon } from '@hugeicons/core-free-icons';

const examSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  type: z.enum(['final', 'midterm', 'quiz', 'worksheet']),
  course: z.string().min(1, 'Course is required'),
  class: z.string().min(1, 'Class is required'),
  totalMarks: z.number().min(1, 'Total marks required'),
  dueDate: z.string().min(1, 'Due date is required'),
  instructions: z.string().optional(),
});

type ExamFormData = z.infer<typeof examSchema>;
type ExamType = "final" | "midterm" | "quiz" | "worksheet";

interface UploadOfflineExamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadOfflineExam({ open, onOpenChange }: UploadOfflineExamProps) {
  const { createOfflineExam } = useAssessment();
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    url: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      type: 'quiz',
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(i);
    }

    setUploadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      url: URL.createObjectURL(file),
    });
    
    setUploading(false);
    setUploadProgress(0);
  };

  const onSubmit = async (data: ExamFormData) => {
    if (!uploadedFile) {
      return;
    }

    createOfflineExam({
      ...data,
      fileUrl: uploadedFile.url,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type.includes('pdf') ? 'pdf' : 'doc',
      status: 'draft',
      instructions: data.instructions || ''
    });

    reset();
    setUploadedFile(null);
    onOpenChange(false);
  };

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
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={UploadIcon} className="h-5 w-5" />
            Upload Offline Exam
          </DialogTitle>
          <DialogDescription>
            Upload a secure PDF or Word document for offline examinations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="h-4 w-4" />
              Exam Document
            </h3>

            {!uploadedFile ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-blue-50 rounded-full mb-3">
                      <HugeiconsIcon icon={Upload01Icon} className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF or Word documents (Max 25MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <HugeiconsIcon icon={File01Icon} className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">{uploadedFile.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(uploadedFile.url)}>
                      <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUploadedFile(null)}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                  <HugeiconsIcon icon={CheckSquare} className="h-4 w-4" />
                  File uploaded successfully
                  <Badge variant="secondary" className="ml-2">
                    <HugeiconsIcon icon={EncryptIcon} className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                </div>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading and encrypting...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>

          <Separator />

          {/* Exam Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Exam Details</h3>

            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Advanced Mathematics Final Exam"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the exam content and coverage..."
                rows={3}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exam Type *</Label>
                <Select
                  onValueChange={(value) => setValue('type', value as ExamType)}
                  defaultValue="quiz"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="final">Final Exam</SelectItem>
                    <SelectItem value="midterm">Midterm Exam</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="worksheet">Worksheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="100"
                  {...register('totalMarks', { valueAsNumber: true })}
                  className={errors.totalMarks ? 'border-red-500' : ''}
                />
                {errors.totalMarks && <p className="text-sm text-red-500">{errors.totalMarks.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course *</Label>
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
              </div>

              <div className="space-y-2">
                <Label>Class *</Label>
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Special instructions for students..."
                rows={2}
                {...register('instructions')}
              />
            </div>
          </div>

          <Separator />

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <HugeiconsIcon icon={LockKeyIcon} className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Security Notice</p>
                <p className="mt-1">
                  Uploaded documents will be encrypted and stored securely. 
                  Only authorized teachers and administrators will have access.
                  Download links will be automatically generated for approved students.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !uploadedFile}>
              {isSubmitting ? 'Uploading...' : 'Upload Exam'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}