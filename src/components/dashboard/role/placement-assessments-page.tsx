import { useState } from "react";
import {
  Code2,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  Check,
  Building,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  Monitor,
  Database,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export interface RecruiterAssessment {
  id: string;
  testName: string;
  company: string;
  recruiterName: string;
  duration: string;
  totalMarks: number;
  assignedCount: number;
  attemptedCount: number;
  status: "Live" | "Scheduled" | "Completed" | "Pending TPO Approval";
  malpracticeAlerts: number;
}

const INITIAL_ASSESSMENTS: RecruiterAssessment[] = [
  {
    id: "TEST-101",
    testName: "Google Cloud Aptitude & Coding Round 1",
    company: "Google Cloud India",
    recruiterName: "David Miller",
    duration: "90 Mins",
    totalMarks: 100,
    assignedCount: 360,
    attemptedCount: 310,
    status: "Live",
    malpracticeAlerts: 2,
  },
  {
    id: "TEST-102",
    testName: "Microsoft Software Engineering Assessment",
    company: "Microsoft",
    recruiterName: "Satya Nadella HR Team",
    duration: "120 Mins",
    totalMarks: 120,
    assignedCount: 280,
    attemptedCount: 0,
    status: "Scheduled",
    malpracticeAlerts: 0,
  },
  {
    id: "TEST-103",
    testName: "Amazon AWS System Design & Coding Test",
    company: "Amazon AWS",
    recruiterName: "Jeff Bezos Recruiter",
    duration: "90 Mins",
    totalMarks: 100,
    assignedCount: 420,
    attemptedCount: 410,
    status: "Completed",
    malpracticeAlerts: 1,
  },
];

export function PlacementAssessmentsWorkspace() {
  const [assessments, setAssessments] = useState<RecruiterAssessment[]>(INITIAL_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handlePublishResults = (testName: string) => {
    toast.success(`Published verified assessment results for ${testName}`);
  };

  const handleScheduleTest = (testName: string) => {
    toast.info(`Scheduled proctored session for ${testName}`);
  };

  const filteredTests = assessments.filter((t) => {
    const matchesSearch =
      t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <Code2 className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-purple-600 text-white font-mono text-[0.7rem] animate-pulse">
                  ● Live Assessment Operations
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  24 Total Drive Assessments
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Global Assessment Command & Operations Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Review, approve, schedule, proctor, and publish recruiter-created placement assessments.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS — NO GENERIC CREATE MODAL */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => toast.success("Refreshed live proctoring feeds")}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Monitor className="size-4" /> Live Proctoring Feed
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Exported Assessment Operations Audit Log")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Logs
            </Button>
          </div>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        {[
          { label: "Total Tests", val: "24", desc: "Corporate Drives", color: "text-blue-600 bg-blue-500/10" },
          { label: "Live Proctored", val: "2", desc: "Tests Running Now", color: "text-purple-600 bg-purple-500/10" },
          { label: "Scheduled Tests", val: "8", desc: "Upcoming Sessions", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Total Attempted", val: "1,850", desc: "Test Submissions", color: "text-teal-600 bg-teal-500/10" },
          { label: "Malpractice Alerts", val: "4", desc: "AI Flagged", color: "text-rose-600 bg-rose-500/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground block truncate">{kpi.label}</span>
            <p className="font-display text-2xl font-extrabold">{kpi.val}</p>
            <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-md ${kpi.color}`}>
              {kpi.desc}
            </span>
          </div>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessment by test name or company..."
              className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Live">Live</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ASSESSMENT DIRECTORY TABLE */}
      <Panel title="Assessment Roster & Operations Schedule">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Assessment Title</th>
                <th className="p-3">Company & Recruiter</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center font-right">Assigned Candidates</th>
                <th className="p-3 text-center">Attempted</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {filteredTests.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-bold text-foreground">{t.testName}</td>
                  <td className="p-3 font-mono">
                    <p className="font-bold text-foreground">{t.company}</p>
                    <span className="text-[0.68rem] text-muted-foreground">{t.recruiterName}</span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-purple-600">{t.duration}</td>
                  <td className="p-3 text-center font-mono font-extrabold text-foreground">{t.assignedCount}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-600">{t.attemptedCount}</td>
                  <td className="p-3">
                    <Badge className={t.status === "Live" ? "bg-purple-600 text-white animate-pulse" : "bg-emerald-500/10 text-emerald-600"}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        onClick={() => handlePublishResults(t.testName)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 text-xs rounded-xl cursor-pointer"
                      >
                        Publish Results
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleTest(t.testName)}
                        className="h-7 text-xs rounded-xl cursor-pointer"
                      >
                        Schedule
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
