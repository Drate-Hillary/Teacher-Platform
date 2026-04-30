'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ExamConfiguration } from '@/context/AssessmentContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock02Icon, ShuffleIcon, ViewIcon } from '@hugeicons/core-free-icons';

interface ExamConfiguratorProps {
  configuration: ExamConfiguration;
  onChange: (config: ExamConfiguration) => void;
}

export default function ExamConfigurator({ configuration, onChange }: ExamConfiguratorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <HugeiconsIcon icon={Clock02Icon} className="h-5 w-5" />
          Schedule & Timing
        </h3>
        <p className="text-sm text-gray-600 mt-1">Set when the assessment is available and time limits</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={configuration.startDate}
            onChange={(e) => onChange({ ...configuration, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input
            type="time"
            value={configuration.startTime}
            onChange={(e) => onChange({ ...configuration, startTime: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={configuration.endDate}
            onChange={(e) => onChange({ ...configuration, endDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input
            type="time"
            value={configuration.endTime}
            onChange={(e) => onChange({ ...configuration, endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Time Limit (minutes)</Label>
        <Input
          type="number"
          value={configuration.timeLimit}
          onChange={(e) => onChange({ ...configuration, timeLimit: parseInt(e.target.value) || 0 })}
          min={5}
          max={480}
        />
        <p className="text-xs text-gray-500">Set to 0 for no time limit</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <HugeiconsIcon icon={ShuffleIcon} className="h-5 w-5" />
          Question Settings
        </h3>
        <p className="text-sm text-gray-600 mt-1">Configure how questions are presented</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Randomize Questions</Label>
            <p className="text-sm text-gray-500">Present questions in random order to each student</p>
          </div>
          <Switch
            checked={configuration.randomizeQuestions}
            onCheckedChange={(checked) => onChange({ ...configuration, randomizeQuestions: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Randomize Options</Label>
            <p className="text-sm text-gray-500">Shuffle multiple choice options</p>
          </div>
          <Switch
            checked={configuration.randomizeOptions}
            onCheckedChange={(checked) => onChange({ ...configuration, randomizeOptions: checked })}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <HugeiconsIcon icon={ViewIcon} className="h-5 w-5" />
          Results & Grading
        </h3>
        <p className="text-sm text-gray-600 mt-1">Configure result visibility and passing criteria</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Show Results</Label>
          <Select
            value={configuration.showResults}
            onValueChange={(value) => onChange({ ...configuration, showResults: value as "immediately" | "after_due" | "never" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately after submission</SelectItem>
              <SelectItem value="after_due">After due date</SelectItem>
              <SelectItem value="never">Never (manual release)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Max Attempts</Label>
          <Input
            type="number"
            value={configuration.maxAttempts}
            onChange={(e) => onChange({ ...configuration, maxAttempts: parseInt(e.target.value) || 1 })}
            min={1}
            max={10}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Passing Score (%)</Label>
        <Input
          type="number"
          value={configuration.passingScore}
          onChange={(e) => onChange({ ...configuration, passingScore: parseInt(e.target.value) || 0 })}
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}