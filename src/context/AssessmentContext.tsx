'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface PlagiarismMatch {
  source: string;
  similarity: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  order: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ExamConfiguration {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timeLimit: number; // in minutes
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResults: 'immediately' | 'after_due' | 'never';
  maxAttempts: number;
  passingScore: number;
  antiCheating: {
    browserLockdown: boolean;
    tabSwitchAlert: boolean;
    fullScreenRequired: boolean;
    cameraProctoring: boolean;
    ipTracking: boolean;
  };
}

export interface Rubric {
  id: string;
  criteria: string;
  description: string;
  maxPoints: number;
  levels: {
    label: string;
    points: number;
    description: string;
  }[];
}

export interface OfflineExam {
  id: string;
  title: string;
  description: string;
  type: 'final' | 'midterm' | 'quiz' | 'worksheet';
  course: string;
  class: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'docx';
  totalMarks: number;
  dueDate: string;
  status: 'draft' | 'published' | 'archived';
  instructions: string;
  createdAt: string;
}

export interface DigitalAssessment {
  id: string;
  title: string;
  description: string;
  course: string;
  class: string;
  type: 'quiz' | 'test' | 'exam';
  questions: Question[];
  configuration: ExamConfiguration;
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  totalPoints: number;
  createdAt: string;
  submissions?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  class: string;
  dueDate: string;
  totalPoints: number;
  rubric: Rubric[];
  lateSubmissionPolicy: {
    allowLate: boolean;
    penaltyPercentage: number;
    deadlineExtension: string | null;
  };
  attachments: { name: string; url: string; size: string }[];
  status: 'draft' | 'published' | 'closed';
  submissions: number;
  createdAt: string;
}

interface AssessmentContextType {
  offlineExams: OfflineExam[];
  digitalAssessments: DigitalAssessment[];
  assignments: Assignment[];
  createOfflineExam: (exam: Omit<OfflineExam, 'id' | 'createdAt'>) => void;
  updateOfflineExam: (id: string, updates: Partial<OfflineExam>) => void;
  deleteOfflineExam: (id: string) => void;
  createDigitalAssessment: (assessment: Omit<DigitalAssessment, 'id' | 'createdAt'>) => void;
  updateDigitalAssessment: (id: string, updates: Partial<DigitalAssessment>) => void;
  deleteDigitalAssessment: (id: string) => void;
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  checkPlagiarism: (documentUrl: string) => Promise<{ score: number; matches: PlagiarismMatch[] }>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [offlineExams, setOfflineExams] = useState<OfflineExam[]>([
    {
      id: '1',
      title: 'Advanced Mathematics Final Exam',
      description: 'Comprehensive final examination covering all topics from the semester',
      type: 'final',
      course: 'Advanced Mathematics',
      class: 'Grade 12-A',
      fileUrl: '#',
      fileName: 'Math_Final_Exam_2026.pdf',
      fileSize: '2.4 MB',
      fileType: 'pdf',
      totalMarks: 100,
      dueDate: '2026-05-15',
      status: 'published',
      instructions: 'Complete all questions within 3 hours. Show all working.',
      createdAt: '2026-04-20T08:00:00Z',
    },
    {
      id: '2',
      title: 'Physics Midterm Worksheet',
      description: 'Practice worksheet for midterm preparation',
      type: 'worksheet',
      course: 'Physics Lab',
      class: 'Grade 11-B',
      fileUrl: '#',
      fileName: 'Physics_Worksheet_Chapter5.pdf',
      fileSize: '1.1 MB',
      fileType: 'pdf',
      totalMarks: 50,
      dueDate: '2026-05-01',
      status: 'draft',
      instructions: 'Complete all problems and show calculations.',
      createdAt: '2026-04-25T10:00:00Z',
    },
  ]);

  const [digitalAssessments, setDigitalAssessments] = useState<DigitalAssessment[]>([
    {
      id: '1',
      title: 'Computer Science Unit Test',
      description: 'Online quiz covering data structures and algorithms',
      course: 'Computer Science',
      class: 'Grade 12-A',
      type: 'quiz',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the time complexity of binary search?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(log n)',
          points: 10,
          order: 1,
          difficulty: 'medium',
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'A stack follows the FIFO principle.',
          options: ['True', 'False'],
          correctAnswer: 'False',
          points: 5,
          order: 2,
          difficulty: 'easy',
        },
      ],
      configuration: {
        startDate: '2026-05-10',
        startTime: '09:00',
        endDate: '2026-05-10',
        endTime: '17:00',
        timeLimit: 60,
        randomizeQuestions: true,
        randomizeOptions: true,
        showResults: 'after_due',
        maxAttempts: 1,
        passingScore: 60,
        antiCheating: {
          browserLockdown: true,
          tabSwitchAlert: true,
          fullScreenRequired: true,
          cameraProctoring: false,
          ipTracking: true,
        },
      },
      status: 'draft',
      totalPoints: 15,
      createdAt: '2026-04-26T09:00:00Z',
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Statistics Research Project',
      description: 'Conduct a statistical analysis of real-world data and present findings',
      course: 'Statistics',
      class: 'Grade 12-B',
      dueDate: '2026-05-20',
      totalPoints: 100,
      rubric: [
        {
          id: 'r1',
          criteria: 'Data Collection',
          description: 'Quality and relevance of data collected',
          maxPoints: 25,
          levels: [
            { label: 'Excellent', points: 25, description: 'Comprehensive and well-documented data' },
            { label: 'Good', points: 20, description: 'Adequate data with minor gaps' },
            { label: 'Fair', points: 15, description: 'Basic data collection' },
            { label: 'Poor', points: 10, description: 'Insufficient data' },
          ],
        },
        {
          id: 'r2',
          criteria: 'Analysis',
          description: 'Statistical methods and analysis accuracy',
          maxPoints: 50,
          levels: [
            { label: 'Excellent', points: 50, description: 'Advanced analysis with proper methods' },
            { label: 'Good', points: 40, description: 'Good analysis with minor errors' },
            { label: 'Fair', points: 30, description: 'Basic analysis applied' },
            { label: 'Poor', points: 20, description: 'Incorrect or incomplete analysis' },
          ],
        },
      ],
      lateSubmissionPolicy: {
        allowLate: true,
        penaltyPercentage: 10,
        deadlineExtension: '2026-05-22',
      },
      attachments: [
        { name: 'Project_Guidelines.pdf', url: '#', size: '856 KB' },
        { name: 'Sample_Dataset.csv', url: '#', size: '234 KB' },
      ],
      status: 'published',
      submissions: 15,
      createdAt: '2026-04-22T14:00:00Z',
    },
  ]);

  const createOfflineExam = (exam: Omit<OfflineExam, 'id' | 'createdAt'>) => {
    const newExam: OfflineExam = {
      ...exam,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setOfflineExams(prev => [...prev, newExam]);
    toast.success('Offline exam uploaded successfully!');
  };

  const updateOfflineExam = (id: string, updates: Partial<OfflineExam>) => {
    setOfflineExams(prev =>
      prev.map(exam => (exam.id === id ? { ...exam, ...updates } : exam))
    );
    toast.success('Exam updated successfully!');
  };

  const deleteOfflineExam = (id: string) => {
    setOfflineExams(prev => prev.filter(exam => exam.id !== id));
    toast.success('Exam deleted successfully!');
  };

  const createDigitalAssessment = (assessment: Omit<DigitalAssessment, 'id' | 'createdAt'>) => {
    const newAssessment: DigitalAssessment = {
      ...assessment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDigitalAssessments(prev => [...prev, newAssessment]);
    toast.success('Digital assessment created successfully!');
  };

  const updateDigitalAssessment = (id: string, updates: Partial<DigitalAssessment>) => {
    setDigitalAssessments(prev =>
      prev.map(assessment => (assessment.id === id ? { ...assessment, ...updates } : assessment))
    );
    toast.success('Assessment updated successfully!');
  };

  const deleteDigitalAssessment = (id: string) => {
    setDigitalAssessments(prev => prev.filter(assessment => assessment.id !== id));
    toast.success('Assessment deleted successfully!');
  };

  const createAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAssignments(prev => [...prev, newAssignment]);
    toast.success('Assignment created successfully!');
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev =>
      prev.map(assignment => (assignment.id === id ? { ...assignment, ...updates } : assignment))
    );
    toast.success('Assignment updated successfully!');
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    toast.success('Assignment deleted successfully!');
  };

  const checkPlagiarism = async (documentUrl: string): Promise<{ score: number; matches: PlagiarismMatch[] }> => {
    // Simulate plagiarism check
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      score: Math.random() * 100,
      matches: [
        { source: 'Online Database A', similarity: 15 },
        { source: 'Student Submission B', similarity: 8 },
        { source: 'Academic Paper C', similarity: 5 },
      ],
    };
  };

  return (
    <AssessmentContext.Provider
      value={{
        offlineExams,
        digitalAssessments,
        assignments,
        createOfflineExam,
        updateOfflineExam,
        deleteOfflineExam,
        createDigitalAssessment,
        updateDigitalAssessment,
        deleteDigitalAssessment,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        checkPlagiarism,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}