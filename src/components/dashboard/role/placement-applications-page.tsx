import { useState, useMemo } from "react";
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
  SlidersHorizontal,
  RotateCcw,
  BadgeAlert,
  UserCheck,
  Building2,
  Percent,
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
import { CompanyRoleEligibilityCards } from "@/components/dashboard/placement/company-eligibility-cards";

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
  {
    id: "APP-105",
    appNo: "APP-2026-TCS-01",
    studentName: "Karthik Rao",
    rollNo: "2022ECE088",
    department: "ECE",
    company: "TCS (Tata Consultancy Services)",
    role: "Digital Developer",
    cgpa: 8.1,
    atsScore: 84,
    reviewStatus: "Approved",
    appliedDate: "2026-08-04",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "APP-106",
    appNo: "APP-2026-INF-01",
    studentName: "Divya Sree",
    rollNo: "2022INF012",
    department: "IT",
    company: "Infosys Limited",
    role: "Specialist Programmer",
    cgpa: 9.0,
    atsScore: 92,
    reviewStatus: "Approved",
    appliedDate: "2026-08-04",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "APP-107",
    appNo: "APP-2026-ACN-01",
    studentName: "Meera Nair",
    rollNo: "2022IT044",
    department: "IT",
    company: "Accenture Solutions",
    role: "Advanced ASE",
    cgpa: 7.9,
    atsScore: 82,
    reviewStatus: "Under Review",
    appliedDate: "2026-08-05",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
];

export function PlacementApplicationsWorkspace() {
  const [activeTab, setActiveTab] = useState<"applications" | "company-segregation">("applications");
  const [applications, setApplications] = useState<CandidateApplication[]>(INITIAL_APPLICATIONS);

  // Multi-Criterion Placement Officer Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [cgpaCutoffFilter, setCgpaCutoffFilter] = useState<number>(0);
  const [atsScoreCutoffFilter, setAtsScoreCutoffFilter] = useState<number>(0);

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

  // Multi-Filter Pipeline
  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      // 1. Keyword search
      const matchesSearch =
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status filter
      const matchesStatus = statusFilter === "All" || a.reviewStatus === statusFilter;

      // 3. Company filter
      const matchesCompany = companyFilter === "All" || a.company === companyFilter;

      // 4. Department filter
      const matchesDept = deptFilter === "All" || a.department === deptFilter;

      // 5. CGPA Cut-off
      const matchesCgpa = cgpaCutoffFilter === 0 || a.cgpa >= cgpaCutoffFilter;

      // 6. ATS Score Cut-off
      const matchesAts = atsScoreCutoffFilter === 0 || a.atsScore >= atsScoreCutoffFilter;

      return matchesSearch && matchesStatus && matchesCompany && matchesDept && matchesCgpa && matchesAts;
    });
  }, [
    applications,
    searchQuery,
    statusFilter,
    companyFilter,
    deptFilter,
    cgpaCutoffFilter,
    atsScoreCutoffFilter,
  ]);

  // Analytics for active filter
  const filterAnalytics = useMemo(() => {
    if (filteredApps.length === 0) return { avgCgpa: 0, avgAts: 0, approvedCount: 0 };
    const totalCgpa = filteredApps.reduce((acc, a) => acc + a.cgpa, 0);
    const totalAts = filteredApps.reduce((acc, a) => acc + a.atsScore, 0);
    const approvedCount = filteredApps.filter((a) => a.reviewStatus === "Approved").length;

    return {
      avgCgpa: (totalCgpa / filteredApps.length).toFixed(2),
      avgAts: Math.round(totalAts / filteredApps.length),
      approvedCount,
    };
  }, [filteredApps]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "All" ||
    companyFilter !== "All" ||
    deptFilter !== "All" ||
    cgpaCutoffFilter > 0 ||
    atsScoreCutoffFilter > 0;

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCompanyFilter("All");
    setDeptFilter("All");
    setCgpaCutoffFilter(0);
    setAtsScoreCutoffFilter(0);
    toast.success("Reset all placement officer application filters!");
  };

  return (
    <div className="space-y-6 font-sans animate-fade-up">
      {/* HEADER BANNER WITH TAB SWITCHER */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-blue-600 text-white grid place-items-center font-extrabold text-2xl shadow-md shrink-0">
              <FileCheck2 className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white font-mono text-[0.7rem]">
                  PLACEMENT OFFICER PORTAL
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  520 Total Submitted Applications
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Placement Officer Candidate Review &amp; Segregation Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Review candidate applications, verify ATS resume credentials, approve placement drive shortlists, and segregate by corporate roles.
              </p>
            </div>
          </div>

          {/* VIEW SWITCHER TABS */}
          <div className="flex items-center bg-muted/60 p-1 rounded-2xl border border-border shrink-0">
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "applications"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Applications Ledger
            </button>
            <button
              onClick={() => setActiveTab("company-segregation")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "company-segregation"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Company &amp; Multi-Role Segregation
            </button>
          </div>
        </div>
      </div>

      {activeTab === "company-segregation" ? (
        <CompanyRoleEligibilityCards />
      ) : (
        <>
          {/* KPI DASHBOARD */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {[
              { label: "Total Applications", val: `${applications.length}`, desc: "Submitted Batch", color: "text-blue-600 bg-blue-500/10" },
              { label: "Under Review", val: `${applications.filter(a => a.reviewStatus === "Under Review").length}`, desc: "Awaiting TPO check", color: "text-amber-600 bg-amber-500/10" },
              { label: "Approved Applications", val: `${applications.filter(a => a.reviewStatus === "Approved").length}`, desc: "Shortlisted", color: "text-emerald-600 bg-emerald-500/10" },
              { label: "Rejected Applications", val: `${applications.filter(a => a.reviewStatus === "Rejected").length}`, desc: "Ineligible", color: "text-rose-600 bg-rose-500/10" },
              { label: "High ATS Resumes", val: `${applications.filter(a => a.atsScore >= 85).length}`, desc: "Score ≥85%", color: "text-purple-600 bg-purple-500/10" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-2xl border border-border bg-card space-y-1 shadow-2xs">
                <span className="text-xs font-semibold text-muted-foreground block truncate">{kpi.label}</span>
                <p className="font-display text-2xl font-extrabold">{kpi.val}</p>
                <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-md ${kpi.color}`}>
                  {kpi.desc}
                </span>
              </div>
            ))}
          </div>

          {/* PLACEMENT OFFICER MULTI-CRITERION SMART FILTERS CONTROL PANEL */}
          <div className="bg-card rounded-3xl border border-border p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-blue-600" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground font-mono">
                  Placement Officer Smart Candidate Filter Engine
                </h3>
              </div>

              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetFilters}
                  className="h-7 text-[0.68rem] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg gap-1 cursor-pointer"
                >
                  <RotateCcw className="size-3" /> Reset All Filters
                </Button>
              )}
            </div>

            {/* FILTER DROPDOWNS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-sans text-xs">
              {/* 1. Search Bar */}
              <div className="space-y-1">
                <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Search Candidate / Company:</label>
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, Roll No, Company..."
                    className="h-9 text-xs pl-8 rounded-xl bg-background border-input font-sans"
                  />
                </div>
              </div>

              {/* 2. Review Status Filter */}
              <div className="space-y-1">
                <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Review Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
                >
                  <option value="All">All Review Statuses</option>
                  <option value="Approved">Approved ✓</option>
                  <option value="Under Review">Under Review ⏳</option>
                  <option value="Rejected">Rejected ✕</option>
                </select>
              </div>

              {/* 3. Company Filter */}
              <div className="space-y-1">
                <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Target Company:</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
                >
                  <option value="All">All Target Companies</option>
                  <option value="Google Cloud India">Google Cloud India</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon AWS">Amazon AWS</option>
                  <option value="TCS (Tata Consultancy Services)">TCS</option>
                  <option value="Infosys Limited">Infosys</option>
                  <option value="Accenture Solutions">Accenture</option>
                </select>
              </div>

              {/* 4. CGPA Cut-off Filter */}
              <div className="space-y-1">
                <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">CGPA Cut-off:</label>
                <select
                  value={cgpaCutoffFilter}
                  onChange={(e) => setCgpaCutoffFilter(Number(e.target.value))}
                  className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
                >
                  <option value={0}>All CGPA Scores</option>
                  <option value={8.5}>Top Tier (&ge; 8.5 CGPA)</option>
                  <option value={7.5}>Mid Tier (&ge; 7.5 CGPA)</option>
                  <option value={6.5}>Passing (&ge; 6.5 CGPA)</option>
                </select>
              </div>

              {/* 5. ATS Resume Score Filter */}
              <div className="space-y-1">
                <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">ATS Resume Score:</label>
                <select
                  value={atsScoreCutoffFilter}
                  onChange={(e) => setAtsScoreCutoffFilter(Number(e.target.value))}
                  className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
                >
                  <option value={0}>All ATS Scores</option>
                  <option value={90}>High Match (&ge; 90% ATS)</option>
                  <option value={85}>Good Match (&ge; 85% ATS)</option>
                  <option value={80}>Qualified (&ge; 80% ATS)</option>
                </select>
              </div>
            </div>

            {/* ACTIVE FILTER CHIPS & CLEAR BUTTON */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs font-mono">
                <span className="text-[0.68rem] text-muted-foreground font-bold">Active Filters:</span>

                {statusFilter !== "All" && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 gap-1 rounded-lg">
                    Status: {statusFilter}
                    <X className="size-3 cursor-pointer" onClick={() => setStatusFilter("All")} />
                  </Badge>
                )}

                {companyFilter !== "All" && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 gap-1 rounded-lg">
                    Company: {companyFilter}
                    <X className="size-3 cursor-pointer" onClick={() => setCompanyFilter("All")} />
                  </Badge>
                )}

                {deptFilter !== "All" && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 rounded-lg">
                    Branch: {deptFilter}
                    <X className="size-3 cursor-pointer" onClick={() => setDeptFilter("All")} />
                  </Badge>
                )}

                {cgpaCutoffFilter > 0 && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200 gap-1 rounded-lg">
                    CGPA: &ge; {cgpaCutoffFilter}
                    <X className="size-3 cursor-pointer" onClick={() => setCgpaCutoffFilter(0)} />
                  </Badge>
                )}

                {atsScoreCutoffFilter > 0 && (
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-200 gap-1 rounded-lg">
                    ATS Score: &ge; {atsScoreCutoffFilter}%
                    <X className="size-3 cursor-pointer" onClick={() => setAtsScoreCutoffFilter(0)} />
                  </Badge>
                )}

                {searchQuery.trim() && (
                  <Badge variant="secondary" className="bg-muted text-foreground gap-1 rounded-lg">
                    Search: "{searchQuery}"
                    <X className="size-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* REAL-TIME FILTER ANALYTICS BAR */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-foreground">
                Filter Results: <strong>{filteredApps.length} Applications Matched</strong> (out of {applications.length} total)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[0.7rem] text-muted-foreground">
              <span>Avg CGPA: <strong className="text-emerald-600">{filterAnalytics.avgCgpa}</strong></span>
              <span>Avg ATS Match: <strong className="text-purple-600">{filterAnalytics.avgAts}% Score</strong></span>
              <span>Approved Ratio: <strong className="text-blue-600">{filterAnalytics.approvedCount} / {filteredApps.length}</strong></span>
              <Button
                size="sm"
                onClick={() => toast.info(`Exporting ${filteredApps.length} candidate applications CSV`)}
                className="h-7 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1"
              >
                <Download className="size-3" /> Export CSV
              </Button>
            </div>
          </div>

          {/* APPLICATIONS ROSTER TABLE */}
          <Panel title={`Candidate Applications Ledger (${filteredApps.length} Records)`}>
            <div className="space-y-4 pt-1">
              {filteredApps.length === 0 ? (
                <div className="p-10 text-center bg-card rounded-2xl border border-dashed text-muted-foreground font-sans space-y-2">
                  <BadgeAlert className="size-8 mx-auto text-amber-500" />
                  <p className="font-bold text-sm">No application matches your filter criteria.</p>
                  <p className="text-xs text-muted-foreground">Click <strong>Reset All Filters</strong> to restore the applications ledger.</p>
                  <Button size="sm" variant="outline" onClick={resetFilters} className="mt-2 text-xs font-bold rounded-xl">
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-2xs hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.avatar}
                            alt={app.studentName}
                            className="size-12 rounded-full object-cover border-2 border-blue-500 shadow-2xs shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-foreground font-sans">{app.studentName}</h4>
                            <p className="text-xs font-mono text-primary font-bold">
                              {app.rollNo} ({app.department})
                            </p>
                            <p className="text-[0.68rem] text-muted-foreground font-mono">App ID: {app.appNo}</p>
                          </div>
                        </div>

                        <Badge
                          className={
                            app.reviewStatus === "Approved"
                              ? "bg-emerald-600 text-white"
                              : app.reviewStatus === "Under Review"
                              ? "bg-amber-600 text-white"
                              : "bg-rose-600 text-white"
                          }
                        >
                          {app.reviewStatus}
                        </Badge>
                      </div>

                      <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-1 font-sans text-xs">
                        <p className="font-bold text-foreground">{app.company}</p>
                        <p className="text-muted-foreground text-[0.72rem]">Role: {app.role}</p>
                        <div className="flex items-center justify-between pt-1 font-mono text-[0.7rem]">
                          <span className="font-bold text-emerald-600">CGPA: {app.cgpa}</span>
                          <span className="font-bold text-purple-600">ATS Resume Match: {app.atsScore}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60">
                        <span className="text-[0.68rem] text-muted-foreground">Applied: {app.appliedDate}</span>

                        <div className="flex items-center gap-2">
                          {app.reviewStatus !== "Approved" && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveApp(app.id)}
                              className="h-7 text-[0.65rem] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 cursor-pointer gap-1"
                            >
                              <Check className="size-3" /> Approve
                            </Button>
                          )}
                          {app.reviewStatus !== "Rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectApp(app.id)}
                              className="h-7 text-[0.65rem] font-bold border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg px-2.5 cursor-pointer gap-1"
                            >
                              <X className="size-3" /> Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
