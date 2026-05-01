'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Hugeicons Imports
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Download01Icon,
  File01Icon,
  File02Icon,
  Settings01Icon,
  UserGroupIcon,
  Calendar03Icon,
  ViewIcon,
  PrinterIcon,
  Share01Icon,
} from '@hugeicons/core-free-icons';

import { useGrading } from '@/context/GradingContext';


export default function ExportMarksheet() {
  const { selectedGradebook, exportMarksheet } = useGrading();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [includeFeedback, setIncludeFeedback] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [includeStudentInfo, setIncludeStudentInfo] = useState(true);

  const exportHistory = [
    { id: 1, name: 'Gradebook_Export_Mar2026.xlsx', format: 'excel', date: '2026-03-28', size: '245 KB' },
    { id: 2, name: 'Midterm_Results.pdf', format: 'pdf', date: '2026-03-15', size: '1.2 MB' },
    { id: 3, name: 'Progress_Report_Q1.xlsx', format: 'excel', date: '2026-02-20', size: '380 KB' },
  ];

  const handleExport = () => {
    if (selectedGradebook) {
      exportMarksheet(exportFormat, 'gradebook-1');
      setExportDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Downloadable Mark Sheets</h3>
              <p className="text-sm text-gray-600 mt-1">
                Export class results for departmental reviews or physical archiving
              </p>
            </div>
            <Button onClick={() => setExportDialogOpen(true)}>
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
              New Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Selection */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={File01Icon} className="h-4 w-4" />
                Export Format
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setExportFormat('excel');
                    setExportDialogOpen(true);
                  }}
                  className="p-6 border-2 rounded-xl text-center hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <HugeiconsIcon icon={File02Icon} className="h-10 w-10 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-gray-900">Excel (.xlsx)</p>
                  <p className="text-xs text-gray-600 mt-1">Editable spreadsheet format</p>
                  <Badge variant="secondary" className="mt-2">Recommended</Badge>
                </button>
                <button
                  onClick={() => {
                    setExportFormat('pdf');
                    setExportDialogOpen(true);
                  }}
                  className="p-6 border-2 rounded-xl text-center hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                  <HugeiconsIcon icon={File01Icon} className="h-10 w-10 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-gray-900">PDF</p>
                  <p className="text-xs text-gray-600 mt-1">Print-ready document</p>
                  <Badge variant="secondary" className="mt-2">For Printing</Badge>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={Settings01Icon} className="h-4 w-4" />
                Quick Export Options
              </h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setExportDialogOpen(true)}>
                  <HugeiconsIcon icon={File02Icon} className="h-4 w-4 mr-2 text-green-600" />
                  Export Complete Gradebook
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HugeiconsIcon icon={File01Icon} className="h-4 w-4 mr-2 text-blue-600" />
                  Export Summary Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4 mr-2 text-purple-600" />
                  Export Individual Student Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HugeiconsIcon icon={PrinterIcon} className="h-4 w-4 mr-2 text-orange-600" />
                  Print Mark Sheets
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Exports</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.format === 'excel' ? (
                    <HugeiconsIcon icon={File02Icon} className="h-8 w-8 text-green-600" />
                  ) : (
                    <HugeiconsIcon icon={File01Icon} className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <HugeiconsIcon icon={Calendar03Icon} className="h-3 w-3" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.format.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <HugeiconsIcon icon={Share01Icon} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Download01Icon} className="h-5 w-5" />
              Export Mark Sheet
            </DialogTitle>
            <DialogDescription>
              Configure export settings for your gradebook
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setExportFormat('excel')}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    exportFormat === 'excel'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <HugeiconsIcon icon={File02Icon} className={`h-6 w-6 mx-auto mb-1 ${
                    exportFormat === 'excel' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="text-sm font-medium">Excel</span>
                </button>
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <HugeiconsIcon icon={File01Icon} className={`h-6 w-6 mx-auto mb-1 ${
                    exportFormat === 'pdf' ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <span className="text-sm font-medium">PDF</span>
                </button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Include in Export</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="feedback"
                    checked={includeFeedback}
                    onCheckedChange={(checked) => setIncludeFeedback(checked as boolean)}
                  />
                  <Label htmlFor="feedback" className="text-sm cursor-pointer">
                    Student Feedback
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="statistics"
                    checked={includeStatistics}
                    onCheckedChange={(checked) => setIncludeStatistics(checked as boolean)}
                  />
                  <Label htmlFor="statistics" className="text-sm cursor-pointer">
                    Class Statistics (Average, Median, Distribution)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="studentInfo"
                    checked={includeStudentInfo}
                    onCheckedChange={(checked) => setIncludeStudentInfo(checked as boolean)}
                  />
                  <Label htmlFor="studentInfo" className="text-sm cursor-pointer">
                    Student Information (Email, ID)
                  </Label>
                </div>
              </div>
            </div>

            {selectedGradebook && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course</span>
                  <span className="font-medium">{selectedGradebook.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class</span>
                  <span className="font-medium">{selectedGradebook.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{selectedGradebook.students.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assessments</span>
                  <span className="font-medium">{selectedGradebook.assessments.length}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
              Export {exportFormat === 'excel' ? 'Excel' : 'PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}