'use client';

import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SingleCalendarProps {
  date?: Date | string; // Accepts both Date objects and ISO strings
  onDateChange: (date?: Date) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
}

export default function SingleCalendar({
  date,
  onDateChange,
  placeholder = "Pick a date",
  hasError = false,
  disabled = false,
}: SingleCalendarProps) {
  // Safely parse the date whether it comes in as a string or a Date object
  const parsedDate = typeof date === 'string' && date ? new Date(date) : (date as Date | undefined);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !parsedDate && 'text-gray-500', // Placeholder styling
            hasError && 'border-red-500 focus-visible:ring-red-500' // Error styling
          )}
        >
          <HugeiconsIcon icon={Calendar03Icon} className="mr-2 h-4 w-4" />
          {parsedDate ? (
            format(parsedDate, 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={onDateChange}
          // Optional: Prevents selecting dates in the past
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}