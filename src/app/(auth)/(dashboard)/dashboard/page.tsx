import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import WelcomeBanner from "./components/WelcomeBanner"
import DailySchedule from "./components/DailySchedules"
import TaskList from "./components/TaskList"
import UpcomingSessions from "./components/UpcomingSessions"
import RecentActivity from "./components/RecentActivity"
import StatsOverview from "./components/StatsOverview"
import QuickAnalytics from "./components/QuickAnalytic"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="space-y-6">
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
      </SidebarInset>
    </SidebarProvider>
  )
}
