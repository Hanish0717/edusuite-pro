import { useState } from "react";
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
    placementStatus: "Placed",
    companyName: "Google Cloud India",
    ctcPackage: "₹32.0 LPA",
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
  const [selectedStudent, setSelectedStudent] = useState<StudentPlacementRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRefreshEligibility = () => {
    toast.success("Refreshed placement eligibility rules across 1,250 student profiles.");
  };

  const handleRecalculateRules = () => {
    toast.info("Recalculated CGPA cutoffs and active backlog criteria.");
  };

  const handleExportCSV = () => {
    toast.success("Exported Student Placement Directory CSV.");
  };

  const handleNotifyStudents = () => {
    toast.info("Broadcasted placement updates to eligible student batch.");
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All" || s.department === deptFilter;
    const matchesElig = eligibilityFilter === "All" || s.eligibilityStatus === eligibilityFilter;
    return matchesSearch && matchesDept && matchesElig;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
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
                Student Directory & Automated Eligibility Engine
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Manage candidate eligibility criteria, ATS resume scores, policy overrides, and branch placement status.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS — NO GENERIC "CREATE ITEM" MODAL */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleRefreshEligibility}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <RefreshCw className="size-4" /> Refresh Eligibility
            </Button>
            <Button
              onClick={handleRecalculateRules}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Zap className="size-4" /> Recalculate Rules
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Ledger
            </Button>
            <Button
              variant="outline"
              onClick={handleNotifyStudents}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Bell className="size-3.5" /> Notify Students
            </Button>
          </div>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {[
          { label: "Total Registered", val: "1,250", desc: "Batch 2026", color: "text-blue-600 bg-blue-500/10" },
          { label: "Eligible Candidates", val: "1,080", desc: "CGPA ≥7.5 & 0 Backlogs", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Placed Students", val: "890", desc: "Confirmed Job Offers", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Unplaced Candidates", val: "190", desc: "In Active Placement", color: "text-amber-600 bg-amber-500/10" },
          { label: "Ineligible / Blocked", val: "170", desc: "Backlogs / Dues", color: "text-rose-600 bg-rose-500/10" },
          { label: "Average CGPA", val: "8.2 / 10", desc: "Batch Merit Avg", color: "text-purple-600 bg-purple-500/10" },
          { label: "Avg ATS Resume Score", val: "84.5%", desc: "Verified Resumes", color: "text-teal-600 bg-teal-500/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs">
            <span className="text-[0.65rem] font-semibold text-muted-foreground block truncate">{kpi.label}</span>
            <p className="font-display text-xl font-extrabold">{kpi.val}</p>
            <span className={`text-[0.62rem] font-mono px-1.5 py-0.5 rounded-md ${kpi.color}`}>
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
              placeholder="Search students by candidate name, roll number, or department..."
              className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
            </select>

            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Eligibility Statuses</option>
              <option value="Eligible">Eligible</option>
              <option value="Ineligible">Ineligible</option>
              <option value="Blocked (Fee Dues)">Blocked (Fee Dues)</option>
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT TABLE DIRECTORY */}
      <Panel
        title="Student Placement Directory & Automated Rule Check"
        description="Live eligibility statuses, CGPA cutoffs, active backlogs, and verified ATS resume scores."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Candidate Student</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Dept</th>
                <th className="p-3 text-center">CGPA</th>
                <th className="p-3 text-center">Active Backlogs</th>
                <th className="p-3 text-center">ATS Resume Score</th>
                <th className="p-3">Eligibility Rule Status</th>
                <th className="p-3">Placement Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-border">
                        <AvatarImage src={s.avatar} />
                        <AvatarFallback>{s.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground text-xs">{s.name}</p>
                        <span className="text-[0.65rem] font-mono text-muted-foreground">{s.department}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-primary">{s.rollNo}</td>
                  <td className="p-3 font-mono">{s.department}</td>
                  <td className="p-3 text-center font-mono font-extrabold text-foreground">{s.cgpa}</td>
                  <td className="p-3 text-center font-mono font-bold text-amber-600">{s.backlogs}</td>
                  <td className="p-3 text-center font-mono font-bold text-purple-600">
                    ⭐ {s.atsScore}%
                  </td>
                  <td className="p-3 font-mono">
                    <Badge className={s.eligibilityStatus === "Eligible" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}>
                      {s.eligibilityStatus}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono">
                    <Badge variant="outline" className={s.placementStatus === "Placed" ? "text-emerald-600 border-emerald-500/30" : "text-muted-foreground"}>
                      {s.placementStatus} {s.companyName ? `(${s.companyName})` : ""}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedStudent(s);
                        setIsDrawerOpen(true);
                      }}
                      className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                      title="View Student Placement Profile"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* STUDENT PROFILE SLIDE-OVER DRAWER */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto space-y-4">
          {selectedStudent && (
            <>
              <SheetHeader className="pb-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border border-border">
                    <AvatarImage src={selectedStudent.avatar} />
                    <AvatarFallback>{selectedStudent.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-base font-extrabold">{selectedStudent.name}</SheetTitle>
                    <SheetDescription className="text-xs font-semibold text-primary">
                      {selectedStudent.rollNo} • {selectedStudent.department}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl w-full grid grid-cols-3 text-[0.62rem] font-bold mb-4">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="resume" className="rounded-lg">Resume ATS</TabsTrigger>
                  <TabsTrigger value="academics" className="rounded-lg">Academics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2 border border-border/50 font-mono">
                    <p><span className="font-sans text-muted-foreground">Cumulative CGPA:</span> {selectedStudent.cgpa} / 10</p>
                    <p><span className="font-sans text-muted-foreground">Active Backlogs:</span> {selectedStudent.backlogs}</p>
                    <p><span className="font-sans text-muted-foreground">Eligibility Status:</span> {selectedStudent.eligibilityStatus}</p>
                    <p><span className="font-sans text-muted-foreground">Placement Verdict:</span> {selectedStudent.placementStatus}</p>
                    {selectedStudent.companyName && (
                      <p><span className="font-sans text-muted-foreground">Offered Company:</span> <span className="font-bold text-emerald-600">{selectedStudent.companyName} ({selectedStudent.ctcPackage})</span></p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="resume" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2 border border-border/50 font-mono">
                    <p className="font-bold font-sans text-purple-600">Verified ATS Resume Breakdown</p>
                    <p>• ATS Match Score: {selectedStudent.atsScore}%</p>
                    <p>• Skills Highlighted: Data Structures, C++, Python, SQL, Cloud Architecture</p>
                  </div>
                </TabsContent>

                <TabsContent value="academics" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-1 font-mono text-muted-foreground">
                    <p>• Semester 1: 9.0 CGPA</p>
                    <p>• Semester 2: 9.2 CGPA</p>
                    <p>• Semester 3: 9.4 CGPA</p>
                    <p>• Semester 4: 9.2 CGPA</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
