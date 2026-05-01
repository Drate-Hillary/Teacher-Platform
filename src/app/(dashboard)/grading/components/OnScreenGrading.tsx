'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGrading } from '@/context/GradingContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  File02Icon,
  Edit02Icon,
  PencilIcon,
  Comment01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Refresh01Icon,
  Download01Icon,
  PrinterIcon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  UserIcon,
  ZoomOutAreaIcon,
  ZoomInAreaIcon,
  SaveIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

interface Annotation {
  id: string;
  type: 'highlight' | 'comment' | 'drawing';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
  page: number;
}

interface OnScreenGradingProps {
  onOpenAnnotation?: (studentId: string, studentName: string) => void;
  onOpenGradeEntry?: (studentId: string, studentName: string, assessmentId?: string, assessmentTitle?: string) => void;
}

export default function OnScreenGrading({ onOpenAnnotation, onOpenGradeEntry }: OnScreenGradingProps) {
  const { selectedGradebook, updateGrade } = useGrading();
  const [currentSubmission, setCurrentSubmission] = useState(0);
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<'highlight' | 'comment' | 'pen'>('highlight');
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [rubricExpanded, setRubricExpanded] = useState(true);

  const submissions = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      assignmentTitle: 'Homework 1 - Calculus Problems',
      submittedAt: '2026-03-15 11:30 PM',
      files: [
        { name: 'homework1_solution.pdf', type: 'pdf', pages: 5, size: '2.4 MB' },
        { name: 'workings.jpg', type: 'image', size: '1.1 MB' },
      ],
      status: 'pending',
      maxScore: 100,
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      assignmentTitle: 'Homework 1 - Calculus Problems',
      submittedAt: '2026-03-16 01:15 AM',
      files: [
        { name: 'bob_hw1.pdf', type: 'pdf', pages: 4, size: '1.8 MB' },
      ],
      status: 'pending',
      maxScore: 100,
    },
  ];

  const handleSaveGrade = () => {
    if (score) {
      updateGrade(submissions[currentSubmission].id, 'a1', parseFloat(score), feedback);
    }
  };

  const tools = [
    { id: 'highlight' as const, icon: PencilIcon, label: 'Highlight', color: 'text-yellow-600' },
    { id: 'comment' as const, icon: Comment01Icon, label: 'Comment', color: 'text-blue-600' },
    { id: 'pen' as const, icon: Edit02Icon, label: 'Draw', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Document Viewer */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {submissions[currentSubmission].assignmentTitle}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
                  {submissions[currentSubmission].studentName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {currentSubmission + 1} of {submissions.length}
                </Badge>
                <Button variant="outline" size="icon" disabled={currentSubmission === 0}
                  onClick={() => setCurrentSubmission(c => c - 1)}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={currentSubmission === submissions.length - 1}
                  onClick={() => setCurrentSubmission(c => c + 1)}>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Toolbar */}
          <div className="border-b p-2 flex items-center gap-2 flex-wrap">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTool(tool.id)}
              >
                <HugeiconsIcon icon={tool.icon} className={`h-4 w-4 mr-2 ${tool.color}`} />
                {tool.label}
              </Button>
            ))}
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(25, z - 25))}>
              <HugeiconsIcon icon={ZoomOutAreaIcon} className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-15 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(200, z + 25))}>
              <HugeiconsIcon icon={ZoomInAreaIcon} className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowTurnBackwardIcon} className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowTurnForwardIcon} className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={PrinterIcon} className="h-4 w-4" />
            </Button>

            <div className="ml-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onOpenAnnotation?.(
                  submissions[currentSubmission].id, 
                  submissions[currentSubmission].studentName
                )}
              >
                <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2 text-blue-600" />
                Advanced Annotation
              </Button>
            </div>
          </div>

          {/* Document View */}
          <CardContent className="p-0">
            <div className="bg-gray-100 min-h-150 flex items-center justify-center relative">
              {/* Simulated Document */}
              <div className="bg-white shadow-lg w-full max-w-2xl min-h-200 m-8 p-8 relative"
                   style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <HugeiconsIcon icon={File02Icon} className="h-10 w-10 text-red-500" />
                    <div>
                      <p className="font-medium">{submissions[currentSubmission].files[0]?.name}</p>
                      <p className="text-sm text-gray-500">
                        {submissions[currentSubmission].files[0]?.pages} pages • 
                        {submissions[currentSubmission].files[0]?.size}
                      </p>
                    </div>
                  </div>

                  {/* Simulated Content */}
                  <div className="space-y-4">
                    <div className="border p-4 rounded bg-yellow-50">
                      <p className="font-semibold">Problem 1: Limits</p>
                      <p className="mt-2">Find the limit: lim(x→0) (sin x)/x</p>
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p>Solution: lim(x→0) (sin x)/x = 1</p>
                        <p className="text-sm text-gray-500 mt-1">Using L&apos;Hôpital&apos;s rule or the squeeze theorem</p>
                      </div>
                    </div>
                    <div className="border p-4 rounded">
                      <p className="font-semibold">Problem 2: Derivatives</p>
                      <p className="mt-2">Find f&apos;(x) if f(x) = 3x⁴ - 2x³ + 5x - 7</p>
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p>Solution: f&apos;(x) = 12x³ - 6x² + 5</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annotations would be rendered here */}
              </div>

              {/* Page Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
                <Button variant="ghost" size="icon" disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-20 text-center">
                  Page {currentPage} of {submissions[currentSubmission].files[0]?.pages || 1}
                </span>
                <Button variant="ghost" size="icon"
                  onClick={() => setCurrentPage(p => p + 1)}>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grading Panel */}
      <div className="space-y-4">
        {/* Score & Feedback */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Grading Panel</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onOpenGradeEntry?.(
                  submissions[currentSubmission].id,
                  submissions[currentSubmission].studentName,
                  'a1', // Example assessment ID
                  submissions[currentSubmission].assignmentTitle
                )}
              >
                <HugeiconsIcon icon={Comment01Icon} className="h-4 w-4 mr-2 text-blue-600" />
                Detailed Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Score</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Enter score"
                  min={0}
                  max={submissions[currentSubmission].maxScore}
                />
                <span className="text-sm text-gray-500">
                  / {submissions[currentSubmission].maxScore}
                </span>
              </div>
              {score && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      parseFloat(score) / submissions[currentSubmission].maxScore >= 0.7
                        ? 'bg-green-100 text-green-700'
                        : parseFloat(score) / submissions[currentSubmission].maxScore >= 0.5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }>
                      {((parseFloat(score) / submissions[currentSubmission].maxScore) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label>Feedback</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveGrade}>
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4 mr-2" />
                Save Grade
              </Button>
              <Button variant="outline">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rubric */}
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setRubricExpanded(!rubricExpanded)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Grading Rubric</h3>
              <HugeiconsIcon 
                icon={ArrowLeft01Icon} 
                className={`h-4 w-4 transition-transform ${rubricExpanded ? '-rotate-90' : ''}`} 
              />
            </div>
          </CardHeader>
          {rubricExpanded && (
            <CardContent className="space-y-3">
              {[
                { criteria: 'Correctness', maxPoints: 40, description: 'Accuracy of mathematical solutions' },
                { criteria: 'Methodology', maxPoints: 30, description: 'Problem-solving approach and steps' },
                { criteria: 'Presentation', maxPoints: 20, description: 'Clarity and organization of work' },
                { criteria: 'Completeness', maxPoints: 10, description: 'All problems attempted' },
              ].map((item, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{item.criteria}</p>
                    <Badge variant="secondary">{item.maxPoints} pts</Badge>
                  </div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Quick Comments */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Quick Comments</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'Excellent work!',
                'Show your steps',
                'Check your calculations',
                'Good explanation',
                'Needs more detail',
                'Incorrect method',
                'Partial credit',
                'See feedback notes',
              ].map((comment, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setFeedback(prev => prev + (prev ? '\n' : '') + comment)}
                >
                  {comment}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}