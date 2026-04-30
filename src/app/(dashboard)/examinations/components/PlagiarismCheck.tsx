'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssessment } from '@/context/AssessmentContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Chart03Icon, Download01Icon, File01Icon, Search01Icon, Shield01Icon, Upload01Icon, ViewIcon } from '@hugeicons/core-free-icons';

export default function PlagiarismChecker() {
  const { checkPlagiarism, assignments } = useAssessment();
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<{
    score: number;
    matches: Array<{ source: string; similarity: number }>;
  } | null>(null);

  const recentScans = [
    { id: 1, student: 'John Doe', assignment: 'Research Paper', score: 12, status: 'clean' },
    { id: 2, student: 'Jane Smith', assignment: 'Lab Report', score: 45, status: 'warning' },
    { id: 3, student: 'Bob Johnson', assignment: 'Essay', score: 78, status: 'danger' },
  ];

  const handleScan = async () => {
    if (!selectedDocument) return;
    
    setScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setScanProgress(i);
    }

    const results = await checkPlagiarism(selectedDocument.name);
    setResults(results);
    setScanning(false);
  };

  const getScoreColor = (score: number) => {
    if (score < 20) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score < 20) return { label: 'Low Risk', className: 'bg-green-100 text-green-700' };
    if (score < 50) return { label: 'Medium Risk', className: 'bg-yellow-100 text-yellow-700' };
    return { label: 'High Risk', className: 'bg-red-100 text-red-700' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload & Scan Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5" />
                  Document Scanner
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Upload documents to check for plagiarism
                </p>
              </div>
              <Badge variant="secondary">Powered by AI</Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Assignment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose assignment to check" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map(assignment => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!selectedDocument ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center pt-5 pb-6">
                      <HugeiconsIcon icon={Upload01Icon} className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, or TXT (Max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setSelectedDocument(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={File01Icon} className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{selectedDocument.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedDocument.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Ready to scan</Badge>
                  </div>
                </div>
              )}

              {scanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scanning document...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} />
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleScan}
                disabled={!selectedDocument || scanning}
              >
                {scanning ? (
                  <>
                    <HugeiconsIcon icon={Search01Icon} className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Search01Icon} className="h-4 w-4 mr-2" />
                    Start Plagiarism Check
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Scan Results</h3>
                <Badge className={getScoreBadge(results.score).className}>
                  {getScoreBadge(results.score).label}
                </Badge>
              </div>

              {/* Similarity Score */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-gray-200">
                  <div>
                    <p className={`text-3xl font-bold ${getScoreColor(results.score)}`}>
                      {results.score.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">Similarity</p>
                  </div>
                </div>
              </div>

              {/* Matches */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Matched Sources</h4>
                {results.matches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        match.similarity > 20 ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{match.source}</p>
                        <p className="text-xs text-gray-500">{match.similarity}% similar</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button className="flex-1">
                  <HugeiconsIcon icon={ViewIcon} className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Scans Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={Chart03Icon} className="h-5 w-5" />
              Recent Scans
            </h3>

            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{scan.student}</p>
                    <p className="text-xs text-gray-500">{scan.assignment}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      scan.status === 'clean' ? 'text-green-600' :
                      scan.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {scan.score}%
                    </p>
                    <Badge variant="secondary" className="text-xs">View</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Documents Scanned</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clean Reports</span>
                <span className="font-medium text-green-600">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Flagged Reports</span>
                <span className="font-medium text-red-600">13</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Similarity</span>
                <span className="font-medium">18.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}