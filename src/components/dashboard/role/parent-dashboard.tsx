import { Bus, CalendarCheck, IndianRupee, Star } from "lucide-react";

import { GroupedBarChart, TrendLineChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { AiInsightsWidget, UpcomingWidget, QuickActionsWidget } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
import { monthlyAttendanceBars, notifications, semesterProgress } from "@/data/mock";

export function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Attendance" value="88%" icon={CalendarCheck} delta="4%" tone="success" />
        <KpiCard label="CGPA" value="8.45" icon={Star} delta="0.08" />
        <KpiCard label="Fee Paid" value="Rs 85,000" icon={IndianRupee} tone="info" />
        <KpiCard label="Pending Fee" value="Rs 0" icon={IndianRupee} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Attendance Overview" description="Monthly breakdown for Sai Teja">
          <GroupedBarChart
            data={monthlyAttendanceBars}
            xKey="month"
            series={[
              { key: "present", label: "Present" },
              { key: "absent", label: "Absent" },
              { key: "leave", label: "Leave" },
            ]}
          />
        </Panel>
        <Panel title="Academic Performance" description="SGPA and CGPA across semesters">
          <TrendLineChart
            data={semesterProgress}
            xKey="term"
            series={[
              { key: "sgpa", label: "SGPA" },
              { key: "cgpa", label: "CGPA" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Recent Notifications" description="Circulars and alerts">
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.title} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.meta}</p>
                </div>
                {n.unread && <Badge className="shrink-0">New</Badge>}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Transport Tracking"
          description="Live bus status"
          action={
            <span className="grid size-9 place-items-center rounded-xl bg-info/10 text-info">
              <Bus className="size-4" />
            </span>
          }
        >
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Bus route</dt>
              <dd className="font-medium">Route 3</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Bus number</dt>
              <dd className="font-medium">AP39 AB 1234</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium text-success">On time</dd>
            </div>
          </dl>
        </Panel>

        <UpcomingWidget />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AiInsightsWidget />
        <QuickActionsWidget actions={["Pay fees", "Request PTM", "Download report card", "Contact mentor"]} />
      </div>
    </div>
  );
}
