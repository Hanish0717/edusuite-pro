import {
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileCheck,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function VicePrincipalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Vice Principal Operations & Conduct Panel
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Discipline Management, Student Complaints, Staff Oversight, Operational Approvals.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          VICE PRINCIPAL
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Disciplinary Complaints" value="3 Active" icon={ShieldAlert} tone="warning" />
        <KpiCard label="Staff Oversight Audit" value="98.2% Active" icon={UserCheck} tone="success" />
        <KpiCard label="Student Grievance Closed" value="138 / 142" icon={CheckCircle2} />
        <KpiCard label="Operational Approvals" value="6 Pending" icon={Clock} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Student Discipline & Complaints Register">
          <div className="space-y-3">
            {[
              { id: "DIS-104", subject: "Lab Equipment Damage Investigation", status: "In Inquiry", dept: "CSE" },
              { id: "DIS-105", subject: "Campus Attendance Anomaly Review", status: "Hearing Scheduled", dept: "ECE" },
              { id: "DIS-106", subject: "Hostel Late Outpass Policy Appeal", status: "Resolved", dept: "Hostel Branch" },
            ].map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold">{item.subject}</h4>
                  <p className="text-xs text-muted-foreground">Case ID: {item.id} | Dept: {item.dept}</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Staff Oversight & Operational Approvals">
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-border/70 bg-card">
              <h4 className="font-display text-sm font-bold">Faculty Substitution Approval</h4>
              <p className="text-xs text-muted-foreground mt-1">ECE Department coverage during IEEE Conference.</p>
              <Button size="sm" className="mt-3 bg-brand-gradient text-xs cursor-pointer">
                Approve Substitution Schedule
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
