'use client';

import { useState } from 'react';
import { useAssessment, DigitalAssessment } from '@/context/AssessmentContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlayIcon,
  StopIcon,
  Edit02Icon,
  Delete01Icon,
  MoreVerticalIcon,
  Search01Icon,
  FilterIcon,
  ArrowDown01Icon,
  ViewIcon,
  Copy01Icon,
  UserGroupIcon,
  BookOpen01Icon,
  Calendar03Icon,
  Tick01Icon,
  Alert01Icon,
  Timer02Icon,
  Shield01Icon,
  Award01Icon,
  BrainIcon,
  File02Icon,
  ArrowUpRight01Icon,
  Activity01Icon,
  Layers01Icon,
  RecordIcon,
  ToggleOffIcon,
  Comment01Icon,
  PencilIcon,
  MonitorDot,
  Chart02Icon,
} from '@hugeicons/core-free-icons';

import { format, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';

export default function DigitalAssessmentList() {
  const { digitalAssessments, updateDigitalAssessment, deleteDigitalAssessment } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('grid');
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [publishDialog, setPublishDialog] = useState<string | null>(null);
  const [viewAssessment, setViewAssessment] = useState<DigitalAssessment | null>(null);

  // Get current status based on dates
  const getCurrentStatus = (assessment: DigitalAssessment): DigitalAssessment['status'] => {
    if (assessment.status === 'draft') return 'draft';
    if (assessment.status === 'completed') return 'completed';
    
    const now = new Date();
    const startDate = new Date(`${assessment.configuration.startDate}T${assessment.configuration.startTime}`);
    const endDate = new Date(`${assessment.configuration.endDate}T${assessment.configuration.endTime}`);

    if (isBefore(now, startDate)) return 'published';
    if (isWithinInterval(now, { start: startDate, end: endDate })) return 'ongoing';
    if (isAfter(now, endDate)) return 'completed';
    
    return assessment.status;
  };

  // Filter assessments
  const filteredAssessments = digitalAssessments
    .filter(assessment => {
      const currentStatus = getCurrentStatus(assessment);
      if (statusFilter !== 'all') return currentStatus === statusFilter;
      return true;
    })
    .filter(assessment => {
      if (typeFilter !== 'all') return assessment.type === typeFilter;
      return true;
    })
    .filter(assessment => {
      if (courseFilter !== 'all') return assessment.course === courseFilter;
      return true;
    })
    .filter(assessment =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get unique courses
  const courses = Array.from(new Set(digitalAssessments.map(a => a.course)));

  // Type configurations
  const typeConfig = {
    quiz: {
      icon: BrainIcon,
      label: 'Quiz',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      gradient: 'from-blue-500 to-blue-600',
    },
    test: {
      icon: File02Icon,
      label: 'Test',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
    },
    exam: {
      icon: Award01Icon,
      label: 'Exam',
      color: 'text-red-600',
      bg: 'bg-red-50',
      gradient: 'from-red-500 to-red-600',
    },
  };

  // Status configurations
  const statusConfig = {
    draft: {
      icon: Edit02Icon,
      label: 'Draft',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-400',
    },
    published: {
      icon: Tick01Icon,
      label: 'Published',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      dot: 'bg-blue-400',
    },
    ongoing: {
      icon: PlayIcon,
      label: 'Live Now',
      className: 'bg-green-100 text-green-700 border-green-200',
      dot: 'bg-green-500 animate-pulse',
    },
    completed: {
      icon: Award01Icon,
      label: 'Completed',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      dot: 'bg-purple-400',
    },
  };

  // Question type icons
  const questionTypeIcons: Record<string, React.ReactNode> = {
    'multiple-choice': <HugeiconsIcon icon={RecordIcon} className="h-3 w-3" />,
    'true-false': <HugeiconsIcon icon={ToggleOffIcon} className="h-3 w-3" />,
    'short-answer': <HugeiconsIcon icon={Comment01Icon} className="h-3 w-3" />,
    'essay': <HugeiconsIcon icon={PencilIcon} className="h-3 w-3" />,
  };

  // Get question type distribution
  const getQuestionDistribution = (assessment: DigitalAssessment) => {
    const distribution: Record<string, number> = {};
    assessment.questions.forEach(q => {
      distribution[q.type] = (distribution[q.type] || 0) + 1;
    });
    return distribution;
  };

  const handleDelete = (id: string) => {
    deleteDigitalAssessment(id);
    setDeleteDialog(null);
    toast.success('Assessment deleted successfully');
  };

  const handlePublish = (id: string) => {
    updateDigitalAssessment(id, { status: 'published' });
    setPublishDialog(null);
    toast.success('Assessment published successfully! Students have been notified.');
  };

  const handleDuplicate = (assessment: DigitalAssessment) => {
    toast.success('Assessment duplicated successfully');
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAntiCheatingLevel = (assessment: DigitalAssessment) => {
    const ac = assessment.configuration.antiCheating;
    const activeCount = Object.values(ac).filter(Boolean).length;
    if (activeCount >= 4) return { label: 'Maximum', color: 'text-red-600', bg: 'bg-red-50' };
    if (activeCount >= 2) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Basic', color: 'text-green-600', bg: 'bg-green-50' };
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search Section */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <HugeiconsIcon icon={FilterIcon} className="h-4 w-4 mr-2" />
                    {typeFilter === 'all' ? 'All Types' : typeConfig[typeFilter as keyof typeof typeConfig]?.label}
                  </div>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Assessment Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4 mr-2" />
                  All Types
                </DropdownMenuItem>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <DropdownMenuItem key={key} onClick={() => setTypeFilter(key)}>
                    <HugeiconsIcon icon={config.icon} className={`h-4 w-4 mr-2 ${config.color}`} />
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <HugeiconsIcon icon={Activity01Icon} className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                  </div>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                    <HugeiconsIcon icon={config.icon} className="h-4 w-4 mr-2" />
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Course Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <HugeiconsIcon icon={BookOpen01Icon} className="h-4 w-4 mr-2" />
                    {courseFilter === 'all' ? 'All Courses' : courseFilter}
                  </div>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Course</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCourseFilter('all')}>
                  All Courses
                </DropdownMenuItem>
                {courses.map(course => (
                  <DropdownMenuItem key={course} onClick={() => setCourseFilter(course)}>
                    <HugeiconsIcon icon={BookOpen01Icon} className="h-4 w-4 mr-2" />
                    {course}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {(typeFilter !== 'all' || statusFilter !== 'all' || courseFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setTypeFilter('all')}>
                  {typeConfig[typeFilter as keyof typeof typeConfig]?.label} ✕
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('all')}>
                  {statusConfig[statusFilter as keyof typeof statusConfig]?.label} ✕
                </Badge>
              )}
              {courseFilter !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setCourseFilter('all')}>
                  {courseFilter} ✕
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Toggle & Stats */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={MonitorDot} className="h-4 w-4" />
            {filteredAssessments.length} assessments
          </span>
        </div>
      </div>

      {/* Assessments Display */}
      {filteredAssessments.length > 0 ? (
        <>
          {activeTab === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment) => {
                const TypeIcon = typeConfig[assessment.type]?.icon || MonitorDot;
                const currentStatus = getCurrentStatus(assessment);
                const StatusIcon = statusConfig[currentStatus]?.icon || Edit02Icon;
                const antiCheating = getAntiCheatingLevel(assessment);
                const questionDistribution = getQuestionDistribution(assessment);

                return (
                  <Card
                    key={assessment.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Header with Gradient */}
                    <div className={`relative h-2 bg-linear-to-r ${typeConfig[assessment.type]?.gradient || 'from-gray-500 to-gray-600'}`} />

                    <CardContent className="p-6">
                      {/* Status & Type Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={typeConfig[assessment.type]?.bg}>
                            <HugeiconsIcon icon={TypeIcon} className="h-3 w-3 mr-1" />
                            {typeConfig[assessment.type]?.label}
                          </Badge>
                          <Badge className={statusConfig[currentStatus]?.className}>
                            <div className={`w-2 h-2 rounded-full ${statusConfig[currentStatus]?.dot} mr-1`} />
                            {statusConfig[currentStatus]?.label}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setViewAssessment(assessment)}>
                              <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2" />
                              Edit Assessment
                            </DropdownMenuItem>
                            {currentStatus === 'draft' && (
                              <DropdownMenuItem onClick={() => setPublishDialog(assessment.id)}>
                                <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2 text-green-600" />
                                Publish Now
                              </DropdownMenuItem>
                            )}
                            {currentStatus === 'ongoing' && (
                              <DropdownMenuItem>
                                <HugeiconsIcon icon={StopIcon} className="h-4 w-4 mr-2 text-red-600" />
                                End Now
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDuplicate(assessment)}>
                              <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteDialog(assessment.id)}
                            >
                              <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Title & Description */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assessment.description}</p>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <HugeiconsIcon icon={BookOpen01Icon} className="h-4 w-4 shrink-0" />
                          <span className="truncate">{assessment.course} • {assessment.class}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4 shrink-0" />
                          <span>
                            {format(new Date(assessment.configuration.startDate), 'MMM dd, yyyy')}
                            {' • '}
                            {assessment.configuration.startTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <HugeiconsIcon icon={Timer02Icon} className="h-4 w-4 shrink-0" />
                          <span>{assessment.configuration.timeLimit} min</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Questions Overview */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">Questions</span>
                          <span className="text-xs text-gray-500">{assessment.questions.length} total</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(questionDistribution).map(([type, count]) => (
                            <TooltipProvider key={type}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="cursor-help">
                                    {questionTypeIcons[type]}
                                    <span className="ml-1">{count}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {count} {type.replace('-', ' ')} question{count > 1 ? 's' : ''}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Bottom Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{assessment.totalPoints}</p>
                          <p className="text-xs text-gray-500">Points</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {assessment.configuration.maxAttempts}
                          </p>
                          <p className="text-xs text-gray-500">Attempts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {assessment.configuration.passingScore}%
                          </p>
                          <p className="text-xs text-gray-500">Passing</p>
                        </div>
                      </div>

                      {/* Anti-Cheating Level */}
                      <div className={`mt-4 ${antiCheating.bg} rounded-lg p-2 flex items-center justify-between`}>
                        <div className="flex items-center gap-1.5 text-xs">
                          <HugeiconsIcon icon={Shield01Icon} className={`h-3 w-3 ${antiCheating.color}`} />
                          <span className={`font-medium ${antiCheating.color}`}>
                            {antiCheating.label} Security
                          </span>
                        </div>
                        <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3 w-3 text-gray-400" />
                      </div>

                      {/* Quick Action Button */}
                      {currentStatus === 'ongoing' && (
                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                          <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                          Monitor Live
                        </Button>
                      )}
                      {currentStatus === 'published' && (
                        <Button className="w-full mt-4">
                          <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
                          Start Now
                        </Button>
                      )}
                      {currentStatus === 'completed' && (
                        <Button className="w-full mt-4" variant="outline">
                          <HugeiconsIcon icon={Chart02Icon} className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* List View */
            <Card>
              <div className="divide-y divide-gray-100">
                {filteredAssessments.map((assessment) => {
                  const currentStatus = getCurrentStatus(assessment);

                  return (
                    <div
                      key={assessment.id}
                      className="p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Type Icon */}
                        <div className={`p-2 rounded-lg ${typeConfig[assessment.type]?.bg} shrink-0`}>
                          <HugeiconsIcon 
                            icon={typeConfig[assessment.type]?.icon || MonitorDot}
                            className={`h-5 w-5 ${typeConfig[assessment.type]?.color}`} 
                          />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {assessment.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <HugeiconsIcon icon={BookOpen01Icon} className="h-3 w-3" />
                                  {assessment.course}
                                </span>
                                <span className="flex items-center gap-1">
                                  <HugeiconsIcon icon={UserGroupIcon} className="h-3 w-3" />
                                  {assessment.class}
                                </span>
                                <span className="flex items-center gap-1">
                                  <HugeiconsIcon icon={Calendar03Icon} className="h-3 w-3" />
                                  {format(new Date(assessment.configuration.startDate), 'MMM dd')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusConfig[currentStatus]?.className}>
                                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[currentStatus]?.dot} mr-1`} />
                                {statusConfig[currentStatus]?.label}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setViewAssessment(assessment)}>
                                    <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicate(assessment)}>
                                    <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setDeleteDialog(assessment.id)}
                                  >
                                    <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* List View Stats */}
                          <div className="grid grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Questions</p>
                              <p className="text-sm font-medium">{assessment.questions.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Points</p>
                              <p className="text-sm font-medium">{assessment.totalPoints}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Time Limit</p>
                              <p className="text-sm font-medium">{assessment.configuration.timeLimit} min</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Security</p>
                              <p className="text-sm font-medium">
                                {getAntiCheatingLevel(assessment).label}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      ) : (
        /* Empty State */
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <HugeiconsIcon icon={MonitorDot} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Digital Assessments Found</h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || courseFilter !== 'all'
                ? 'No assessments match your current filters. Try adjusting your search criteria.'
                : 'Create your first online quiz or test with various question types and automated grading.'}
            </p>
            {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && courseFilter === 'all' && (
              <Button>
                <HugeiconsIcon icon={MonitorDot} className="h-4 w-4 mr-2" />
                Create First Assessment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {filteredAssessments.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-medium text-gray-900">{filteredAssessments.length}</span> of{' '}
              <span className="font-medium text-gray-900">{digitalAssessments.length}</span> assessments
            </span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <HugeiconsIcon icon={BrainIcon} className="h-3 w-3 mr-1" />
                {digitalAssessments.filter(a => a.type === 'quiz').length} Quizzes
              </Badge>
              <Badge variant="secondary">
                <HugeiconsIcon icon={File02Icon} className="h-3 w-3 mr-1" />
                {digitalAssessments.filter(a => a.type === 'test').length} Tests
              </Badge>
              <Badge variant="secondary">
                <HugeiconsIcon icon={Award01Icon} className="h-3 w-3 mr-1" />
                {digitalAssessments.filter(a => a.type === 'exam').length} Exams
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <HugeiconsIcon icon={Chart02Icon} className="h-4 w-4 mr-1" />
              Analytics
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Alert01Icon} className="h-5 w-5 text-red-500" />
              Delete Assessment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this digital assessment? This will remove all questions, 
              configurations, and student submissions permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4 mr-2" />
              Delete Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog open={!!publishDialog} onOpenChange={() => setPublishDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={PlayIcon} className="h-5 w-5 text-green-600" />
              Publish Assessment
            </DialogTitle>
            <DialogDescription>
              Publishing will make this assessment available to students according to the configured 
              schedule. Students will receive notifications based on your settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {publishDialog && (() => {
              const assessment = digitalAssessments.find(a => a.id === publishDialog);
              if (!assessment) return null;
              const securityLevel = getAntiCheatingLevel(assessment);
              
              return (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Questions</span>
                    <span className="text-sm font-medium">{assessment.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Points</span>
                    <span className="text-sm font-medium">{assessment.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Limit</span>
                    <span className="text-sm font-medium">{assessment.configuration.timeLimit} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Security Level</span>
                    <Badge className={securityLevel.bg}>
                      <HugeiconsIcon icon={Shield01Icon} className={`h-3 w-3 mr-1 ${securityLevel.color}`} />
                      {securityLevel.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Schedule</span>
                    <span className="text-sm font-medium">
                      {format(new Date(assessment.configuration.startDate), 'MMM dd, yyyy')} at {assessment.configuration.startTime}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialog(null)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => publishDialog && handlePublish(publishDialog)}
            >
              <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
              Publish Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Assessment Details Dialog */}
      <Dialog open={!!viewAssessment} onOpenChange={() => setViewAssessment(null)}>
        {viewAssessment && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={MonitorDot} className="h-5 w-5" />
                Assessment Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">{viewAssessment.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{viewAssessment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course</label>
                  <p className="text-sm text-gray-900">{viewAssessment.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Class</label>
                  <p className="text-sm text-gray-900">{viewAssessment.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Schedule</label>
                  <p className="text-sm text-gray-900">
                    {format(new Date(viewAssessment.configuration.startDate), 'MMM dd, yyyy')}
                    {' '}{viewAssessment.configuration.startTime} - {viewAssessment.configuration.endTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time Limit</label>
                  <p className="text-sm text-gray-900">{viewAssessment.configuration.timeLimit} minutes</p>
                </div>
              </div>

              <Separator />

              {/* Questions Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Questions ({viewAssessment.questions.length})
                </h4>
                <div className="space-y-2">
                  {viewAssessment.questions.map((q, i) => (
                    <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{i + 1}.</span>
                        <Badge variant="outline">
                          {questionTypeIcons[q.type]}
                          <span className="ml-1 text-xs">{q.type.replace('-', ' ')}</span>
                        </Badge>
                        <span className="text-sm text-gray-900 truncate max-w-md">{q.question}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getDifficultyColor(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                        <span className="text-sm font-medium">{q.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Configuration Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Randomize Questions</span>
                      <Badge variant={viewAssessment.configuration.randomizeQuestions ? 'default' : 'secondary'}>
                        {viewAssessment.configuration.randomizeQuestions ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Randomize Options</span>
                      <Badge variant={viewAssessment.configuration.randomizeOptions ? 'default' : 'secondary'}>
                        {viewAssessment.configuration.randomizeOptions ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Attempts</span>
                      <span className="font-medium">{viewAssessment.configuration.maxAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passing Score</span>
                      <span className="font-medium">{viewAssessment.configuration.passingScore}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Browser Lockdown</span>
                      <Badge variant={viewAssessment.configuration.antiCheating.browserLockdown ? 'default' : 'secondary'}>
                        {viewAssessment.configuration.antiCheating.browserLockdown ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tab Switch Alert</span>
                      <Badge variant={viewAssessment.configuration.antiCheating.tabSwitchAlert ? 'default' : 'secondary'}>
                        {viewAssessment.configuration.antiCheating.tabSwitchAlert ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Screen Required</span>
                      <Badge variant={viewAssessment.configuration.antiCheating.fullScreenRequired ? 'default' : 'secondary'}>
                        {viewAssessment.configuration.antiCheating.fullScreenRequired ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Camera Proctoring</span>
                      <Badge variant={viewAssessment.configuration.antiCheating.cameraProctoring ? 'default' : 'secondary'}>
                        {viewAssessment.configuration.antiCheating.cameraProctoring ? 'On' : 'Off'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewAssessment(null)}>
                Close
              </Button>
              {viewAssessment.status === 'draft' && (
                <Button onClick={() => {
                  setViewAssessment(null);
                  setPublishDialog(viewAssessment.id);
                }}>
                  <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}