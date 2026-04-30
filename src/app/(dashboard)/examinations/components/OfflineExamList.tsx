'use client';

import React, { useState } from 'react';
import { useAssessment, OfflineExam } from '@/context/AssessmentContext';
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
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  FilterIcon,
  ArrowDown01Icon,
  BookOpen01Icon,
  File01Icon,
  Download01Icon,
  ViewIcon,
  MoreVerticalIcon,
  Delete01Icon,
  Share01Icon,
  Copy01Icon,
  PrinterIcon,
  Edit02Icon,
  Tick01Icon,
  Archive02Icon,
  Alert01Icon,
  Upload01Icon,
  Time04Icon,
  UserGroupIcon,
  Calendar03Icon,
  SchoolIcon,
  Presentation01Icon,
  File02Icon,
  LockKeyIcon,
  Chart01Icon,
  Mortarboard02Icon
} from '@hugeicons/core-free-icons';

import { format } from 'date-fns';
import { toast } from 'sonner';

export default function OfflineExamList() {
  const { offlineExams, updateOfflineExam, deleteOfflineExam } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [viewExam, setViewExam] = useState<OfflineExam | null>(null);

  // Filter exams
  const filteredExams = offlineExams
    .filter(exam => {
      if (typeFilter !== 'all') return exam.type === typeFilter;
      return true;
    })
    .filter(exam => {
      if (statusFilter !== 'all') return exam.status === statusFilter;
      return true;
    })
    .filter(exam => {
      if (courseFilter !== 'all') return exam.course === courseFilter;
      return true;
    })
    .filter(exam =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get unique courses for filter
  const courses = Array.from(new Set(offlineExams.map(exam => exam.course)));

  // Exam type configurations using raw Hugeicons data
  const typeConfig = {
    final: {
      icon: Mortarboard02Icon,
      label: 'Final Exam',
      color: 'text-red-600',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700',
    },
    midterm: {
      icon: SchoolIcon,
      label: 'Midterm',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-700',
    },
    quiz: {
      icon: Presentation01Icon,
      label: 'Quiz',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
    },
    worksheet: {
      icon: File02Icon,
      label: 'Worksheet',
      color: 'text-green-600',
      bg: 'bg-green-50',
      badge: 'bg-green-100 text-green-700',
    },
  };

  // Status badge configurations using raw Hugeicons data
  const statusConfig = {
    draft: {
      icon: Edit02Icon,
      label: 'Draft',
      className: 'bg-gray-100 text-gray-700',
    },
    published: {
      icon: Tick01Icon,
      label: 'Published',
      className: 'bg-green-100 text-green-700',
    },
    archived: {
      icon: Archive02Icon,
      label: 'Archived',
      className: 'bg-yellow-100 text-yellow-700',
    },
  };

  const handleDelete = (id: string) => {
    deleteOfflineExam(id);
    setDeleteDialog(null);
    toast.success('Exam deleted successfully');
  };

  const handleStatusChange = (id: string, status: OfflineExam['status']) => {
    updateOfflineExam(id, { status });
    toast.success(`Exam status updated to ${status}`);
  };

  const handleDuplicate = (exam: OfflineExam) => {
    toast.success('Exam duplicated successfully');
  };

  const copyDownloadLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Download link copied to clipboard');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <HugeiconsIcon icon={File01Icon} className="h-10 w-10 text-red-500" />;
    if (fileType.includes('doc')) return <HugeiconsIcon icon={File01Icon} className="h-10 w-10 text-blue-500" />;
    return <HugeiconsIcon icon={File01Icon} className="h-10 w-10 text-gray-500" />;
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
                placeholder="Search exams..."
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
                <DropdownMenuLabel>Exam Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  <HugeiconsIcon icon={FilterIcon} className="h-4 w-4 mr-2" />
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

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const TypeIcon = typeConfig[exam.type].icon;
            const StatusIcon = statusConfig[exam.status].icon;

            return (
              <Card
                key={exam.id}
                className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                {/* Card Header with File Preview */}
                <div className="relative">
                  <div className={`h-40 ${typeConfig[exam.type].bg} rounded-t-xl flex items-center justify-center`}>
                    <div className="text-center">
                      {getFileIcon(exam.fileType)}
                      <p className="text-xs font-medium text-gray-600 mt-2 uppercase">
                        {exam.fileType.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                              onClick={() => window.open(exam.fileUrl)}
                            >
                              <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                              onClick={() => window.open(exam.fileUrl)}
                            >
                              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                          >
                            <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setViewExam(exam)}>
                            <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(exam.fileUrl)}>
                            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
                            Download File
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyDownloadLink(exam.fileUrl)}>
                            <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(exam)}>
                            <HugeiconsIcon icon={Share01Icon} className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HugeiconsIcon icon={PrinterIcon} className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleStatusChange(exam.id, 'draft')}>
                            <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2" />
                            Set as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(exam.id, 'published')}>
                            <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4 mr-2 text-green-600" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(exam.id, 'archived')}>
                            <HugeiconsIcon icon={Archive02Icon} className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteDialog(exam.id)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Status & Type Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={typeConfig[exam.type].badge}>
                      <HugeiconsIcon icon={TypeIcon} className="h-3 w-3 mr-1" />
                      {typeConfig[exam.type].label}
                    </Badge>
                    <Badge className={statusConfig[exam.status].className}>
                      <HugeiconsIcon icon={StatusIcon} className="h-3 w-3 mr-1" />
                      {statusConfig[exam.status].label}
                    </Badge>
                  </div>

                  {/* Security Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90">
                      <HugeiconsIcon icon={LockKeyIcon} className="h-3 w-3 mr-1" />
                      Encrypted
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Title & Description */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{exam.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exam.description}</p>
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <HugeiconsIcon icon={BookOpen01Icon} className="h-4 w-4 shrink-0" />
                      <span className="truncate">{exam.course}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4 shrink-0" />
                      <span>{exam.class}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4 shrink-0" />
                      <span>Due: {format(new Date(exam.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <HugeiconsIcon icon={Chart01Icon} className="h-4 w-4 shrink-0" />
                      <span>{exam.totalMarks} marks</span>
                    </div>
                  </div>

                  {/* File Info */}
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={File01Icon} className="h-3 w-3" />
                      <span>{exam.fileName}</span>
                    </div>
                    <span>{exam.fileSize}</span>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                    <HugeiconsIcon icon={Time04Icon} className="h-3 w-3" />
                    Created {format(new Date(exam.createdAt), 'MMM dd, yyyy')}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <HugeiconsIcon icon={File01Icon} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Exams Found</h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || courseFilter !== 'all'
                ? 'No exams match your current filters. Try adjusting your search criteria.'
                : 'You haven\'t uploaded any offline exams yet. Click the button below to get started.'}
            </p>
            {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && courseFilter === 'all' && (
              <Button>
                <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4 mr-2" />
                Upload Your First Exam
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {filteredExams.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg p-4 border">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-medium text-gray-900">{filteredExams.length}</span> of{' '}
              <span className="font-medium text-gray-900">{offlineExams.length}</span> exams
            </span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setTypeFilter('final')}>
                {offlineExams.filter(e => e.type === 'final').length} Finals
              </Badge>
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setTypeFilter('midterm')}>
                {offlineExams.filter(e => e.type === 'midterm').length} Midterms
              </Badge>
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setTypeFilter('quiz')}>
                {offlineExams.filter(e => e.type === 'quiz').length} Quizzes
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-1" />
              Export List
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
              Delete Exam
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this exam? This action cannot be undone.
              All associated files and data will be permanently removed.
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
              Delete Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Exam Details Dialog */}
      <Dialog open={!!viewExam} onOpenChange={() => setViewExam(null)}>
        {viewExam && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={typeConfig[viewExam.type].icon} className="h-5 w-5" />
                Exam Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{viewExam.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{viewExam.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course</label>
                  <p className="text-sm text-gray-900">{viewExam.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Class</label>
                  <p className="text-sm text-gray-900">{viewExam.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">{format(new Date(viewExam.dueDate), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Marks</label>
                  <p className="text-sm text-gray-900">{viewExam.totalMarks}</p>
                </div>
              </div>

              {viewExam.instructions && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Instructions</label>
                  <p className="text-sm text-gray-600 mt-1">{viewExam.instructions}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {getFileIcon(viewExam.fileType)}
                  <div>
                    <p className="text-sm font-medium">{viewExam.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {viewExam.fileSize} • {viewExam.fileType.toUpperCase()} • Encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => window.open(viewExam.fileUrl)}>
                <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setViewExam(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}