'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Hugeicons Imports
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Time02Icon,
  UserIcon,
  StarIcon,
  Comment01Icon,
  Alert01Icon,
  Cancel01Icon,
  ViewIcon,
  Tick01Icon,
  File02Icon,
  Clock01Icon,
  Check,
  SaveIcon,
} from '@hugeicons/core-free-icons';

import { useGrading } from '@/context/GradingContext';
import { toast } from 'sonner';

interface GradeEntryProps {
  studentId?: string;
  assessmentId?: string;
  studentName?: string;
  assessmentTitle?: string;
  maxScore?: number;
  onSave?: (score: number, feedback: string, status: string) => void;
  onCancel?: () => void;
}

export default function GradeEntry({
  studentId = '1',
  assessmentId = 'a1',
  studentName = 'Alice Johnson',
  assessmentTitle = 'Homework 1 - Calculus Problems',
  maxScore = 100,
  onSave,
  onCancel,
}: GradeEntryProps) {
  const { updateGrade } = useGrading();
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [status, setStatus] = useState<string>('pending');
  const [lateSubmission, setLateSubmission] = useState(false);
  const [latePenalty, setLatePenalty] = useState(0);
  const [showRubric, setShowRubric] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState<string[]>([]);

  const percentage = score ? ((parseFloat(score) / maxScore) * 100).toFixed(1) : '0';
  const adjustedScore = lateSubmission && latePenalty > 0
    ? parseFloat(score) * (1 - latePenalty / 100)
    : parseFloat(score);

  const gradeHistory = [
    { date: '2026-03-16 14:30', action: 'Grade entered', score: 85, user: 'Previous Teacher' },
    { date: '2026-03-17 09:15', action: 'Feedback updated', score: 88, user: 'Current Teacher' },
    { date: '2026-03-18 11:00', action: 'Grade finalized', score: 88, user: 'Current Teacher' },
  ];

  const rubricCriteria = [
    { criteria: 'Correctness', maxPoints: 40, description: 'Accuracy of solutions' },
    { criteria: 'Methodology', maxPoints: 30, description: 'Problem-solving approach' },
    { criteria: 'Presentation', maxPoints: 20, description: 'Clarity and organization' },
    { criteria: 'Completeness', maxPoints: 10, description: 'All problems attempted' },
  ];

  const quickComments = [
    'Excellent work! Keep it up!',
    'Good effort, but needs improvement',
    'Show your working steps',
    'Check your calculations',
    'Well-explained solution',
    'Incorrect approach used',
    'Partial credit awarded',
    'Please review the material',
    'Outstanding presentation',
    'Missing key concepts',
  ];

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return { letter: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { letter: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { letter: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { letter: 'D', color: 'text-orange-600' };
    return { letter: 'F', color: 'text-red-600' };
  };

  const handleSave = () => {
    if (!score) {
      toast.error('Please enter a score');
      return;
    }

    const finalScore = lateSubmission ? adjustedScore : parseFloat(score);
    updateGrade(studentId, assessmentId, finalScore, feedback);
    
    if (onSave) {
      onSave(finalScore, feedback, status);
    }
  };

  const handleQuickComment = (comment: string) => {
    setFeedback(prev => prev + (prev ? '\n' : '') + comment);
  };

  const handleStarRating = (rating: number) => {
    const ratings = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];
    setFeedback(prev => prev + (prev ? '\n' : '') + `Overall Rating: ${ratings[rating - 1]}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Grade Entry Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Grade Entry</h3>
                <p className="text-sm text-gray-600 mt-1">{assessmentTitle}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <HugeiconsIcon icon={Time02Icon} className="h-3 w-3" />
                Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <HugeiconsIcon icon={UserIcon} className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{studentName}</h4>
                <p className="text-sm text-gray-600">{studentId} • Submitted: Mar 15, 2026</p>
              </div>
            </div>

            {/* Score Input */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Score</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                    min={0}
                    max={maxScore}
                    className="text-2xl h-16 text-center font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                    / {maxScore}
                  </span>
                </div>
                {score && (
                  <div className={`p-4 rounded-xl border-2 ${getGradeColor(parseFloat(score))}`}>
                    <p className="text-3xl font-bold">{percentage}%</p>
                    <p className={`text-lg font-bold ${getLetterGrade(parseFloat(percentage)).color}`}>
                      {getLetterGrade(parseFloat(percentage)).letter}
                    </p>
                  </div>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 mr-2">Quick Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarRating(star)}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <HugeiconsIcon icon={StarIcon} className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Late Submission */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Time02Icon} className="h-5 w-5 text-yellow-600" />
                <div>
                  <Label className="text-yellow-800">Late Submission</Label>
                  <p className="text-sm text-yellow-700">Apply late submission penalty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={lateSubmission} onCheckedChange={setLateSubmission} />
                {lateSubmission && (
                  <Select value={latePenalty.toString()} onValueChange={(v) => setLatePenalty(parseInt(v))}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% off</SelectItem>
                      <SelectItem value="10">10% off</SelectItem>
                      <SelectItem value="15">15% off</SelectItem>
                      <SelectItem value="20">20% off</SelectItem>
                      <SelectItem value="25">25% off</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {lateSubmission && score && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  Adjusted Score: <span className="font-bold">{adjustedScore.toFixed(1)}</span> / {maxScore}
                  {' '}({((adjustedScore / maxScore) * 100).toFixed(1)}%)
                </p>
              </div>
            )}

            {/* Feedback */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Feedback</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback for the student..."
                rows={5}
              />
            </div>

            {/* Quick Comments */}
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Quick Comments</Label>
              <div className="flex flex-wrap gap-2">
                {quickComments.map((comment, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuickComment(comment)}
                  >
                    <HugeiconsIcon icon={Comment01Icon} className="h-3 w-3 mr-1" />
                    {comment}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grade Status */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Grade Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Time02Icon} className="h-4 w-4 text-yellow-500" />
                      Pending Review
                    </div>
                  </SelectItem>
                  <SelectItem value="graded">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Check} className="h-4 w-4 text-green-500" />
                      Final Grade
                    </div>
                  </SelectItem>
                  <SelectItem value="excused">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Alert01Icon} className="h-4 w-4 text-gray-500" />
                      Excused
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <HugeiconsIcon icon={SaveIcon} className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleSave}>
                  <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4 mr-2" />
                  Save & Finalize
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Submission Viewer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Student Submission</h3>
              <Badge variant="secondary">1 file attached</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <HugeiconsIcon icon={File02Icon} className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">homework1_solution.pdf</p>
                  <p className="text-xs text-gray-500">2.4 MB • Submitted Mar 15, 2026</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-1" />
                  View Full
                </Button>
              </div>
              <div className="bg-gray-100 rounded p-4 min-h-50 flex items-center justify-center">
                <p className="text-sm text-gray-500">Document preview would render here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Rubric */}
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowRubric(!showRubric)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={StarIcon} className="h-4 w-4 text-yellow-500" />
                Grading Rubric
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {showRubric ? <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" /> : <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {showRubric && (
            <CardContent className="space-y-3">
              {rubricCriteria.map((item, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{item.criteria}</p>
                    <Badge variant="secondary">{item.maxPoints} pts</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                  <Input
                    type="number"
                    placeholder="Score"
                    min={0}
                    max={item.maxPoints}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-bold">{maxScore} pts</span>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Class Stats</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Class Average</span>
              <span className="font-medium">82%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Highest</span>
              <span className="font-medium text-green-600">98%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Lowest</span>
              <span className="font-medium text-red-600">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Graded</span>
              <span className="font-medium">24/30</span>
            </div>
          </CardContent>
        </Card>

        {/* Grade History */}
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowHistory(!showHistory)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
                Grade History
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {showHistory ? <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" /> : <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {showHistory && (
            <CardContent className="space-y-3">
              {gradeHistory.map((item, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-3 py-1">
                  <p className="text-sm text-gray-600">{item.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <Badge variant="secondary">{item.score}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Similar Submissions */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Peer Comparison</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Previous Student', score: 92 },
              { name: 'Another Student', score: 85 },
              { name: 'Third Student', score: 78 },
            ].map((peer, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{peer.name}</span>
                <Badge variant="secondary">{peer.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}