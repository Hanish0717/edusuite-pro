import {
  Users,
  UserCog,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Wallet,
  Package,
  Calendar,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Operations & Admin Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Daily Operations & Workflows across admissions, rosters, timetables, and inventory.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ADMIN / OPERATIONS
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Student Roster" value="5,246 Active" icon={Users} />
        <KpiCard label="Faculty Roster" value="623 Staff" icon={UserCog} tone="info" />
        <KpiCard label="Admissions Pending" value="142 Applicants" icon={GraduationCap} tone="warning" />
        <KpiCard label="Fee Collections Today" value="Rs 18.4 Lakhs" icon={Wallet} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel
            title="Assigned Modules & Operations"
            description="Active operational workflows configured for the Admin role."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold">Admission Desk</h4>
                    <p className="text-xs text-muted-foreground">Pre-admissions & verification</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CalendarCheck className="size-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold">Timetable & Attendance</h4>
                    <p className="text-xs text-muted-foreground">Clash-free schedule builder</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileSpreadsheet className="size-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold">Exam Analytics</h4>
                    <p className="text-xs text-muted-foreground">Valuation & gradebooks</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Package className="size-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold">Inventory & Events</h4>
                    <p className="text-xs text-muted-foreground">Asset counts & campus events</p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Operational Quick Actions">
            <div className="space-y-2.5">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Users className="size-4 mr-2" /> Add Student Record
              </Button>

              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Calendar className="size-4 mr-2" /> Publish Class Timetable
              </Button>

              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <BookOpen className="size-4 mr-2" /> Review LMS Curriculum
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
