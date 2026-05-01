'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GradingProvider, useGrading } from '@/context/GradingContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { BookOpen02Icon, Calculator01Icon, Chart02Icon, Download01Icon, Edit01Icon, HighlighterIcon, Pen02Icon, PieChart03Icon, SentIcon, TrendingUp, ViewIcon } from '@hugeicons/core-free-icons';
import GradebookView from './components/GradebookView';
import OnScreenGrading from './components/OnScreenGrading';
import ResultPublisher from './components/ResultPublisher';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ExportMarksheet from './components/ExportMarksheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AnnotationTool from './components/AnnotationTool';
import GradeDistribution from './components/GradeDistribution';
import GradeEntry from './components/GradeEntry';

export default function GradingCenterClient() {
  const { selectedGradebook } = useGrading();
  const [activeTab, setActiveTab] = useState('gradebook');
  const [showGradeEntry, setShowGradeEntry] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
    assessmentId?: string;
    assessmentTitle?: string;
  } | null>(null);

  const stats = [
    { label: 'Pending Grades', value: '24', icon: Calculator01Icon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Graded Today', value: '12', icon: Pen02Icon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ready to Publish', value: '3', icon: SentIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Class Average', value: '82%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleOpenGradeEntry = (studentId: string, studentName: string, assessmentId?: string, assessmentTitle?: string) => {
    setSelectedStudent({ id: studentId, name: studentName, assessmentId, assessmentTitle });
    setShowGradeEntry(true);
  };

  const handleOpenAnnotation = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setShowAnnotation(true);
  };

  const handleSaveGrade = (score: number, feedback: string, status: string) => {
    console.log('Grade saved:', { studentId: selectedStudent?.id, score, feedback, status });
    setShowGradeEntry(false);
    setSelectedStudent(null);
  };

  return (
    <GradingProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grading & Result Analysis</h1>
            <p className="text-sm text-gray-600 mt-1">
              Grade student work, analyze performance, and publish results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Download01Icon} />
            <Button>
              <HugeiconsIcon icon={SentIcon} className="h-4 w-4 mr-2" />
              Publish Results
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <HugeiconsIcon icon={Chart02Icon} className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="gradebook" className="flex items-center gap-2">
              <HugeiconsIcon icon={BookOpen02Icon} className="h-4 w-4" />
              <span className="hidden sm:inline">Digital Gradebook</span>
            </TabsTrigger>
            <TabsTrigger value="onscreen" className="flex items-center gap-2">
              <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
              <span className="hidden sm:inline">On-Screen Grading</span>
            </TabsTrigger>
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <HugeiconsIcon icon={SentIcon} className="h-4 w-4" />
              <span className="hidden sm:inline">Publish Results</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <HugeiconsIcon icon={Chart02Icon} className="h-4 w-4" />
              <span className="hidden sm:inline">Performance Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gradebook">
            <GradebookView onGradeEntry={handleOpenGradeEntry}/>
          </TabsContent>

          <TabsContent value="onscreen">
            <OnScreenGrading 
              onOpenAnnotation={handleOpenAnnotation}
              onOpenGradeEntry={handleOpenGradeEntry}
            />
          </TabsContent>

          <TabsContent value="publish">
            <ResultPublisher />
          </TabsContent>

          <TabsContent value="analytics">
            <PerformanceAnalytics onViewDistribution={() => setShowDistribution(true)} />
          </TabsContent>

          <TabsContent value="export">
            <ExportMarksheet />
          </TabsContent>
        </Tabs>

         {/* Grade Entry Dialog - Used from Gradebook and OnScreenGrading */}
      <Dialog open={showGradeEntry} onOpenChange={setShowGradeEntry}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] no-scrollbar overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Edit01Icon} className="h-5 w-5" />
              Grade Entry - {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          <GradeEntry
            studentId={selectedStudent?.id}
            studentName={selectedStudent?.name}
            assessmentId={selectedStudent?.assessmentId}
            assessmentTitle={selectedStudent?.assessmentTitle}
            maxScore={100}
            onSave={handleSaveGrade}
            onCancel={() => setShowGradeEntry(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Annotation Tool Dialog - Used from OnScreenGrading */}
      <Dialog open={showAnnotation} onOpenChange={setShowAnnotation}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] no-scrollbar overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={HighlighterIcon} className="h-5 w-5" />
              Annotation Tool - {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          <AnnotationTool
            documentName={`${selectedStudent?.name}_submission.pdf`}
            totalPages={5}
            onSave={(annotations) => {
              console.log('Annotations saved:', annotations);
              setShowAnnotation(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Grade Distribution Dialog */}
      <Dialog open={showDistribution} onOpenChange={setShowDistribution}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] no-scrollbar overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={PieChart03Icon} className="h-5 w-5" />
              Grade Distribution Analysis
            </DialogTitle>
          </DialogHeader>
          <GradeDistribution />
        </DialogContent>
      </Dialog>
      </div>
    </GradingProvider>
  );
}