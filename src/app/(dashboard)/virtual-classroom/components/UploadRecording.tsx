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
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Upload01Icon } from '@hugeicons/core-free-icons';

interface UploadRecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadRecordingDialog({ open, onOpenChange }: UploadRecordingDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
    }
    setUploading(false);
    setUploaded(true);
    toast.success('Recording uploaded successfully!');
    
    setTimeout(() => {
      setUploaded(false);
      setProgress(0);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Upload01Icon} className="h-5 w-5" />
            Upload Recording
          </DialogTitle>
          <DialogDescription>
            Upload recorded session videos for students to view later
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!uploaded ? (
            <>
              <div className="space-y-2">
                <Label>Session</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Data Structures & Algorithms Review</SelectItem>
                    <SelectItem value="2">Physics Lab Discussion</SelectItem>
                    <SelectItem value="3">Statistics Office Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Recording Title</Label>
                <Input id="title" placeholder="Enter recording title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" placeholder="Brief description of the recording content" />
              </div>

              <div className="space-y-2">
                <Label>Video File</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HugeiconsIcon icon={Upload01Icon} className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        MP4, MOV, or AVI (Max 2GB)
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="video/*" />
                  </label>
                </div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <HugeiconsIcon icon={Check} className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Complete!</h3>
              <p className="text-sm text-gray-600">
                Your recording has been uploaded and is now available for students.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
              Cancel
            </Button>
            {!uploaded && (
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Recording'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}