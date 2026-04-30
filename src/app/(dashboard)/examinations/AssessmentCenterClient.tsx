'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AssessmentProvider } from '@/context/AssessmentContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { BarChartIcon, FileText, MonitorDot, Plus, Shield, Task01Icon, Upload01Icon } from '@hugeicons/core-free-icons';
import UploadOfflineExam from './components/UploadExamsOffline';
import QuizBuilder from './components/QuizBuilder';
import CreateAssignment from './components/CreateAssignment';
import PlagiarismChecker from './components/PlagiarismCheck';
import OfflineExamList from './components/OfflineExamList';
import DigitalAssessmentList from './components/DigitalAssessmentList';
import AssignmentList from './components/AssignmentList';

export default function AssessmentCenterClient() {
  const [showUploadExam, setShowUploadExam] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [activeTab, setActiveTab] = useState('offline');

  return (
    <AssessmentProvider>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment & Examination Center</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create, manage, and grade all types of assessments
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'offline' && (
              <Button onClick={() => setShowUploadExam(true)}>
                <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4 mr-2" />
                Upload Exam
              </Button>
            )}
            {activeTab === 'digital' && (
              <Button onClick={() => setShowQuizBuilder(true)}>
                <HugeiconsIcon icon={MonitorDot} className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            )}
            {activeTab === 'assignments' && (
              <Button onClick={() => setShowCreateAssignment(true)}>
                <HugeiconsIcon icon={Plus} className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            )}
            {activeTab === 'plagiarism' && (
              <Button onClick={() => {}}>
                <HugeiconsIcon icon={Shield} className="h-4 w-4 mr-2" />
                New Scan
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Offline Exams', value: '5', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Digital Quizzes', value: '8', icon: MonitorDot, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Assignments', value: '12', icon: Task01Icon, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Plagiarism Scans', value: '45', icon: Shield, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <HugeiconsIcon icon={BarChartIcon} className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="offline" className="flex items-center gap-2">
              <HugeiconsIcon icon={FileText} className="h-4 w-4" />
              <span className="hidden sm:inline">Offline Exams</span>
            </TabsTrigger>
            <TabsTrigger value="digital" className="flex items-center gap-2">
              <HugeiconsIcon icon={MonitorDot} className="h-4 w-4" />
              <span className="hidden sm:inline">Digital Assessments</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <HugeiconsIcon icon={Task01Icon} className="h-4 w-4" />
              <span className="hidden sm:inline">Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="plagiarism" className="flex items-center gap-2">
              <HugeiconsIcon icon={Shield} className="h-4 w-4" />
              <span className="hidden sm:inline">Plagiarism Checker</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offline">
            <OfflineExamList />
          </TabsContent>

          <TabsContent value="digital">
            <DigitalAssessmentList />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentList />
          </TabsContent>

          <TabsContent value="plagiarism">
            <PlagiarismChecker />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <UploadOfflineExam open={showUploadExam} onOpenChange={setShowUploadExam} />
        <QuizBuilder open={showQuizBuilder} onOpenChange={setShowQuizBuilder} />
        <CreateAssignment open={showCreateAssignment} onOpenChange={setShowCreateAssignment} />
      </div>
    </AssessmentProvider>
  );
}