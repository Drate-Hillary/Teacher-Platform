'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Shadcn UI Charts (Recharts)
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  PolarRadiusAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

// Hugeicons Imports
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Activity01Icon,
  PieChartIcon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Target01Icon,
  Award01Icon,
  Download01Icon,
  FilterIcon,
  Refresh01Icon,
  CircleIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons';

import { useGrading } from '@/context/GradingContext';

export default function GradeDistribution() {
  const { selectedGradebook, getGradeDistribution } = useGrading();
  const [chartType, setChartType] = useState<'bar' | 'doughnut' | 'pie' | 'radial'>('bar');
  const [assessmentFilter, setAssessmentFilter] = useState('all');
  const [showDetailed, setShowDetailed] = useState(false);

  if (!selectedGradebook) return null;

  const gradeDistribution = getGradeDistribution();

  // --- Main Chart Configuration (Bar, Pie, Doughnut, Radial) ---
  const mainChartConfig = {
    count: { label: 'Students' },
    A: { label: 'A', color: '#22c55e' },
    B: { label: 'B', color: '#3b82f6' },
    C: { label: 'C', color: '#facc15' },
    D: { label: 'D', color: '#f97316' },
    F: { label: 'F', color: '#ef4444' },
  } satisfies ChartConfig;

  const mainChartData = gradeDistribution.map((d) => {
    // Cast config item to let TS know color is an optional property
    const configItem = mainChartConfig[d.letter as keyof typeof mainChartConfig] as { color?: string };
    return {
      grade: d.letter,
      count: d.count,
      fill: configItem?.color || '#888',
    };
  });

  // --- Detailed Chart Configuration (Bar Histogram) ---
  const detailedChartConfig = {
    students: { label: 'Students', color: '#3b82f6' },
  } satisfies ChartConfig;

  const detailedChartData = [
    { range: '0-10', students: 0 },
    { range: '10-20', students: 0 },
    { range: '20-30', students: 0 },
    { range: '30-40', students: 0 },
    { range: '40-50', students: 0 },
    { range: '50-60', students: 0 },
    { range: '60-70', students: 1 },
    { range: '70-80', students: 1 },
    { range: '80-90', students: 1 },
    { range: '90-100', students: 2 },
  ];

  const scoreRanges = [
    { range: '90-100%', grade: 'A', count: 3, color: 'bg-green-500', textColor: 'text-green-700' },
    { range: '80-89%', grade: 'B', count: 1, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { range: '70-79%', grade: 'C', count: 1, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { range: '60-69%', grade: 'D', count: 0, color: 'bg-orange-500', textColor: 'text-orange-700' },
    { range: 'Below 60%', grade: 'F', count: 0, color: 'bg-red-500', textColor: 'text-red-700' },
  ];

  const renderMainChart = () => {
    switch (chartType) {
      case 'pie':
      case 'doughnut':
        return (
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={mainChartData}
              dataKey="count"
              nameKey="grade"
              innerRadius={chartType === 'doughnut' ? 60 : 0}
              strokeWidth={5}
            >
              <LabelList
                dataKey="grade"
                className="fill-background"
                stroke="none"
                fontSize={14}
                fontWeight="bold"
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        );
      case 'radial':
        return (
          <RadialBarChart data={mainChartData} innerRadius={30} outerRadius={140} barSize={20}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="grade" />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
            <RadialBar
              dataKey="count"
              background={{ fill: '#f3f4f6' }}
              cornerRadius={10}
            />
          </RadialBarChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={mainChartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="grade" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grade Distribution</h2>
          <p className="text-sm text-gray-600 mt-1">
            Visual breakdown of student performance across all assessments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={assessmentFilter} onValueChange={setAssessmentFilter}>
            <SelectTrigger className="w-45">
              <HugeiconsIcon icon={FilterIcon} className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assessments</SelectItem>
              <SelectItem value="a1">Homework 1</SelectItem>
              <SelectItem value="a2">Quiz 1</SelectItem>
              <SelectItem value="a3">Midterm Exam</SelectItem>
              <SelectItem value="a4">Group Project</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Overall Grade Distribution</h3>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <HugeiconsIcon icon={Activity01Icon} className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'doughnut' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('doughnut')}
              >
                <HugeiconsIcon icon={CircleIcon} className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <HugeiconsIcon icon={PieChartIcon} className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'radial' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('radial')}
              >
                <HugeiconsIcon icon={Layers01Icon} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={mainChartConfig} className="mx-auto h-100 w-full max-w-2xl">
            {renderMainChart()}
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Score Ranges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {scoreRanges.map((item) => (
          <Card key={item.grade}>
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-lg">{item.grade}</span>
              </div>
              <p className="text-sm text-gray-600">{item.range}</p>
              <p className={`text-2xl font-bold ${item.textColor}`}>{item.count}</p>
              <p className="text-xs text-gray-500">students</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Distribution Statistics</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Mean Score', value: `${selectedGradebook.statistics.average}%`, icon: Target01Icon, color: 'text-blue-600' },
              { label: 'Median Score', value: `${selectedGradebook.statistics.median}%`, icon: ArrowUpRight01Icon, color: 'text-green-600' },
              { label: 'Standard Deviation', value: `±${selectedGradebook.statistics.standardDeviation}`, icon: Activity01Icon, color: 'text-purple-600' },
              { label: 'Passing Rate (≥60%)', value: '100%', icon: Award01Icon, color: 'text-yellow-600' },
              { label: 'Highest Score', value: `${selectedGradebook.statistics.highest}%`, icon: ArrowUpRight01Icon, color: 'text-green-600' },
              { label: 'Lowest Score', value: `${selectedGradebook.statistics.lowest}%`, icon: ArrowDownRight01Icon, color: 'text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-gray-700">{stat.label}</span>
                </div>
                <span className="font-bold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Score Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Score Breakdown</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailed(!showDetailed)}>
                <HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={detailedChartConfig} className="h-75 w-full">
              <BarChart data={detailedChartData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="var(--color-students)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student List by Grade */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Students by Grade</h3>
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gradeDistribution.map((grade) => (
              <div key={grade.letter} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${grade.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold">{grade.letter}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Grade {grade.letter}</p>
                      <p className="text-sm text-gray-600">{grade.count} student{grade.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {((grade.count / (selectedGradebook?.students.length || 1)) * 100).toFixed(0)}% of class
                  </Badge>
                </div>
                
                {grade.count > 0 && (
                  <div className="space-y-2">
                    {selectedGradebook?.students
                      .filter(s => {
                        if (grade.letter === 'A') return s.overallPercentage >= 90;
                        if (grade.letter === 'B') return s.overallPercentage >= 80 && s.overallPercentage < 90;
                        if (grade.letter === 'C') return s.overallPercentage >= 70 && s.overallPercentage < 80;
                        if (grade.letter === 'D') return s.overallPercentage >= 60 && s.overallPercentage < 70;
                        return s.overallPercentage < 60;
                      })
                      .map((student) => (
                        <div key={student.studentId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{student.studentName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{student.overallPercentage}%</span>
                            <Badge variant="secondary">#{student.rank}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison View */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Grade Comparison by Assessment</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left text-xs font-semibold text-gray-700">Assessment</th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-700">A</th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-700">B</th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-700">C</th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-700">D</th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-700">F</th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-700">Avg</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedGradebook?.assessments.map((assessment) => {
                  const grades = selectedGradebook.students
                    .map(s => s.grades[assessment.id]?.percentage)
                    .filter(g => g > 0);
                  const avg = grades.length > 0
                    ? (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(1)
                    : 'N/A';
                  
                  return (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium">{assessment.title}</td>
                      <td className="p-3 text-center">
                        <Badge className="bg-green-100 text-green-700">
                          {grades.filter(g => g >= 90).length}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-blue-100 text-blue-700">
                          {grades.filter(g => g >= 80 && g < 90).length}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-700">
                          {grades.filter(g => g >= 70 && g < 80).length}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-orange-100 text-orange-700">
                          {grades.filter(g => g >= 60 && g < 70).length}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-red-100 text-red-700">
                          {grades.filter(g => g < 60).length}
                        </Badge>
                      </td>
                      <td className="p-3 text-center font-bold">{avg}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}