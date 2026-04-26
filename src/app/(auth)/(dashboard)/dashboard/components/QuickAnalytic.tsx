'use client';

import { useState } from 'react';
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
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'; // Adjust this path based on your setup

export default function QuickAnalytics() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'performance'>('attendance');

  // --- Recharts Data Structures ---
  const attendanceData = [
    { day: 'Mon', present: 92, absent: 5, late: 3 },
    { day: 'Tue', present: 88, absent: 8, late: 4 },
    { day: 'Wed', present: 95, absent: 3, late: 2 },
    { day: 'Thu', present: 90, absent: 6, late: 4 },
    { day: 'Fri', present: 87, absent: 9, late: 4 },
  ];

  const gradeTrendData = [
    { week: 'Week 1', average: 72 },
    { week: 'Week 2', average: 75 },
    { week: 'Week 3', average: 73 },
    { week: 'Week 4', average: 78 },
    { week: 'Week 5', average: 82 },
    { week: 'Week 6', average: 85 },
  ];

  const performanceRadialData = [
    { grade: 'A', students: 15, fill: 'var(--color-A)' },
    { grade: 'B', students: 25, fill: 'var(--color-B)' },
    { grade: 'C', students: 12, fill: 'var(--color-C)' },
    { grade: 'D', students: 5, fill: 'var(--color-D)' },
    { grade: 'F', students: 3, fill: 'var(--color-F)' },
  ];

  // --- Shadcn Chart Configs ---
  const attendanceConfig = {
    present: { label: 'Present', color: 'rgb(34, 197, 94)' },
    absent: { label: 'Absent', color: 'rgb(239, 68, 68)' },
    late: { label: 'Late', color: 'rgb(251, 191, 36)' },
  };

  const trendConfig = {
    average: { label: 'Class Average', color: 'rgb(59, 130, 246)' },
  };

  const radialChartConfig = {
    students: { label: 'Students' },
    A: { label: 'Grade A', color: 'rgba(34, 197, 94, 0.8)' },
    B: { label: 'Grade B', color: 'rgba(59, 130, 246, 0.8)' },
    C: { label: 'Grade C', color: 'rgba(251, 191, 36, 0.8)' },
    D: { label: 'Grade D', color: 'rgba(249, 115, 22, 0.8)' },
    F: { label: 'Grade F', color: 'rgba(239, 68, 68, 0.8)' },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Quick Analytics</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'attendance'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'performance'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Performance
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="p-4">
        {activeTab === 'attendance' ? (
          <div className="space-y-6">
            {/* Weekly Attendance Chart */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Weekly Attendance Overview
              </h3>
              <div className="h-64 w-full">
                <ChartContainer config={attendanceConfig} className="h-full w-full">
                  <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      className="text-xs"
                    />
                    <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="late" fill="var(--color-late)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-700 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-800 mt-1">92%</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-xs text-red-700 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-800 mt-1">5%</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-xs text-yellow-700 font-medium">Late</p>
                <p className="text-2xl font-bold text-yellow-800 mt-1">3%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Grade Distribution & Trend */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Grade Distribution
                </h3>
                <div className="h-48 flex items-center justify-center">
                  <ChartContainer
                    config={radialChartConfig}
                    className="mx-auto aspect-square w-full h-full pb-0"
                  >
                    <RadialBarChart
                      data={performanceRadialData}
                      innerRadius={30}
                      outerRadius={100}
                      barSize={12}
                    >
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel nameKey="grade" />}
                      />
                      <RadialBar
                        dataKey="students"
                        background={{ fill: 'rgba(0,0,0,0.03)' }}
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ChartContainer>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Class Performance Trend
                </h3>
                <div className="h-48 w-full">
                  <ChartContainer config={trendConfig} className="h-full w-full">
                    <LineChart data={gradeTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="week"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        className="text-xs"
                      />
                      <YAxis
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        className="text-xs"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="var(--color-average)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'var(--color-average)' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-600">Class Average</p>
                <p className="text-lg font-bold text-blue-600">85%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Highest</p>
                <p className="text-lg font-bold text-green-600">98%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Lowest</p>
                <p className="text-lg font-bold text-red-600">45%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Pass Rate</p>
                <p className="text-lg font-bold text-purple-600">94%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}