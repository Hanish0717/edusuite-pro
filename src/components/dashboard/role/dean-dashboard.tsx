import {
  GraduationCap,
  BookOpen,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DeanDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Academic Dean Cockpit
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Academic Leadership, Curriculum Oversight, R&D Publications, Department Audits.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ACADEMIC DEAN
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="R&D Publications (2026)" value="148 Papers" icon={Award} tone="success" />
        <KpiCard label="Curriculum Readiness" value="100% Outcome Based" icon={BookOpen} />
        <KpiCard label="Department Audit Score" value="3.8 / 4.0" icon={CheckCircle2} tone="info" />
        <KpiCard label="Faculty Research Grants" value="Rs 1.45 Cr" icon={TrendingUp} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Curriculum & Academic Audit Progress">
            <div className="space-y-3">
              {[
                { course: "B.Tech CSE - AI & ML Specialization", revision: "V2026 Regulations", status: "Approved" },
                { course: "B.Tech ECE - VLSI & Embedded Systems", revision: "V2026 Regulations", status: "Approved" },
                { course: "M.Tech Data Science & Analytics", revision: "New Syllabus Draft", status: "Under Review" },
              ].map((c) => (
                <div key={c.course} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{c.course}</h4>
                    <p className="text-xs text-muted-foreground">{c.revision}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary text-xs font-mono">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Dean Action Items">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <BookOpen className="size-4 mr-2" /> Approve New Course Syllabus
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Award className="size-4 mr-2" /> Sanction Research Grant Seed Fund
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
