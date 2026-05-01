'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface StudentGrade {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatar?: string;
  grades: {
    [assessmentId: string]: {
      score: number | null;
      maxScore: number;
      percentage: number;
      feedback: string;
      status: 'graded' | 'pending' | 'excused';
      gradedAt?: string;
      attachments?: { name: string; url: string; type: string }[];
    };
  };
  overallPercentage: number;
  letterGrade: string;
  rank?: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project' | 'participation';
  course: string;
  class: string;
  maxScore: number;
  weight: number;
  dueDate: string;
  category: string;
}

export interface GradebookView {
  course: string;
  class: string;
  assessments: Assessment[];
  students: StudentGrade[];
  statistics: {
    average: number;
    median: number;
    highest: number;
    lowest: number;
    standardDeviation: number;
    distribution: {
      a: number;
      b: number;
      c: number;
      d: number;
      f: number;
    };
  };
}

interface GradingContextType {
  gradebooks: GradebookView[];
  selectedGradebook: GradebookView | null;
  selectedStudent: StudentGrade | null;
  setSelectedGradebook: (gradebook: GradebookView | null) => void;
  setSelectedStudent: (student: StudentGrade | null) => void;
  updateGrade: (studentId: string, assessmentId: string, score: number, feedback: string) => void;
  publishResults: (assessmentId: string) => void;
  exportMarksheet: (format: 'excel' | 'pdf', gradebookId: string) => void;
  getGradeDistribution: () => { letter: string; count: number; color: string }[];
}

const GradingContext = createContext<GradingContextType | undefined>(undefined);

export function GradingProvider({ children }: { children: ReactNode }) {
  const [gradebooks] = useState<GradebookView[]>([
    {
      course: 'Advanced Mathematics',
      class: 'Grade 12-A',
      assessments: [
        { id: 'a1', title: 'Homework 1', type: 'assignment', course: 'Advanced Mathematics', class: 'Grade 12-A', maxScore: 100, weight: 10, dueDate: '2026-03-15', category: 'Homework' },
        { id: 'a2', title: 'Quiz 1 - Calculus', type: 'quiz', course: 'Advanced Mathematics', class: 'Grade 12-A', maxScore: 50, weight: 15, dueDate: '2026-03-22', category: 'Quiz' },
        { id: 'a3', title: 'Midterm Exam', type: 'exam', course: 'Advanced Mathematics', class: 'Grade 12-A', maxScore: 200, weight: 35, dueDate: '2026-04-05', category: 'Exam' },
        { id: 'a4', title: 'Group Project', type: 'project', course: 'Advanced Mathematics', class: 'Grade 12-A', maxScore: 100, weight: 20, dueDate: '2026-04-20', category: 'Project' },
        { id: 'a5', title: 'Final Exam', type: 'exam', course: 'Advanced Mathematics', class: 'Grade 12-A', maxScore: 200, weight: 20, dueDate: '2026-05-15', category: 'Exam' },
      ],
      students: [
        {
          studentId: 's1',
          studentName: 'Alice Johnson',
          studentEmail: 'alice.j@school.edu',
          avatar: '/avatars/alice.jpg',
          grades: {
            'a1': { score: 95, maxScore: 100, percentage: 95, feedback: 'Excellent work!', status: 'graded', gradedAt: '2026-03-16' },
            'a2': { score: 45, maxScore: 50, percentage: 90, feedback: 'Good understanding', status: 'graded', gradedAt: '2026-03-23' },
            'a3': { score: 185, maxScore: 200, percentage: 92.5, feedback: 'Outstanding performance', status: 'graded', gradedAt: '2026-04-06' },
            'a4': { score: 88, maxScore: 100, percentage: 88, feedback: 'Great collaboration', status: 'graded', gradedAt: '2026-04-21' },
            'a5': { score: null, maxScore: 200, percentage: 0, feedback: '', status: 'pending' },
          },
          overallPercentage: 91.4,
          letterGrade: 'A',
          rank: 1,
        },
        {
          studentId: 's2',
          studentName: 'Bob Smith',
          studentEmail: 'bob.s@school.edu',
          grades: {
            'a1': { score: 78, maxScore: 100, percentage: 78, feedback: 'Good effort', status: 'graded', gradedAt: '2026-03-16' },
            'a2': { score: 38, maxScore: 50, percentage: 76, feedback: 'Needs improvement', status: 'graded', gradedAt: '2026-03-23' },
            'a3': { score: 155, maxScore: 200, percentage: 77.5, feedback: 'Satisfactory', status: 'graded', gradedAt: '2026-04-06' },
            'a4': { score: 72, maxScore: 100, percentage: 72, feedback: 'Could improve', status: 'graded', gradedAt: '2026-04-21' },
            'a5': { score: null, maxScore: 200, percentage: 0, feedback: '', status: 'pending' },
          },
          overallPercentage: 75.9,
          letterGrade: 'B',
          rank: 4,
        },
        {
          studentId: 's3',
          studentName: 'Charlie Brown',
          studentEmail: 'charlie.b@school.edu',
          grades: {
            'a1': { score: 88, maxScore: 100, percentage: 88, feedback: 'Very good', status: 'graded', gradedAt: '2026-03-16' },
            'a2': { score: 42, maxScore: 50, percentage: 84, feedback: 'Good progress', status: 'graded', gradedAt: '2026-03-23' },
            'a3': { score: 170, maxScore: 200, percentage: 85, feedback: 'Strong performance', status: 'graded', gradedAt: '2026-04-06' },
            'a4': { score: 90, maxScore: 100, percentage: 90, feedback: 'Excellent project', status: 'graded', gradedAt: '2026-04-21' },
            'a5': { score: null, maxScore: 200, percentage: 0, feedback: '', status: 'pending' },
          },
          overallPercentage: 86.8,
          letterGrade: 'A',
          rank: 2,
        },
        {
          studentId: 's4',
          studentName: 'Diana Prince',
          studentEmail: 'diana.p@school.edu',
          grades: {
            'a1': { score: 65, maxScore: 100, percentage: 65, feedback: 'Needs work', status: 'graded', gradedAt: '2026-03-16' },
            'a2': { score: 30, maxScore: 50, percentage: 60, feedback: 'Below average', status: 'graded', gradedAt: '2026-03-23' },
            'a3': { score: 120, maxScore: 200, percentage: 60, feedback: 'Must improve', status: 'graded', gradedAt: '2026-04-06' },
            'a4': { score: 68, maxScore: 100, percentage: 68, feedback: 'Satisfactory', status: 'graded', gradedAt: '2026-04-21' },
            'a5': { score: null, maxScore: 200, percentage: 0, feedback: '', status: 'pending' },
          },
          overallPercentage: 63.3,
          letterGrade: 'C',
          rank: 5,
        },
        {
          studentId: 's5',
          studentName: 'Ethan Hunt',
          studentEmail: 'ethan.h@school.edu',
          grades: {
            'a1': { score: 92, maxScore: 100, percentage: 92, feedback: 'Great work!', status: 'graded', gradedAt: '2026-03-16' },
            'a2': { score: 48, maxScore: 50, percentage: 96, feedback: 'Outstanding!', status: 'graded', gradedAt: '2026-03-23' },
            'a3': { score: 190, maxScore: 200, percentage: 95, feedback: 'Exceptional', status: 'graded', gradedAt: '2026-04-06' },
            'a4': { score: 85, maxScore: 100, percentage: 85, feedback: 'Great teamwork', status: 'graded', gradedAt: '2026-04-21' },
            'a5': { score: null, maxScore: 200, percentage: 0, feedback: '', status: 'pending' },
          },
          overallPercentage: 92,
          letterGrade: 'A',
          rank: 3,
        },
      ],
      statistics: {
        average: 81.88,
        median: 86.8,
        highest: 92,
        lowest: 63.3,
        standardDeviation: 11.2,
        distribution: { a: 3, b: 1, c: 1, d: 0, f: 0 },
      },
    },
  ]);

  const [selectedGradebook, setSelectedGradebook] = useState<GradebookView | null>(gradebooks[0]);
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);

  const updateGrade = (studentId: string, assessmentId: string, score: number, feedback: string) => {
    toast.success(`Grade updated for student`);
    // In real app, this would update the database
  };

  const publishResults = (assessmentId: string) => {
    toast.success('Results published to student portals');
  };

  const exportMarksheet = (format: 'excel' | 'pdf', gradebookId: string) => {
    toast.success(`Marksheet exported as ${format.toUpperCase()}`);
  };

  const getGradeDistribution = () => {
    return [
      { letter: 'A', count: 3, color: 'bg-green-500' },
      { letter: 'B', count: 1, color: 'bg-blue-500' },
      { letter: 'C', count: 1, color: 'bg-yellow-500' },
      { letter: 'D', count: 0, color: 'bg-orange-500' },
      { letter: 'F', count: 0, color: 'bg-red-500' },
    ];
  };

  return (
    <GradingContext.Provider
      value={{
        gradebooks,
        selectedGradebook,
        selectedStudent,
        setSelectedGradebook,
        setSelectedStudent,
        updateGrade,
        publishResults,
        exportMarksheet,
        getGradeDistribution,
      }}
    >
      {children}
    </GradingContext.Provider>
  );
}

export function useGrading() {
  const context = useContext(GradingContext);
  if (context === undefined) {
    throw new Error('useGrading must be used within a GradingProvider');
  }
  return context;
}