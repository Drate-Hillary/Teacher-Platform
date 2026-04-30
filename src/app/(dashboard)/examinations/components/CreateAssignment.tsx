'use client';

import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAssessment, Rubric } from '@/context/AssessmentContext';
import RubricBuilder from './RubricBuilder';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel, FileIcon, PercentIcon, Upload } from '@hugeicons/core-free-icons';

interface CreateAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAssignment({ open, onOpenChange }: CreateAssignmentProps) {
  const { createAssignment } = useAssessment();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [class_, setClass] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState(100);
  const [allowLate, setAllowLate] = useState(false);
  const [penaltyPercentage, setPenaltyPercentage] = useState(10);
  const [rubric, setRubric] = useState<Rubric[]>([]);
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; size: string }>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    createAssignment({
      title,
      description,
      course,
      class: class_,
      dueDate,
      totalPoints,
      rubric,
      lateSubmissionPolicy: {
        allowLate,
        penaltyPercentage,
        deadlineExtension: allowLate ? dueDate : null,
      },
      attachments,
      status: 'published',
      submissions: 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogDescription>
            Create a homework task with rubric, due date, and submission policies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assignment Title</Label>
              <Input
                placeholder="e.g., Statistics Research Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Detailed assignment instructions..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Statistics">Statistics</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Advanced Mathematics">Advanced Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={class_} onValueChange={setClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
                    <SelectItem value="Grade 12-B">Grade 12-B</SelectItem>
                    <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Points</Label>
                <Input
                  type="number"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Due Date & Late Policy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Late Submissions</Label>
                    <p className="text-sm text-gray-500">Let students submit after the due date</p>
                  </div>
                  <Switch checked={allowLate} onCheckedChange={setAllowLate} />
                </div>

                {allowLate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                    <div>
                      <Label className="flex items-center gap-2">
                        <HugeiconsIcon icon={PercentIcon} className="h-4 w-4" />
                        Late Submission Penalty (%)
                      </Label>
                      <Input
                        type="number"
                        value={penaltyPercentage}
                        onChange={(e) => setPenaltyPercentage(parseInt(e.target.value))}
                        min={0}
                        max={100}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Percentage deducted from total score per day late
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Attachments */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Attachments</h3>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center">
                  <HugeiconsIcon icon={Upload} className="h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-600 mt-1">Click to upload files</p>
                </div>
                <Input type="file" className="hidden" multiple onChange={handleFileUpload} />
              </label>
            </div>

            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={FileIcon} className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                  <HugeiconsIcon icon={Cancel} className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Rubric Builder */}
          <RubricBuilder rubric={rubric} onChange={setRubric} />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Assignment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}