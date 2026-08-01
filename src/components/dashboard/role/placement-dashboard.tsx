import {
  Briefcase,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PlacementDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Training & Placement Officer (TPO) Portal
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Career & Placements, Drives, Corporate Relations, Resumes, Interviews, Offers.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          PLACEMENT OFFICER
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Eligible Students" value="850 Batch '26" icon={Users} />
        <KpiCard label="Offers Issued" value="620 Placed" icon={CheckCircle2} tone="success" />
        <KpiCard label="Highest Package" value="Rs 44.5 LPA" icon={Briefcase} tone="info" />
        <KpiCard label="Active Recruitment Drives" value="12 Companies" icon={Building} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Active Corporate Recruitment Drives">
            <div className="space-y-3">
              {[
                { company: "Google Cloud", role: "Software Engineer I", CTC: "32 LPA", status: "Shortlisting", driveDate: "Aug 10, 2026" },
                { company: "Microsoft India", role: "Software Development Engineer", CTC: "28 LPA", status: "Interviews Active", driveDate: "Aug 4, 2026" },
                { company: "Qualcomm India", role: "Hardware Systems Engineer", CTC: "22 LPA", status: "Registrations Open", driveDate: "Aug 18, 2026" },
              ].map((drive) => (
                <div key={drive.company} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{drive.company}</h4>
                    <p className="text-xs text-muted-foreground">{drive.role} | Package: {drive.CTC}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {drive.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Placement Officer Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Plus className="size-4 mr-2" /> Schedule Campus Drive
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Users className="size-4 mr-2" /> Export Student Resume Database
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
