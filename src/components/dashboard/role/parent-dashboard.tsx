import { useMemo } from "react";
import { Award, CreditCard, GraduationCap, Users } from "lucide-react";

import { DonutChart } from "@/components/dashboard/charts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import {
  ActivityWidget,
  AiInsightsWidget,
  QuickActionsWidget,
} from "@/components/dashboard/widgets";

import {
  fetchWardStats,
  fetchAttendanceSplit,
  fetchTeacherRemarks,
} from "@/lib/parentService";

export function ParentDashboard() {
  const ward = useMemo(() => fetchWardStats(), []);
  const attendanceSplit = useMemo(() => fetchAttendanceSplit(), []);
  const teacherRemarks = useMemo(() => fetchTeacherRemarks(), []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Ward Name" value={ward.wardName} icon={Users} />
        <KpiCard label="Ward CGPA" value={ward.cgpa} icon={Award} tone="success" />
        <KpiCard label="Attendance" value={ward.attendance} icon={GraduationCap} />
        <KpiCard label="Fee Status" value={ward.feeStatus} icon={CreditCard} tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Ward Attendance Overview"
          description="Overall semester distribution"
          className="lg:col-span-2"
        >
          <DonutChart data={attendanceSplit} height={260} centerLabel={ward.attendance} />
        </Panel>

        <Panel title="Teacher Remarks" description="Feedback from department head">
          <div className="space-y-3 text-xs">
            {teacherRemarks.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span>{item.teacher}</span>
                  <span className="font-mono text-[0.68rem] text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.remark}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AiInsightsWidget />
        <ActivityWidget />
        <Panel title="Fee Receipts & Due Dates" description="Semester payments">
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-2.5 text-emerald-700 font-medium dark:text-emerald-400">
              <span>Sem 4 Tuition Fee (Paid)</span>
              <span className="font-mono font-bold">₹45,000</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2.5 font-medium">
              <span>Hostel & Mess Fee (Paid)</span>
              <span className="font-mono font-bold">₹28,000</span>
            </div>
          </div>
        </Panel>
      </div>

      <QuickActionsWidget
        actions={[
          "Pay pending fees",
          "Download report card",
          "Contact mentor",
          "Apply leave for ward",
          "View hostel status",
        ]}
      />
    </div>
  );
}
