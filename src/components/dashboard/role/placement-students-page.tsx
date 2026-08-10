import { useState, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Filter,
  RefreshCw,
  Download,
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  SlidersHorizontal,
  FileText,
  Building,
  Award,
  Sparkles,
  ShieldCheck,
  Check,
  Zap,
  RotateCcw,
  UserCheck,
  X,
  BadgeAlert,
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

export interface StudentPlacementRecord {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  cgpa: number;
  backlogs: number;
  atsScore: number;
  eligibilityStatus: "Eligible" | "Ineligible" | "Blocked (Fee Dues)";
  placementStatus: "Placed" | "Unplaced" | "In Interview Stage";
  companyName?: string;
  ctcPackage?: string;
  avatar: string;
}

const INITIAL_STUDENTS_LIST: StudentPlacementRecord[] = [
  {
    id: "STU-101",
    name: "Aditya Sharma",
    rollNo: "2022CSE188",
    department: "CSE",
    cgpa: 9.2,
    backlogs: 0,
    atsScore: 94,
    eligibilityStatus: "Eligible",
    placementStatus: "Placed",
    companyName: "Google Cloud India",
    ctcPackage: "₹32.0 LPA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "STU-102",
    name: "Rohan Varma",
    rollNo: "2022CSE104",
    department: "CSE",
    cgpa: 8.9,
    backlogs: 0,
    atsScore: 91,
    eligibilityStatus: "Eligible",
    placementStatus: "In Interview Stage",
    companyName: "Google Cloud India",
    ctcPackage: "₹24.0 LPA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "STU-103",
    name: "Sneha Reddy",
    rollNo: "2022ECE042",
    department: "ECE",
    cgpa: 8.4,
    backlogs: 0,
    atsScore: 88,
    eligibilityStatus: "Eligible",
    placementStatus: "In Interview Stage",
    companyName: "Microsoft",
    ctcPackage: "₹18.0 LPA",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "STU-104",
    name: "Pooja Hegde",
    rollNo: "2022ECE012",
    department: "ECE",
    cgpa: 8.8,
    backlogs: 0,
    atsScore: 86,
    eligibilityStatus: "Eligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "STU-105",
    name: "Kavya Patel",
    rollNo: "2022EEE015",
    department: "EEE",
    cgpa: 7.2,
    backlogs: 1,
    atsScore: 78,
    eligibilityStatus: "Ineligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "STU-106",
    name: "Manish Kumar",
    rollNo: "2022ME090",
    department: "ME",
    cgpa: 6.8,
    backlogs: 2,
    atsScore: 65,
    eligibilityStatus: "Blocked (Fee Dues)",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

export function PlacementStudentsWorkspace() {
  const [students, setStudents] = useState<StudentPlacementRecord[]>(INITIAL_STUDENTS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [eligibilityFilter, setEligibilityFilter] = useState("All");
  const [placementFilter, setPlacementFilter] = useState("All");
  const [cgpaCutoffFilter, setCgpaCutoffFilter] = useState<number>(0);
  const [backlogFilter, setBacklogFilter] = useState<string>("All");

  const [selectedStudent, setSelectedStudent] = useState<StudentPlacementRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRefreshEligibility = () => {
    toast.success("Refreshed placement eligibility rules across student profiles.");
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Search Query
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.companyName && s.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Department / Branch
      const matchesDept = deptFilter === "All" || s.department === deptFilter;

      // 3. Eligibility Status
      const matchesElig = eligibilityFilter === "All" || s.eligibilityStatus === eligibilityFilter;

      // 4. Placement Status
      const matchesPlacement = placementFilter === "All" || s.placementStatus === placementFilter;

      // 5. CGPA Cutoff
      const matchesCgpa = cgpaCutoffFilter === 0 || s.cgpa >= cgpaCutoffFilter;

      // 6. Backlog Filter
      const matchesBacklog =
        backlogFilter === "All" ||
        (backlogFilter === "ZERO" && s.backlogs === 0) ||
        (backlogFilter === "MAX_1" && s.backlogs <= 1);

      return matchesSearch && matchesDept && matchesElig && matchesPlacement && matchesCgpa && matchesBacklog;
    });
  }, [
    students,
    searchQuery,
    deptFilter,
    eligibilityFilter,
    placementFilter,
    cgpaCutoffFilter,
    backlogFilter,
  ]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    deptFilter !== "All" ||
    eligibilityFilter !== "All" ||
    placementFilter !== "All" ||
    cgpaCutoffFilter > 0 ||
    backlogFilter !== "All";

  const resetFilters = () => {
    setSearchQuery("");
    setDeptFilter("All");
    setEligibilityFilter("All");
    setPlacementFilter("All");
    setCgpaCutoffFilter(0);
    setBacklogFilter("All");
    toast.success("Reset student directory filters!");
  };

  return (
    <div className="space-y-6 font-sans animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-blue-600 text-white grid place-items-center font-extrabold text-2xl shadow-md shrink-0">
              <GraduationCap className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white font-mono text-[0.7rem]">
                  Institutional Placement Registry
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  1,250 Registered Students
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Student Placement Directory &amp; Automated Eligibility Engine
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Manage candidate eligibility criteria, ATS resume scores, policy overrides, and branch placement status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleRefreshEligibility}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5 shadow-xs"
            >
              <RefreshCw className="size-4" /> Refresh Eligibility
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Exported Student Directory CSV")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Directory CSV
            </Button>
          </div>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        {[
          { label: "Total Students", val: `${students.length}`, desc: "Batch 2026", color: "text-blue-600 bg-blue-500/10" },
          { label: "Eligible Students", val: `${students.filter(s => s.eligibilityStatus === "Eligible").length}`, desc: "Qualified", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Placed Candidates", val: `${students.filter(s => s.placementStatus === "Placed").length}`, desc: "Offers Secured", color: "text-purple-600 bg-purple-500/10" },
          { label: "In Interview Stage", val: `${students.filter(s => s.placementStatus === "In Interview Stage").length}`, desc: "Active Drives", color: "text-amber-600 bg-amber-500/10" },
          { label: "Blocked / Ineligible", val: `${students.filter(s => s.eligibilityStatus !== "Eligible").length}`, desc: "Policy Holds", color: "text-rose-600 bg-rose-500/10" },
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

      {/* MULTI-CRITERION STUDENT DIRECTORY SMART FILTER PANEL */}
      <div className="bg-card rounded-3xl border border-border p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-blue-600" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground font-mono">
              Placement Officer Student Filter Engine
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-sans text-xs">
          {/* 1. Search */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Search Student / Roll No:</label>
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Student Name, Roll No..."
                className="h-9 text-xs pl-8 rounded-xl bg-background border-input font-sans"
              />
            </div>
          </div>

          {/* 2. Branch */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Branch / Department:</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
            </select>
          </div>

          {/* 3. Eligibility */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Eligibility Status:</label>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
            >
              <option value="All">All Eligibility Statuses</option>
              <option value="Eligible">Eligible ✓</option>
              <option value="Ineligible">Ineligible ✕</option>
              <option value="Blocked (Fee Dues)">Blocked (Fee Dues)</option>
            </select>
          </div>

          {/* 4. Placement Status */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Placement Status:</label>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed 🎉</option>
              <option value="In Interview Stage">In Interview Stage ⏳</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>

          {/* 5. CGPA Cutoff */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Min CGPA Threshold:</label>
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
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs font-mono">
            <span className="text-[0.68rem] text-muted-foreground font-bold">Active Filters:</span>

            {deptFilter !== "All" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 gap-1 rounded-lg">
                Branch: {deptFilter}
                <X className="size-3 cursor-pointer" onClick={() => setDeptFilter("All")} />
              </Badge>
            )}

            {eligibilityFilter !== "All" && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 rounded-lg">
                Eligibility: {eligibilityFilter}
                <X className="size-3 cursor-pointer" onClick={() => setEligibilityFilter("All")} />
              </Badge>
            )}

            {placementFilter !== "All" && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 gap-1 rounded-lg">
                Placement: {placementFilter}
                <X className="size-3 cursor-pointer" onClick={() => setPlacementFilter("All")} />
              </Badge>
            )}

            {cgpaCutoffFilter > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200 gap-1 rounded-lg">
                CGPA: &ge; {cgpaCutoffFilter}
                <X className="size-3 cursor-pointer" onClick={() => setCgpaCutoffFilter(0)} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* STUDENT DIRECTORY ROSTER */}
      <Panel title={`Student Directory Roster (${filteredStudents.length} Students)`}>
        <div className="space-y-4 pt-1 font-mono text-xs">
          {filteredStudents.length === 0 ? (
            <div className="p-10 text-center bg-card rounded-2xl border border-dashed text-muted-foreground font-sans space-y-2">
              <BadgeAlert className="size-8 mx-auto text-amber-500" />
              <p className="font-bold text-sm">No student matches the active filter criteria.</p>
              <Button size="sm" variant="outline" onClick={resetFilters} className="mt-2 text-xs font-bold rounded-xl">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-2xs hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="size-12 rounded-full object-cover border-2 border-blue-500 shadow-2xs shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-foreground font-sans">{student.name}</h4>
                        <p className="text-xs font-mono text-primary font-bold">
                          {student.rollNo} ({student.department})
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground font-mono">CGPA: {student.cgpa} • Backlogs: {student.backlogs}</p>
                      </div>
                    </div>

                    <Badge
                      className={
                        student.eligibilityStatus === "Eligible"
                          ? "bg-emerald-600 text-white"
                          : student.eligibilityStatus === "Ineligible"
                          ? "bg-amber-600 text-white"
                          : "bg-rose-600 text-white"
                      }
                    >
                      {student.eligibilityStatus}
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/70 flex items-center justify-between text-xs font-sans">
                    <div>
                      <span className="text-[0.68rem] text-muted-foreground block font-mono">Placement Status:</span>
                      <p className="font-bold text-foreground">{student.placementStatus}</p>
                      {student.companyName && (
                        <p className="text-blue-600 font-bold text-[0.7rem]">{student.companyName} ({student.ctcPackage})</p>
                      )}
                    </div>

                    <Badge variant="outline" className="font-mono text-[0.7rem] bg-background">
                      ATS Score: {student.atsScore}%
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[0.68rem] text-muted-foreground font-sans">
                    <span>ID: {student.id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsDrawerOpen(true);
                      }}
                      className="h-7 text-[0.68rem] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 rounded-lg cursor-pointer gap-1"
                    >
                      <Eye className="size-3" /> View Credentials
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* STUDENT DRAWER */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md font-sans">
          <SheetHeader>
            <SheetTitle>Student Credentials &amp; Verification</SheetTitle>
            <SheetDescription>Detailed academic history &amp; placement status.</SheetDescription>
          </SheetHeader>

          {selectedStudent && (
            <div className="mt-6 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl border">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="size-14 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h3 className="font-bold text-base text-foreground font-sans">{selectedStudent.name}</h3>
                  <p className="text-xs text-primary font-bold">{selectedStudent.rollNo} ({selectedStudent.department})</p>
                  <p className="text-[0.68rem] text-muted-foreground">ID: {selectedStudent.id}</p>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-card rounded-2xl border">
                <p className="font-bold text-foreground font-sans">Academic Breakdown:</p>
                <p className="text-muted-foreground">Cumulative CGPA: <strong className="text-emerald-600">{selectedStudent.cgpa}</strong></p>
                <p className="text-muted-foreground">Active Backlogs: <strong className="text-foreground">{selectedStudent.backlogs}</strong></p>
                <p className="text-muted-foreground">ATS Resume Match: <strong className="text-purple-600">{selectedStudent.atsScore}%</strong></p>
                <p className="text-muted-foreground">Eligibility Status: <strong className="text-blue-600">{selectedStudent.eligibilityStatus}</strong></p>
              </div>

              {selectedStudent.companyName && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1 font-sans">
                  <p className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">Placed Corporate Record:</p>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Company: <strong>{selectedStudent.companyName}</strong> ({selectedStudent.ctcPackage})
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
