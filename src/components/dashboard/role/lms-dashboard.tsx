import {
  BookOpen,
  FileCheck,
  Users,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LmsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            LMS E-Learning Control Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: E-Learning Management, Course Creator, Quizzes, Assignments, Content Repository.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          LMS MANAGER
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Digital Courses" value="248 Modules" icon={BookOpen} />
        <KpiCard label="Quizzes & Assignments" value="1,420 Active" icon={FileCheck} tone="info" />
        <KpiCard label="Student Engagement" value="94.2% Active" icon={Users} tone="success" />
        <KpiCard label="Uploaded Materials" value="12.8 GB Data" icon={CheckCircle2} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Active E-Learning Courses & Content">
            <div className="space-y-3">
              {[
                { title: "Advanced Data Structures & Algorithms (CS301)", instructor: "Dr. Ravi Kumar", activeStudents: "184 Enrolled", progress: "85% Content Uploaded" },
                { title: "VLSI System Design (EC402)", instructor: "Prof. Ananya Sharma", activeStudents: "142 Enrolled", progress: "90% Content Uploaded" },
                { title: "Machine Learning & Neural Networks", instructor: "Dr. K. V. Prasad", activeStudents: "210 Enrolled", progress: "95% Content Uploaded" },
              ].map((c) => (
                <div key={c.title} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">Instructor: {c.instructor} | {c.activeStudents}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {c.progress}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="LMS Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Plus className="size-4 mr-2" /> Create New Course Module
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <FileCheck className="size-4 mr-2" /> Create Quiz / Assignment
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
