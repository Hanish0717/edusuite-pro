import {
  BedDouble,
  Users,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function WardenDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Hostel Warden Administration
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Hostel Management, Room Allotment, Gate Pass Approvals, Mess Management, Maintenance.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          HOSTEL WARDEN
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Hostel Occupancy" value="1,180 / 1,200 Beds" icon={BedDouble} tone="success" />
        <KpiCard label="Outpass Requests Pending" value="8 Requests" icon={Clock} tone="warning" />
        <KpiCard label="Mess Attendance Today" value="1,140 Served" icon={Users} tone="info" />
        <KpiCard label="Maintenance Tickets" value="4 Open" icon={ShieldAlert} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Gate Pass & Outpass Approval Requests">
            <div className="space-y-3">
              {[
                { student: "Rahul Sharma (Block A 302)", reason: "Weekend Home Visit", returnDate: "Aug 3, 08:00 PM", status: "Pending Warden Sign" },
                { student: "Vikram R. (Block B 104)", reason: "Medical Appointment", returnDate: "Today, 06:00 PM", status: "Approved" },
                { student: "Ankita P. (Girls Hostel Block C 205)", reason: "Family Emergency", returnDate: "Aug 4, 10:00 AM", status: "Pending Warden Sign" },
              ].map((op) => (
                <div key={op.student} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{op.student}</h4>
                    <p className="text-xs text-muted-foreground">Reason: {op.reason} | Return: {op.returnDate}</p>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-mono">
                    {op.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Warden Quick Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <CheckCircle2 className="size-4 mr-2" /> Approve Gate Outpass
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <BedDouble className="size-4 mr-2" /> Allot Room / Check Vacancy
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
