"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {  Mortarboard01FreeIcons, Analytics02Icon, BoardMathIcon, Quiz03Icon, ChartAnalysisIcon, LaptopPhoneSyncIcon, UserAccountIcon, CheckmarkSquare01Icon, ContentWritingIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Analytics02Icon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Classroom & Timetable",
      url: "/virtual-classroom",
      icon: (
        <HugeiconsIcon icon={BoardMathIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Examinations",
      url: "/examinations",
      icon: (
        <HugeiconsIcon icon={Quiz03Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Grading",
      url: "#",
      icon: (
        <HugeiconsIcon icon={ChartAnalysisIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Academic & Content Management",
      url: "#",
      icon: (
        <HugeiconsIcon icon={ContentWritingIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Attendence tracking",
      url: "#",
      icon: (
        <HugeiconsIcon icon={CheckmarkSquare01Icon} strokeWidth={2} />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Communications",
      url: "#",
      icon: (
        <HugeiconsIcon icon={LaptopPhoneSyncIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Profile",
      url: "#",
      icon: (
        <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} />
      ),
    },
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={Mortarboard01FreeIcons} strokeWidth={2} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Course Connect</span>
                  <span className="truncate text-xs">Streamlining Academic Excellency</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
