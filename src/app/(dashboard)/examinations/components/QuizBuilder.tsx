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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAssessment, Question, ExamConfiguration } from '@/context/AssessmentContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Copy02Icon, Delete02Icon, PlayIcon, Plus, PreferenceVerticalIcon, SaveIcon, Settings01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import QuestionEditor from './QuestionEditor';
import ExamConfigurator from './ExamConfigurator';
import AntiCheatingSettings from './AntiCheatingSetting';

interface QuizBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizBuilder({ open, onOpenChange }: QuizBuilderProps) {
  const { createDigitalAssessment } = useAssessment();
  const [activeStep, setActiveStep] = useState<'questions' | 'configure' | 'preview'>('questions');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [class_, setClass] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [configuration, setConfiguration] = useState<ExamConfiguration>({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timeLimit: 60,
    randomizeQuestions: false,
    randomizeOptions: false,
    showResults: 'after_due',
    maxAttempts: 1,
    passingScore: 60,
    antiCheating: {
      browserLockdown: false,
      tabSwitchAlert: true,
      fullScreenRequired: false,
      cameraProctoring: false,
      ipTracking: false,
    },
  });

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      question: '',
      options: type === 'multiple-choice' || type === 'true-false' 
        ? type === 'true-false' ? ['True', 'False'] : ['', '', '', '']
        : undefined,
      correctAnswer: '',
      points: type === 'essay' ? 20 : 10,
      order: questions.length + 1,
      difficulty: 'medium',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      const newQuestion = {
        ...question,
        id: Date.now().toString(),
        order: questions.length + 1,
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleSave = () => {
    createDigitalAssessment({
      title,
      description,
      course,
      class: class_,
      type: 'quiz',
      questions,
      configuration,
      status: 'draft',
      totalPoints,
      submissions: 0,
    });
    onOpenChange(false);
  };

  const questionTypes = [
    { type: 'multiple-choice' as const, icon: '🔤', label: 'Multiple Choice' },
    { type: 'true-false' as const, icon: '✓✗', label: 'True/False' },
    { type: 'short-answer' as const, icon: '📝', label: 'Short Answer' },
    { type: 'essay' as const, icon: '📄', label: 'Essay' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] no-scrollbar overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={PlayIcon} className="h-5 w-5" />
            Create Digital Assessment
          </DialogTitle>
          <DialogDescription>
            Build an online quiz with various question types and anti-cheating settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assessment Title</Label>
              <Input
                placeholder="e.g., Computer Science Unit Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select defaultValue="quiz">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the assessment..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Advanced Mathematics">Advanced Mathematics</SelectItem>
                  <SelectItem value="Physics Lab">Physics Lab</SelectItem>
                  <SelectItem value="Statistics">Statistics</SelectItem>
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
                  <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Question Builder */}
          <Tabs value={activeStep} onValueChange={(v) => setActiveStep(v as 'questions' | 'configure' | 'preview')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="questions">
                Questions ({questions.length})
              </TabsTrigger>
              <TabsTrigger value="configure">
                <HugeiconsIcon icon={Settings01Icon} className="h-4 w-4 mr-2" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="preview">
                <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-4 mt-4">
              {/* Question Type Selector */}
              <div className="grid grid-cols-4 gap-2">
                {questionTypes.map(({ type, icon, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => addQuestion(type)}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <HugeiconsIcon icon={PreferenceVerticalIcon} className="h-4 w-4 cursor-move" />
                        <span className="font-medium">{index + 1}.</span>
                      </div>
                      <div className="flex-1">
                        <QuestionEditor
                          question={question}
                          onChange={(updates) => updateQuestion(question.id, updates)}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => duplicateQuestion(question.id)}
                        >
                          <HugeiconsIcon icon={Copy02Icon} className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-12">
                    <HugeiconsIcon icon={Plus} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added</h3>
                    <p className="text-sm text-gray-600">
                      Click on a question type above to start building your assessment
                    </p>
                  </div>
                )}
              </div>

              {/* Total Points */}
              {questions.length > 0 && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    Total Questions: <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Points: <span className="font-medium text-blue-600">{totalPoints}</span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="configure" className="space-y-6 mt-4">
              <ExamConfigurator
                configuration={configuration}
                onChange={setConfiguration}
              />
              <AntiCheatingSettings
                settings={configuration.antiCheating}
                onChange={(antiCheating) =>
                  setConfiguration({ ...configuration, antiCheating })
                }
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              {/* Assessment Preview */}
              <div className="bg-white border rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">{title || 'Untitled Assessment'}</h2>
                  <p className="text-sm text-gray-600 mt-2">{description}</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                    <span>Course: {course}</span>
                    <span>•</span>
                    <span>Class: {class_}</span>
                    <span>•</span>
                    <span>Points: {totalPoints}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div key={q.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{i + 1}.</span>
                          <span className="text-gray-900">{q.question || 'No question text'}</span>
                        </div>
                        <Badge variant="secondary">{q.points} pts</Badge>
                      </div>

                      {q.type === 'multiple-choice' && q.options && (
                        <div className="space-y-2 ml-6">
                          {q.options.map((option, j) => (
                            <label key={j} className="flex items-center gap-2">
                              <input type="radio" name={`q-${q.id}`} disabled />
                              <span className="text-sm text-gray-700">{option || `Option ${j + 1}`}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'true-false' && (
                        <div className="space-y-2 ml-6">
                          <label className="flex items-center gap-2">
                            <input type="radio" name={`q-${q.id}`} disabled />
                            <span className="text-sm text-gray-700">True</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name={`q-${q.id}`} disabled />
                            <span className="text-sm text-gray-700">False</span>
                          </label>
                        </div>
                      )}

                      {q.type === 'short-answer' && (
                        <Input placeholder="Student answer..." disabled className="ml-6" />
                      )}

                      {q.type === 'essay' && (
                        <Textarea placeholder="Student essay response..." disabled className="ml-6" rows={3} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                <HugeiconsIcon icon={SaveIcon} className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={handleSave}>
                <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
                Publish Assessment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}