import WelcomeBanner from "./components/WelcomeBanner";
import DailySchedule from "./components/DailySchedules";
import TaskList from "./components/TaskList";
import UpcomingSessions from "./components/UpcomingSessions";
import RecentActivity from "./components/RecentActivity";
import StatsOverview from "./components/StatsOverview";
import QuickAnalytics from "./components/QuickAnalytic";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner */}
      <WelcomeBanner teacherName="Dr. Sarah Johnson" />

      {/* Quick Stats Overview */}
      <StatsOverview />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Schedule */}
          <DailySchedule />

          {/* Quick Analytics */}
          <QuickAnalytics />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Task & Action Items */}
          <TaskList />

          {/* Upcoming Virtual Sessions */}
          <UpcomingSessions />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
