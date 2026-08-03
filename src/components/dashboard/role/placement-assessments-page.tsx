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
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-[#0F1B44] text-white grid place-items-center font-extrabold text-2xl shadow-md shrink-0">
              <Code2 className="size-8 text-[#4D78FF]" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[#1F4FD8] text-white font-mono text-[0.65rem] uppercase tracking-wider font-semibold rounded-full px-3 py-1">
                  PLACEMENT OPERATIONS HUB
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.68rem] rounded-full border-slate-300">
                  AY 2026–2027
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Global Assessment Command &amp; Operations Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono max-w-2xl">
                Create, review, schedule, proctor, and publish recruiter-created placement assessments from registration to offer release.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => {
                toast.success("📢 TPO Broadcast Sent! Created and dispatched TCS Placement Assessment link to 360 eligible students via notifications and Notice Board.");
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Sparkles className="size-4" /> + Create &amp; Share Assignment to Students
            </Button>

            <Button
              onClick={() => toast.success("Refreshed live proctoring feeds")}
              className="bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-muted font-semibold text-xs rounded-xl h-10 px-3.5 cursor-pointer gap-1.5 shadow-2xs"
            >
              <Monitor className="size-4 text-[#2563EB]" /> Live Proctoring Feed
            </Button>

            <Button
              variant="outline"
              onClick={() => toast.info("Exported Assessment Operations Audit Log")}
              className="bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-muted text-xs rounded-xl h-10 px-3.5 cursor-pointer gap-1.5 shadow-2xs"
            >
              <Download className="size-3.5" /> Export Logs
            </Button>
          </div>

        </div>
      </div>

      {/* SECTION HEADING */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold tracking-[1.5px] text-slate-500 uppercase">
          CAMPUS ASSESSMENT KEY PERFORMANCE INDICATORS
        </h2>
        <Badge variant="outline" className="text-[0.62rem] font-mono text-slate-500 border-slate-300">
          Live Operations Center
        </Badge>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-5">
        {[
          { label: "Total Tests", val: "24", badge: "+8 this month", pct: 75, sub: "Registered campus drives" },
          { label: "Live Proctored", val: "2", badge: "Tests Running Now", pct: 40, sub: "Real-time AI sessions" },
          { label: "Scheduled Tests", val: "8", badge: "Upcoming Sessions", pct: 60, sub: "Open for registrations" },
          { label: "Total Attempted", val: "1,850", badge: "Test Submissions", pct: 85, sub: "Completed candidate tests" },
          { label: "Malpractice Alerts", val: "4", badge: "AI Flagged", pct: 15, sub: "Flagged proctoring sessions" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{kpi.label}</span>
              <span className="text-[0.65rem] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {kpi.badge}
              </span>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{kpi.val}</p>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${kpi.pct}%` }} />
            </div>
            <p className="text-[0.68rem] text-slate-400 dark:text-slate-500 font-mono mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessment by test name or company..."
              className="h-10 border-slate-200 dark:border-border bg-slate-50/50 dark:bg-background/60 pl-9 text-xs focus-visible:ring-[#2563EB] rounded-xl"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
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
              <tr className="border-b border-border bg-slate-50/80 dark:bg-muted/30 text-slate-500 dark:text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Assessment Title</th>
                <th className="p-3">Company &amp; Recruiter</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center font-right">Assigned Candidates</th>
                <th className="p-3 text-center">Attempted</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {filteredTests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{t.testName}</td>
                  <td className="p-3 font-mono">
                    <p className="font-bold text-slate-900 dark:text-white">{t.company}</p>
                    <span className="text-[0.68rem] text-slate-500">{t.recruiterName}</span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-[#2563EB]">{t.duration}</td>
                  <td className="p-3 text-center font-mono font-extrabold text-slate-900 dark:text-white">{t.assignedCount}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-600">{t.attemptedCount}</td>
                  <td className="p-3">
                    <Badge className={t.status === "Live" ? "bg-[#2563EB] text-white animate-pulse" : "bg-emerald-500/10 text-emerald-600"}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        onClick={() => handlePublishResults(t.testName)}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-7 text-xs rounded-xl cursor-pointer"
                      >
                        Publish Results
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleTest(t.testName)}
                        className="h-7 text-xs rounded-xl cursor-pointer border-slate-200"
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
