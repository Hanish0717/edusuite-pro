import { useState } from "react";
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  Check,
  X,
  FileText,
  Building,
  Sparkles,
  RefreshCw,
  Briefcase,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface CandidateApplication {
  id: string;
  appNo: string;
  studentName: string;
  rollNo: string;
  department: string;
  company: string;
  role: string;
  cgpa: number;
  atsScore: number;
  reviewStatus: "Approved" | "Under Review" | "Rejected";
  appliedDate: string;
  avatar: string;
}

const INITIAL_APPLICATIONS: CandidateApplication[] = [
  {
    id: "APP-101",
    appNo: "APP-2026-GGL-01",
    studentName: "Aditya Sharma",
    rollNo: "2022CSE188",
    department: "CSE",
    company: "Google Cloud India",
    role: "Software Engineer I",
    cgpa: 9.2,
    atsScore: 94,
    reviewStatus: "Approved",
    appliedDate: "2026-08-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "APP-102",
    appNo: "APP-2026-GGL-02",
    studentName: "Rohan Varma",
    rollNo: "2022CSE104",
    department: "CSE",
    company: "Google Cloud India",
    role: "Software Engineer I",
    cgpa: 8.9,
    atsScore: 91,
    reviewStatus: "Approved",
    appliedDate: "2026-08-01",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "APP-103",
    appNo: "APP-2026-MSF-01",
    studentName: "Sneha Reddy",
    rollNo: "2022ECE042",
    department: "ECE",
    company: "Microsoft",
    role: "Cloud Solution Associate",
    cgpa: 8.4,
    atsScore: 88,
    reviewStatus: "Under Review",
    appliedDate: "2026-08-02",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "APP-104",
    appNo: "APP-2026-AMZ-01",
    studentName: "Pooja Hegde",
    rollNo: "2022ECE012",
    department: "ECE",
    company: "Amazon AWS",
    role: "SDE I",
    cgpa: 8.8,
    atsScore: 86,
    reviewStatus: "Under Review",
    appliedDate: "2026-08-03",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
];

export function PlacementApplicationsWorkspace() {
  const [applications, setApplications] = useState<CandidateApplication[]>(INITIAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleApproveApp = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, reviewStatus: "Approved" } : a))
    );
    toast.success(`Approved candidate application ${id}`);
  };

  const handleRejectApp = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, reviewStatus: "Rejected" } : a))
    );
    toast.error(`Rejected application ${id}`);
  };

  const filteredApps = applications.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.reviewStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <FileCheck2 className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-mono text-[0.7rem]">
                  Application Review Operations
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  520 Total Submitted Applications
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Global Application Review & Verification Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Review candidate applications, verify ATS resume credentials, approve placement drive shortlists.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS — NO GENERIC CREATE MODAL */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => toast.success("Approved all selected student applications")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Check className="size-4" /> Bulk Approve
            </Button>

            <Button
              variant="outline"
              onClick={() => toast.info("Exported applications ledger CSV")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Applications
            </Button>
          </div>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        {[
          { label: "Total Applications", val: "520", desc: "Submitted Batch", color: "text-blue-600 bg-blue-500/10" },
          { label: "Under Review", val: "140", desc: "Awaiting TPO check", color: "text-amber-600 bg-amber-500/10" },
          { label: "Approved Applications", val: "310", desc: "Shortlisted", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Rejected Applications", val: "70", desc: "Ineligible / Withdrawn", color: "text-rose-600 bg-rose-500/10" },
          { label: "Verified ATS Resumes", val: "480", desc: "Score ≥80%", color: "text-purple-600 bg-purple-500/10" },
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

      {/* SEARCH & FILTERS BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by student name, roll number, or company..."
              className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Review Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* APPLICATIONS TABLE DIRECTORY */}
      <Panel title="Candidate Placement Applications Ledger">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">App ID & Candidate</th>
                <th className="p-3">Target Company & Role</th>
                <th className="p-3 text-center">CGPA</th>
                <th className="p-3 text-center">ATS Score</th>
                <th className="p-3">Applied Date</th>
                <th className="p-3">TPO Review Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {filteredApps.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-border">
                        <AvatarImage src={a.avatar} />
                        <AvatarFallback>{a.studentName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground text-xs">{a.studentName}</p>
                        <span className="text-[0.65rem] font-mono text-primary font-bold">{a.appNo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono">
                    <p className="font-bold text-foreground">{a.company}</p>
                    <span className="text-[0.68rem] text-muted-foreground">{a.role}</span>
                  </td>
                  <td className="p-3 text-center font-mono font-extrabold text-foreground">{a.cgpa}</td>
                  <td className="p-3 text-center font-mono font-bold text-purple-600">⭐ {a.atsScore}%</td>
                  <td className="p-3 font-mono">{a.appliedDate}</td>
                  <td className="p-3">
                    <Badge className={a.reviewStatus === "Approved" ? "bg-emerald-500/10 text-emerald-600" : a.reviewStatus === "Under Review" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}>
                      {a.reviewStatus}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleApproveApp(a.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 text-xs rounded-xl cursor-pointer"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedApp(a);
                          setIsDrawerOpen(true);
                        }}
                        className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* APPLICATION DETAILS DRAWER */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto space-y-4">
          {selectedApp && (
            <>
              <SheetHeader className="pb-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border border-border">
                    <AvatarImage src={selectedApp.avatar} />
                    <AvatarFallback>{selectedApp.studentName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-base font-extrabold">{selectedApp.studentName}</SheetTitle>
                    <SheetDescription className="text-xs font-semibold text-primary">
                      {selectedApp.appNo} • {selectedApp.company}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="p-4 bg-muted/30 rounded-xl space-y-2 border border-border/50 text-xs font-mono">
                <p><span className="font-sans text-muted-foreground">Target Role:</span> {selectedApp.role}</p>
                <p><span className="font-sans text-muted-foreground">Cumulative CGPA:</span> {selectedApp.cgpa} / 10</p>
                <p><span className="font-sans text-muted-foreground">ATS Match Score:</span> ⭐ {selectedApp.atsScore}%</p>
                <p><span className="font-sans text-muted-foreground">Application Status:</span> {selectedApp.reviewStatus}</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button size="sm" onClick={() => handleApproveApp(selectedApp.id)} className="w-full bg-emerald-600 text-white font-bold h-9 rounded-xl cursor-pointer">
                  Approve Application
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleRejectApp(selectedApp.id)} className="w-full font-bold h-9 rounded-xl cursor-pointer">
                  Reject Application
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
