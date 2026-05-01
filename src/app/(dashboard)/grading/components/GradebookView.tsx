'use client';

import { useState } from 'react';
import { useGrading } from '@/context/GradingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookOpen01Icon,
  Alert01Icon,
  Time02Icon,
  Edit02Icon,
  Cancel01Icon,
  Calculator01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Remove01Icon,
  UserIcon,
  Medal01Icon,
  SaveIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

interface GradebookViewProps {
  onGradeEntry?: (studentId: string, studentName: string, assessmentId?: string, assessmentTitle?: string) => void;
}

export default function GradebookView({ onGradeEntry }: GradebookViewProps) {
  const { selectedGradebook, updateGrade } = useGrading();
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    assessmentId: string;
  } | null>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [editFeedback, setEditFeedback] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'overall'>('overall');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudentView, setSelectedStudentView] = useState<string | null>(null);

  if (!selectedGradebook) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <HugeiconsIcon icon={BookOpen01Icon} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Gradebook Selected</h3>
          <p className="text-sm text-gray-600">Please select a course and class to view grades</p>
        </CardContent>
      </Card>
    );
  }

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 80) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 70) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 60) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-green-500" />;
      case 'pending': return <HugeiconsIcon icon={Time02Icon} className="h-4 w-4 text-yellow-500" />;
      case 'excused': return <HugeiconsIcon icon={Alert01Icon} className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getTrendIcon = (percentage: number) => {
    if (percentage >= 85) return <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-4 w-4 text-green-500" />;
    if (percentage >= 70) return <HugeiconsIcon icon={Remove01Icon} className="h-4 w-4 text-yellow-500" />;
    return <HugeiconsIcon icon={ArrowDownRight01Icon} className="h-4 w-4 text-red-500" />;
  };

  const sortedStudents = [...selectedGradebook.students].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.studentName.localeCompare(b.studentName)
        : b.studentName.localeCompare(a.studentName);
    }
    return sortDirection === 'asc'
      ? a.overallPercentage - b.overallPercentage
      : b.overallPercentage - a.overallPercentage;
  });

  const handleStartEdit = (studentId: string, studentName: string, assessmentId: string, currentScore: number | null | undefined, currentFeedback: string | undefined) => {
    if (onGradeEntry) {
      const assessment = selectedGradebook?.assessments.find(a => a.id === assessmentId);
      onGradeEntry(studentId, studentName, assessmentId, assessment?.title);
      return;
    }
    
    setEditingCell({ studentId, assessmentId });
    setEditScore(currentScore?.toString() || '');
    setEditFeedback(currentFeedback || '');
  };

  const handleSaveGrade = () => {
    if (editingCell && editScore) {
      updateGrade(editingCell.studentId, editingCell.assessmentId, parseFloat(editScore), editFeedback);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveGrade();
    if (e.key === 'Escape') setEditingCell(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedGradebook.course} - {selectedGradebook.class}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedGradebook.students.length} students • {selectedGradebook.assessments.length} assessments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="graded">All Graded</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}>
                <HugeiconsIcon icon={Calculator01Icon} className="h-4 w-4 mr-2" />
                Sort by Score
                {sortDirection === 'asc' ? (
                  <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4 ml-1" />
                ) : (
                  <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gradebook Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="sticky left-0 bg-gray-50 z-10 p-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-50">
                  Student
                </th>
                {selectedGradebook.assessments.map((assessment) => (
                  <th key={assessment.id} className="p-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-30">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="block w-full">
                          <div className="truncate max-w-25 mx-auto">{assessment.title}</div>
                          <div className="text-gray-500 font-normal text-[10px]">
                            {assessment.maxScore} pts ({assessment.weight}%)
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{assessment.title}</p>
                          <p className="text-xs">Category: {assessment.category}</p>
                          <p className="text-xs">Weight: {assessment.weight}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                ))}
                <th className="p-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-25 bg-blue-50">
                  Overall
                </th>
                <th className="p-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-20 bg-blue-50">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedStudents.map((student, index) => {
                const letterGrade = getLetterGrade(student.overallPercentage);
                return (
                  <tr
                    key={student.studentId}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {/* Student Info */}
                    <td className="sticky left-0 bg-inherit z-10 p-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <HugeiconsIcon icon={UserIcon} className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                          <p className="text-xs text-gray-500">{student.studentEmail}</p>
                        </div>
                        {student.rank && student.rank <= 3 && (
                          <HugeiconsIcon
                            icon={Medal01Icon}
                            className={`h-4 w-4 ${
                              student.rank === 1 ? 'text-yellow-500' :
                              student.rank === 2 ? 'text-gray-400' :
                              'text-orange-500'
                            }`}
                          />
                        )}
                      </div>
                    </td>

                    {/* Assessment Grades */}
                    {selectedGradebook.assessments.map((assessment) => {
                      const grade = student.grades[assessment.id];
                      const isEditing = editingCell?.studentId === student.studentId && 
                                        editingCell?.assessmentId === assessment.id;

                      return (
                        <td key={assessment.id} className="p-3">
                          {isEditing ? (
                            <div className="flex items-center gap-1 justify-center">
                              <Input
                                type="number"
                                value={editScore}
                                onChange={(e) => setEditScore(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-20 h-8 text-sm text-center"
                                min={0}
                                max={assessment.maxScore}
                                autoFocus
                              />
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveGrade}>
                                <HugeiconsIcon icon={SaveIcon} className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingCell(null)}>
                                <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(
                                student.studentId,
                                student.studentName,
                                assessment.id,
                                grade?.score,
                                grade?.feedback
                              )}
                              className="w-full text-center group relative"
                            >
                              {grade?.status === 'graded' ? (
                                <div>
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-sm font-medium text-gray-900">
                                      {grade.score}
                                    </span>
                                    <span className="text-xs text-gray-500">/ {assessment.maxScore}</span>
                                    {getStatusIcon(grade.status)}
                                  </div>
                                  <div className="text-xs text-gray-500">{grade.percentage}%</div>
                                </div>
                              ) : grade?.status === 'excused' ? (
                                <Badge variant="secondary">Excused</Badge>
                              ) : (
                                <div className="flex items-center justify-center gap-1">
                                  <HugeiconsIcon icon={Time02Icon} className="h-4 w-4 text-gray-400" />
                                  <span className="text-xs text-gray-500">Pending</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gray-100/0 group-hover:bg-gray-100/50 transition-colors rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 text-blue-600" />
                              </div>
                            </button>
                          )}
                        </td>
                      );
                    })}

                    {/* Overall Percentage */}
                    <td className="p-3 text-center bg-blue-50/50">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {student.overallPercentage.toFixed(1)}%
                        </span>
                        {getTrendIcon(student.overallPercentage)}
                      </div>
                    </td>

                    {/* Letter Grade */}
                    <td className="p-3 text-center bg-blue-50/50">
                      <Badge className={`${letterGrade.bg} ${letterGrade.color} font-bold`}>
                        {letterGrade.letter}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 font-semibold">
                <td className="sticky left-0 bg-gray-100 z-10 p-3 text-sm text-gray-700">
                  Class Average
                </td>
                {selectedGradebook.assessments.map((assessment) => (
                  <td key={assessment.id} className="p-3 text-center text-sm text-gray-700">
                    {(() => {
                      const grades = selectedGradebook.students
                        .map(s => s.grades[assessment.id]?.percentage)
                        .filter(g => g !== undefined && g > 0);
                      const avg = grades.length > 0 
                        ? grades.reduce((sum, g) => sum + g, 0) / grades.length 
                        : 0;
                      return `${avg.toFixed(1)}%`;
                    })()}
                  </td>
                ))}
                <td className="p-3 text-center text-sm font-bold text-blue-700 bg-blue-100">
                  {selectedGradebook.statistics.average.toFixed(1)}%
                </td>
                <td className="p-3 text-center bg-blue-100">
                  <Badge className="bg-blue-100 text-blue-700 font-bold">
                    {getLetterGrade(selectedGradebook.statistics.average).letter}
                  </Badge>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Highest</p>
            <p className="text-2xl font-bold text-green-600">{selectedGradebook.statistics.highest}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Lowest</p>
            <p className="text-2xl font-bold text-red-600">{selectedGradebook.statistics.lowest}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Median</p>
            <p className="text-2xl font-bold text-blue-600">{selectedGradebook.statistics.median}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Std Dev</p>
            <p className="text-2xl font-bold text-purple-600">±{selectedGradebook.statistics.standardDeviation}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}