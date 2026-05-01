'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGrading } from '@/context/GradingContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Target01Icon,
  Award01Icon,
  Alert01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Download01Icon,
  ExpandIcon,
} from '@hugeicons/core-free-icons';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

interface PerformanceAnalyticsProps {
  onViewDistribution?: () => void;
}

export default function PerformanceAnalytics({ onViewDistribution }: PerformanceAnalyticsProps) {
  const { selectedGradebook, getGradeDistribution } = useGrading();

  if (!selectedGradebook) return null;

  const gradeDistribution = getGradeDistribution();

  // Transform data for Recharts: Assessment Performance (Bar Chart)
  const assessmentData = selectedGradebook.assessments.map((a) => {
    const grades = selectedGradebook.students
      .map((s) => s.grades[a.id]?.percentage)
      .filter((g) => g > 0);
    const avg = grades.length ? grades.reduce((sum, g) => sum + g, 0) / grades.length : 0;
    const highest = grades.length ? Math.max(...grades) : 0;
    
    return {
      assessment: a.title,
      average: Number(avg.toFixed(1)),
      highest: Number(highest.toFixed(1)),
    };
  });

  const assessmentConfig = {
    average: { label: 'Class Average', color: '#3b82f6' },
    highest: { label: 'Highest', color: '#22c55e' },
  } satisfies ChartConfig;

  // Transform data for Recharts: Grade Distribution (Radial Chart)
  const distributionConfig = {
    students: { label: 'Students', color: 'transparent' },
    A: { label: 'A', color: '#22c55e' },
    B: { label: 'B', color: '#3b82f6' },
    C: { label: 'C', color: '#fbbf24' },
    D: { label: 'D', color: '#f97316' },
    F: { label: 'F', color: '#ef4444' },
  } satisfies ChartConfig;

  const distributionData = gradeDistribution.map((d) => ({
    grade: d.letter,
    students: d.count,
    fill: distributionConfig[d.letter as keyof typeof distributionConfig]?.color || '#888',
  }));

  // Transform data for Recharts: Performance Trend (Line Chart)
  const trendData = [
    { week: 'Week 1', average: 78 },
    { week: 'Week 2', average: 82 },
    { week: 'Week 3', average: 79 },
    { week: 'Week 4', average: 85 },
    { week: 'Week 5', average: 83 },
    { week: 'Week 6', average: 87 },
  ];

  const trendConfig = {
    average: { label: 'Class Average', color: '#3b82f6' },
  } satisfies ChartConfig;

  const atRiskStudents = selectedGradebook.students
    .filter((s) => s.overallPercentage < 70)
    .sort((a, b) => a.overallPercentage - b.overallPercentage);

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: `${selectedGradebook.statistics.average}%`, icon: Target01Icon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Passing Rate', value: '83%', icon: Award01Icon, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'At Risk Students', value: atRiskStudents.length.toString(), icon: Alert01Icon, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Grade Improvement', value: '+4.2%', icon: ArrowUpRight01Icon, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <HugeiconsIcon icon={stat.icon} className={`h-5 w-5 ${stat.color}`} />
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Assessment Performance</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-35">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assessments</SelectItem>
                  <SelectItem value="exams">Exams Only</SelectItem>
                  <SelectItem value="homework">Homework Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={assessmentConfig} className="h-80 w-full">
              <BarChart data={assessmentData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="assessment" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="average" fill="var(--color-average)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highest" fill="var(--color-highest)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
              {onViewDistribution && (
                <Button variant="outline" size="sm" onClick={onViewDistribution}>
                  <HugeiconsIcon icon={ExpandIcon} className="h-4 w-4 mr-2" />
                  View Detailed Distribution
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={distributionConfig} className="mx-auto h-80 w-full max-w-75">
              <RadialBarChart 
                data={distributionData} 
                innerRadius={30} 
                outerRadius={130} 
                barSize={15}
              >
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="grade" />} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
                <RadialBar
                  dataKey="students"
                  background={{ fill: '#f3f4f6' }}
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-80 w-full">
              <LineChart data={trendData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 5', 'dataMax + 5']} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="var(--color-average)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-average)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* At-Risk Students */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HugeiconsIcon icon={Alert01Icon} className="h-5 w-5 text-red-500" />
                At-Risk Students
              </h3>
              <Badge variant="destructive">{atRiskStudents.length} students</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atRiskStudents.length > 0 ? (
                atRiskStudents.map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                      <p className="text-xs text-gray-600">{student.studentEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{student.overallPercentage}%</p>
                      <Badge className="bg-red-100 text-red-700">{student.letterGrade}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <HugeiconsIcon icon={Award01Icon} className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">All students are performing well!</p>
                </div>
              )}
            </div>
            {atRiskStudents.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Recommended Actions:</p>
                <div className="space-y-1">
                  {[
                    'Schedule one-on-one tutoring sessions',
                    'Provide additional practice materials',
                    'Contact parents/guardians',
                    'Offer extra credit opportunities',
                  ].map((action, i) => (
                    <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full" />
                      {action}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Student Performance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Student Performance Overview</h3>
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-xs font-semibold text-gray-700">Student</th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-700">Overall</th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-700">Grade</th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-700">Rank</th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-700">Trend</th>
                  <th className="text-center p-3 text-xs font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedGradebook.students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="p-3">
                      <p className="text-sm font-medium">{student.studentName}</p>
                      <p className="text-xs text-gray-500">{student.studentEmail}</p>
                    </td>
                    <td className="text-center p-3">
                      <span className="text-sm font-bold">{student.overallPercentage}%</span>
                    </td>
                    <td className="text-center p-3">
                      <Badge className={
                        student.letterGrade === 'A' ? 'bg-green-100 text-green-700' :
                        student.letterGrade === 'B' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {student.letterGrade}
                      </Badge>
                    </td>
                    <td className="text-center p-3 text-sm">#{student.rank}</td>
                    <td className="text-center p-3">
                      {student.overallPercentage >= 85 ? (
                        <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <HugeiconsIcon icon={ArrowDownRight01Icon} className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-3">
                      <Badge variant={
                        student.overallPercentage >= 70 ? 'default' : 'destructive'
                      }>
                        {student.overallPercentage >= 70 ? 'On Track' : 'At Risk'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}