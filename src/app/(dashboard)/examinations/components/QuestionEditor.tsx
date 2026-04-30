'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Question } from '../context/AssessmentContext';
import { Badge } from '@/components/ui/badge';

interface QuestionEditorProps {
  question: Question;
  onChange: (updates: Partial<Question>) => void;
}

export default function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text</Label>
        <Textarea
          value={question.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Enter your question..."
          rows={2}
        />
      </div>

      {(question.type === 'multiple-choice' || question.type === 'true-false') && question.options && (
        <div className="space-y-2">
          <Label>Options</Label>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-6">{String.fromCharCode(65 + index)}.</span>
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options!];
                  newOptions[index] = e.target.value;
                  onChange({ options: newOptions });
                }}
                placeholder={`Option ${index + 1}`}
                disabled={question.type === 'true-false'}
              />
              {question.correctAnswer === option && (
                <Badge className="bg-green-500">Correct</Badge>
              )}
              {question.type === 'multiple-choice' && question.correctAnswer !== option && (
                <button
                  onClick={() => onChange({ correctAnswer: option })}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark correct
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {question.type === 'true-false' && (
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          <Select
            value={question.correctAnswer as string}
            onValueChange={(value) => onChange({ correctAnswer: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="True">True</SelectItem>
              <SelectItem value="False">False</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {(question.type === 'short-answer' || question.type === 'essay') && (
        <div className="space-y-2">
          <Label>Model Answer / Grading Notes</Label>
          <Textarea
            value={question.correctAnswer as string}
            onChange={(e) => onChange({ correctAnswer: e.target.value })}
            placeholder="Enter the correct answer or grading guidelines..."
            rows={3}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Points</Label>
          <Input
            type="number"
            value={question.points}
            onChange={(e) => onChange({ points: parseInt(e.target.value) || 0 })}
            min={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={question.difficulty}
            onValueChange={(value: any) => onChange({ difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}