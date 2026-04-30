'use client';

import React, { useState } from 'react';
import { useAssessment, Assignment } from '@/context/AssessmentContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Hugeicons Imports
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Note01Icon,
  Edit02Icon,
  Delete02Icon,
  MoreVerticalIcon,
  Search01Icon,
  FilterIcon,
  ArrowDown01Icon,
  ViewIcon,
  Copy01Icon,
  Download01Icon,
  Time02Icon,
  UserGroupIcon,
  BookOpen01Icon,
  Calendar03Icon,
  Alert01Icon,
  Alert02Icon,
  UnavailableIcon,
  File02Icon,
  StarIcon,
  Target01Icon,
  PercentIcon,
  Task01Icon,
  Layers01Icon,
  SentIcon,
  Refresh01Icon,
  Attachment01Icon,
  CheckmarkCircle04Icon,
  Chart01Icon,
  Plus,
  SquareUnlock02Icon
} from '@hugeicons/core-free-icons';

import { format, isAfter, isBefore, differenceInDays, addDays } from 'date-fns';
import { toast } from 'sonner';

export default function AssignmentList() {
  const { assignments, updateAssignment, deleteAssignment } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('grid');
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [closeDialog, setCloseDialog] = useState<string | null>(null);
  const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null);

  // Get current status based on due date
  const getCurrentStatus = (assignment: Assignment): Assignment['status'] | 'overdue' => {
    if (assignment.status === 'draft') return 'draft';
    if (assignment.status === 'closed') return 'closed';
    
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (isAfter(now, dueDate)) {
      if (assignment.lateSubmissionPolicy.allowLate) {
        const extensionDate = assignment.lateSubmissionPolicy.deadlineExtension 
          ? new Date(assignment.lateSubmissionPolicy.deadlineExtension)
          : addDays(dueDate, 7);
        if (isAfter(now, extensionDate)) return 'closed';
        return 'overdue';
      }
      return 'closed';
    }
    
    return assignment.status;
  };

  // Filter assignments
  const filteredAssignments = assignments
    .filter(assignment => {
      const currentStatus = getCurrentStatus(assignment);
      if (statusFilter !== 'all') return currentStatus === statusFilter;
      return true;
    })
    .filter(assignment => {
      if (courseFilter !== 'all') return assignment.course === courseFilter;
      return true;
    })
    .filter(assignment =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get unique courses
  const courses = Array.from(new Set(assignments.map(a => a.course)));

  // Status configurations
  const statusConfig = {
    draft: {
      icon: Edit02Icon,
      label: 'Draft',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-400',
      color: 'text-gray-600',
    },
    published: {
      icon: SentIcon,
      label: 'Published',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      dot: 'bg-blue-400',
      color: 'text-blue-600',
    },
    overdue: {
      icon: Alert02Icon,
      label: 'Overdue',
      className: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500 animate-pulse',
      color: 'text-red-600',
    },
    closed: {
      icon: UnavailableIcon,
      label: 'Closed',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-500',
      color: 'text-gray-600',
    },
  };

  const handleDelete = (id: string) => {
    deleteAssignment(id);
    setDeleteDialog(null);
    toast.success('Assignment deleted successfully');
  };

  const handleClose = (id: string) => {
    updateAssignment(id, { status: 'closed' });
    setCloseDialog(null);
    toast.success('Assignment closed successfully');
  };

  const handleDuplicate = (assignment: Assignment) => {
    toast.success('Assignment duplicated successfully');
  };

  const handleReopen = (id: string) => {
    updateAssignment(id, { 
      status: 'published',
      dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    });
    toast.success('Assignment reopened with extended deadline');
  };

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const days = differenceInDays(due, now);
    
    if (days < 0) return { days: Math.abs(days), label: 'days ago', urgent: true };
    if (days === 0) return { days: 0, label: 'Today', urgent: true };
    if (days === 1) return { days: 1, label: 'Tomorrow', urgent: false };
    if (days <= 3) return { days, label: 'days left', urgent: true };
    return { days, label: 'days left', urgent: false };
  };

  const getSubmissionProgress = (assignment: Assignment) => {
    const totalStudents = 30; // This should come from actual class data
    const submitted = assignment.submissions || 0;
    return {
      percentage: Math.round((submitted / totalStudents) * 100),
      submitted,
      total: totalStudents,
    };
  };

  const getLatePenaltyInfo = (assignment: Assignment) => {
    if (!assignment.lateSubmissionPolicy.allowLate) {
      return { label: 'No late submissions', icon: UnavailableIcon, color: 'text-red-600' };
    }
    const penalty = assignment.lateSubmissionPolicy.penaltyPercentage;
    if (penalty === 0) {
      return { label: 'No penalty', icon: CheckmarkCircle04Icon, color: 'text-green-600' };
    }
    return { 
      label: `${penalty}% penalty per day`, 
      icon: PercentIcon, 
      color: 'text-yellow-600' 
    };
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
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <HugeiconsIcon icon={FilterIcon} className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                  </div>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4 mr-2" />
                  All Status
                </DropdownMenuItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                    <HugeiconsIcon icon={config.icon} className={`h-4 w-4 mr-2 ${config.color}`} />
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

            {/* Quick Stats */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2 px-3">
              <HugeiconsIcon icon={Note01Icon} className="h-4 w-4" />
              <span>{assignments.length} total</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-green-600 font-medium">
                {assignments.filter(a => getCurrentStatus(a) === 'published').length} active
              </span>
            </div>
          </div>

          {/* Active Filters */}
          {(statusFilter !== 'all' || courseFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
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

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="grid">
              <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4 mr-2" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list">
              <HugeiconsIcon icon={Task01Icon} className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Chart01Icon} className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Assignments Display */}
      {filteredAssignments.length > 0 ? (
        <>
          {activeTab === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => {
                const currentStatus = getCurrentStatus(assignment);
                const daysInfo = getDaysRemaining(assignment.dueDate);
                const submissionProgress = getSubmissionProgress(assignment);
                const latePenalty = getLatePenaltyInfo(assignment);
                const isOverdue = currentStatus === 'overdue';
                const isClosed = currentStatus === 'closed';

                return (
                  <Card
                    key={assignment.id}
                    className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden ${
                      isOverdue ? 'border-red-300' : isClosed ? 'opacity-75' : ''
                    }`}
                  >
                    {/* Status Header Bar */}
                    <div className={`h-1.5 ${
                      currentStatus === 'published' ? 'bg-linear-to-r from-blue-500 to-blue-600' :
                      currentStatus === 'overdue' ? 'bg-linear-to-r from-red-500 to-red-600' :
                      currentStatus === 'closed' ? 'bg-gray-300' :
                      'bg-linear-to-r from-gray-400 to-gray-500'
                    }`} />

                    <CardContent className="p-6">
                      {/* Status & Action Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[currentStatus]?.className}>
                            <div className={`w-2 h-2 rounded-full ${statusConfig[currentStatus]?.dot} mr-1`} />
                            {statusConfig[currentStatus]?.label}
                          </Badge>
                          {isOverdue && assignment.lateSubmissionPolicy.allowLate && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              <HugeiconsIcon icon={Time02Icon} className="h-3 w-3 mr-1" />
                              Late Accepted
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setViewAssignment(assignment)}>
                              <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2" />
                              Edit Assignment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(assignment)}>
                              <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            {currentStatus === 'published' && (
                              <DropdownMenuItem>
                                <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4 mr-2" />
                                View Submissions
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {currentStatus === 'published' || currentStatus === 'overdue' ? (
                              <DropdownMenuItem onClick={() => setCloseDialog(assignment.id)}>
                                <HugeiconsIcon icon={UnavailableIcon} className="h-4 w-4 mr-2" />
                                Close Submissions
                              </DropdownMenuItem>
                            ) : currentStatus === 'closed' && (
                              <DropdownMenuItem onClick={() => handleReopen(assignment.id)}>
                                <HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4 mr-2" />
                                Reopen Assignment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteDialog(assignment.id)}
                            >
                              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Title & Description */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <HugeiconsIcon icon={BookOpen01Icon} className="h-4 w-4 shrink-0" />
                          <span className="truncate">{assignment.course} • {assignment.class}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4 shrink-0" />
                          <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                            Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Time02Icon} className="h-4 w-4 shrink-0" />
                          <span className={`font-medium ${
                            daysInfo.urgent ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {daysInfo.days} {daysInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Target01Icon} className="h-4 w-4 shrink-0" />
                          <span className="text-gray-600">{assignment.totalPoints} points</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Submission Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Submissions</span>
                          <span className="font-medium">
                            {submissionProgress.submitted}/{submissionProgress.total}
                          </span>
                        </div>
                        <Progress value={submissionProgress.percentage} />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{submissionProgress.percentage}% submitted</span>
                          <span>{submissionProgress.total - submissionProgress.submitted} pending</span>
                        </div>
                      </div>

                      {/* Rubric & Attachments */}
                      <div className="flex items-center gap-3 mt-4 text-xs text-gray-600">
                        {assignment.rubric.length > 0 && (
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={StarIcon} className="h-3 w-3" />
                            <span>{assignment.rubric.length} criteria</span>
                          </div>
                        )}
                        {assignment.attachments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={Attachment01Icon} className="h-3 w-3" />
                            <span>{assignment.attachments.length} files</span>
                          </div>
                        )}
                      </div>

                      {/* Late Submission Policy */}
                      <div className={`mt-4 rounded-lg p-2 flex items-center gap-2 text-xs ${
                        assignment.lateSubmissionPolicy.allowLate 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <HugeiconsIcon icon={latePenalty.icon} className={`h-3 w-3 ${latePenalty.color}`} />
                        <span className={latePenalty.color}>{latePenalty.label}</span>
                      </div>

                      {/* Quick Action Button */}
                      {currentStatus === 'published' && (
                        <Button className="w-full mt-4">
                          <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                          View Submissions
                        </Button>
                      )}
                      {currentStatus === 'overdue' && assignment.lateSubmissionPolicy.allowLate && (
                        <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">
                          <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4 mr-2" />
                          Review Late Submissions
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
                {filteredAssignments.map((assignment) => {
                  const currentStatus = getCurrentStatus(assignment);
                  const daysInfo = getDaysRemaining(assignment.dueDate);
                  const submissionProgress = getSubmissionProgress(assignment);

                  return (
                    <div
                      key={assignment.id}
                      className="p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className={`shrink-0 w-2 h-2 rounded-full ${
                          statusConfig[currentStatus]?.dot || 'bg-gray-400'
                        }`} />

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {assignment.title}
                                </h3>
                                <Badge className={statusConfig[currentStatus]?.className}>
                                  {statusConfig[currentStatus]?.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <HugeiconsIcon icon={BookOpen01Icon} className="h-3 w-3" />
                                  {assignment.course}
                                </span>
                                <span className="flex items-center gap-1">
                                  <HugeiconsIcon icon={UserGroupIcon} className="h-3 w-3" />
                                  {assignment.class}
                                </span>
                                <span className="flex items-center gap-1">
                                  <HugeiconsIcon icon={Calendar03Icon} className="h-3 w-3" />
                                  {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                                </span>
                                <span className={`flex items-center gap-1 font-medium ${
                                  daysInfo.urgent ? 'text-red-600' : ''
                                }`}>
                                  <HugeiconsIcon icon={Time02Icon} className="h-3 w-3" />
                                  {daysInfo.days}d {daysInfo.label}
                                </span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setViewAssignment(assignment)}>
                                  <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicate(assignment)}>
                                  <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* List View Stats */}
                          <div className="grid grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Points</p>
                              <p className="text-sm font-medium">{assignment.totalPoints}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Submissions</p>
                              <p className="text-sm font-medium">
                                {submissionProgress.submitted}/{submissionProgress.total}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Late Policy</p>
                              <p className="text-sm font-medium">
                                {assignment.lateSubmissionPolicy.allowLate ? 'Accepted' : 'Not Accepted'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Rubric</p>
                              <p className="text-sm font-medium">
                                {assignment.rubric.length} criteria
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Completion</span>
                              <span>{submissionProgress.percentage}%</span>
                            </div>
                            <Progress value={submissionProgress.percentage} className="h-1.5" />
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
              <HugeiconsIcon icon={Note01Icon} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Found</h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
                ? 'No assignments match your current filters. Try adjusting your search criteria.'
                : 'Create homework tasks with grading rubrics, due dates, and submission policies.'}
            </p>
            {!searchTerm && statusFilter === 'all' && courseFilter === 'all' && (
              <Button>
                <HugeiconsIcon icon={Plus} className="h-4 w-4 mr-2" />
                Create First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {filteredAssignments.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-medium text-gray-900">{filteredAssignments.length}</span> of{' '}
              <span className="font-medium text-gray-900">{assignments.length}</span> assignments
            </span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('published')}>
                <HugeiconsIcon icon={SentIcon} className="h-3 w-3 mr-1" />
                {assignments.filter(a => getCurrentStatus(a) === 'published').length} Active
              </Badge>
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('overdue')}>
                <HugeiconsIcon icon={Alert02Icon} className="h-3 w-3 mr-1" />
                {assignments.filter(a => getCurrentStatus(a) === 'overdue').length} Overdue
              </Badge>
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('closed')}>
                <HugeiconsIcon icon={UnavailableIcon} className="h-3 w-3 mr-1" />
                {assignments.filter(a => getCurrentStatus(a) === 'closed').length} Closed
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-1" />
              Export All
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
              Delete Assignment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assignment? This will permanently remove 
              the assignment, rubric, and all student submissions.
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
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 mr-2" />
              Delete Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Submissions Dialog */}
      <Dialog open={!!closeDialog} onOpenChange={() => setCloseDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={UnavailableIcon} className="h-5 w-5 text-orange-500" />
              Close Submissions
            </DialogTitle>
            <DialogDescription>
              This will prevent students from submitting new work. Late submissions 
              will no longer be accepted after closing.
            </DialogDescription>
          </DialogHeader>
          {closeDialog && (() => {
            const assignment = assignments.find(a => a.id === closeDialog);
            if (!assignment) return null;
            const progress = getSubmissionProgress(assignment);
            
            return (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Submissions</span>
                  <span className="text-sm font-medium">{progress.submitted}/{progress.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Submissions</span>
                  <span className="text-sm font-medium text-red-600">
                    {progress.total - progress.submitted} students
                  </span>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => closeDialog && handleClose(closeDialog)}
            >
              <HugeiconsIcon icon={UnavailableIcon} className="h-4 w-4 mr-2" />
              Close Submissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Assignment Details Dialog */}
      <Dialog open={!!viewAssignment} onOpenChange={() => setViewAssignment(null)}>
        {viewAssignment && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Note01Icon} className="h-5 w-5" />
                Assignment Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">{viewAssignment.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{viewAssignment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course</label>
                  <p className="text-sm text-gray-900">{viewAssignment.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Class</label>
                  <p className="text-sm text-gray-900">{viewAssignment.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">
                    {format(new Date(viewAssignment.dueDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Points</label>
                  <p className="text-sm text-gray-900">{viewAssignment.totalPoints}</p>
                </div>
              </div>

              {/* Late Policy */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Late Submission Policy</h4>
                <div className={`rounded-lg p-4 ${
                  viewAssignment.lateSubmissionPolicy.allowLate 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {viewAssignment.lateSubmissionPolicy.allowLate ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={SquareUnlock02Icon} className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Late Submissions Accepted</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Penalty: {viewAssignment.lateSubmissionPolicy.penaltyPercentage}% deduction per day
                      </p>
                      {viewAssignment.lateSubmissionPolicy.deadlineExtension && (
                        <p className="text-sm text-yellow-700">
                          Extended deadline: {format(new Date(viewAssignment.lateSubmissionPolicy.deadlineExtension), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={SquareUnlock02Icon} className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Late Submissions Not Accepted</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rubric */}
              {viewAssignment.rubric.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Grading Rubric ({viewAssignment.rubric.length} criteria)
                  </h4>
                  <div className="space-y-2">
                    {viewAssignment.rubric.map((criteria) => (
                      <div key={criteria.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <HugeiconsIcon icon={StarIcon} className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{criteria.criteria}</p>
                            <Badge variant="secondary">{criteria.maxPoints} pts</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{criteria.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {criteria.levels.map((level, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {level.label}: {level.points}pts
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {viewAssignment.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Attachments ({viewAssignment.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {viewAssignment.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <HugeiconsIcon icon={File02Icon} className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submissions Summary */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Submission Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const progress = getSubmissionProgress(viewAssignment);
                    return (
                      <>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{progress.submitted}</p>
                          <p className="text-xs text-blue-700">Submitted</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">
                            {progress.total - progress.submitted}
                          </p>
                          <p className="text-xs text-yellow-700">Pending</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{progress.percentage}%</p>
                          <p className="text-xs text-green-700">Completion</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewAssignment(null)}>
                Close
              </Button>
              <Button>
                <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                View Submissions
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}