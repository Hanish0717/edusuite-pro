import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Users,
  Search,
  Download,
  CheckCircle2,
  FileText,
  Briefcase,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Crown,
  Code2,
  GraduationCap,
  BadgeAlert,
  ShieldCheck,
  Building,
  CheckCircle,
  Filter,
  UserCheck,
  RotateCcw,
  SlidersHorizontal,
  X,
  TrendingUp,
  Percent,
  Check,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  SHARED_STUDENT_DRIVE_APPLICATIONS,
  type StudentDriveApplication,
} from "@/lib/shared-assessment-store";
import { toast } from "sonner";

export interface CompanyRoleOffer {
  roleName: string;
  ctc: string;
  minCgpaOrPercent: number;
  eligibleBranches: string[];
  description: string;
  tierBadgeColor: string;
  icon: "code" | "sparkles" | "crown" | "briefcase";
}

export interface CompanyEligibilityData {
  companyId: string;
  companyName: string;
  logo: string;
  industry: string;
  headquarters: string;
  minGeneralCgpa: number;
  driveDate: string;
  badgeColor: string;
  roles: CompanyRoleOffer[];
}

export const MASTER_ELIGIBILITY_COMPANIES: CompanyEligibilityData[] = [
  {
    companyId: "COMP-GGL",
    companyName: "Google Cloud India",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80",
    industry: "Cloud & Internet Giant",
    headquarters: "Bengaluru / Mountain View",
    minGeneralCgpa: 8.0,
    driveDate: "2026-08-22",
    badgeColor: "from-emerald-600 to-teal-700",
    roles: [
      {
        roleName: "Cloud SDE I",
        ctc: "₹32.00 LPA",
        minCgpaOrPercent: 85,
        eligibleBranches: ["CSE", "CSM", "CSD", "IT"],
        description: "Core backend engineering in Go/C++, Kubernetes container orchestration & distributed cloud engines.",
        tierBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
        icon: "crown",
      },
      {
        roleName: "DevOps Engineer",
        ctc: "₹24.00 LPA",
        minCgpaOrPercent: 78,
        eligibleBranches: ["CSE", "CSM", "ECE", "IT"],
        description: "Site reliability engineering, CI/CD pipeline automation & VPC cloud network security.",
        tierBadgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
        icon: "code",
      },
      {
        roleName: "AI / ML Solutions",
        ctc: "₹28.00 LPA",
        minCgpaOrPercent: 82,
        eligibleBranches: ["CSE", "CSM", "CSD"],
        description: "Machine Learning model training, PyTorch pipelines, and Vertex AI enterprise deployments.",
        tierBadgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
        icon: "sparkles",
      },
    ],
  },
  {
    companyId: "COMP-TCS",
    companyName: "TCS (Tata Consultancy Services)",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    industry: "IT Services & Consulting",
    headquarters: "Mumbai, India",
    minGeneralCgpa: 6.0,
    driveDate: "2026-08-18",
    badgeColor: "from-blue-600 to-indigo-700",
    roles: [
      {
        roleName: "Ninja",
        ctc: "₹3.36 LPA",
        minCgpaOrPercent: 60,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT", "EEE"],
        description: "Foundation software engineer role for system maintenance, web apps & database support.",
        tierBadgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
        icon: "code",
      },
      {
        roleName: "Digital",
        ctc: "₹7.00 LPA",
        minCgpaOrPercent: 75,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT"],
        description: "Advanced role focused on Cloud Native Development, Full Stack JS, DevOps & Data Pipelines.",
        tierBadgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
        icon: "sparkles",
      },
      {
        roleName: "Prime",
        ctc: "₹11.50 LPA",
        minCgpaOrPercent: 85,
        eligibleBranches: ["CSE", "CSM", "CSD", "IT"],
        description: "Elite R&D engineering tier driving Generative AI, Distributed Systems, and Low-Latency Architecture.",
        tierBadgeColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
        icon: "crown",
      },
    ],
  },
  {
    companyId: "COMP-INFOSYS",
    companyName: "Infosys Limited",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80",
    industry: "Next-Gen Digital Services",
    headquarters: "Bengaluru, India",
    minGeneralCgpa: 6.0,
    driveDate: "2026-08-25",
    badgeColor: "from-sky-600 to-blue-800",
    roles: [
      {
        roleName: "Systems Engineer (SE)",
        ctc: "₹3.60 LPA",
        minCgpaOrPercent: 60,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT", "EEE"],
        description: "Entry-level software engineering role in enterprise application development and QA testing.",
        tierBadgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
        icon: "code",
      },
      {
        roleName: "Differential Engineer (DSE)",
        ctc: "₹6.50 LPA",
        minCgpaOrPercent: 72,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT"],
        description: "Niche developer role specializing in Java Spring Boot, Microservices, and Cloud Native stack.",
        tierBadgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
        icon: "sparkles",
      },
      {
        roleName: "Specialist Programmer (SP)",
        ctc: "₹9.50 LPA",
        minCgpaOrPercent: 80,
        eligibleBranches: ["CSE", "CSM", "CSD", "IT"],
        description: "High-end competitive programming tier for complex algorithmic challenges and AI frameworks.",
        tierBadgeColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
        icon: "crown",
      },
    ],
  },
  {
    companyId: "COMP-ACCN",
    companyName: "Accenture Solutions",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80",
    industry: "Professional Services & IT",
    headquarters: "Dublin / Hyderabad",
    minGeneralCgpa: 6.5,
    driveDate: "2026-08-28",
    badgeColor: "from-blue-600 to-indigo-800",
    roles: [
      {
        roleName: "Associate Software Engineer (ASE)",
        ctc: "₹4.50 LPA",
        minCgpaOrPercent: 65,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT"],
        description: "Application development, software maintenance, enterprise ERP implementations & testing.",
        tierBadgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
        icon: "code",
      },
      {
        roleName: "Advanced ASE",
        ctc: "₹6.50 LPA",
        minCgpaOrPercent: 75,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT"],
        description: "Advanced coding track focused on cloud integration, API gateways, and data engineering.",
        tierBadgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
        icon: "sparkles",
      },
      {
        roleName: "Full Stack Engineer (FSE)",
        ctc: "₹8.50 LPA",
        minCgpaOrPercent: 80,
        eligibleBranches: ["CSE", "CSM", "CSD", "IT"],
        description: "End-to-end web & mobile product development using React, Node.js, GraphQL & Postgres.",
        tierBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
        icon: "crown",
      },
    ],
  },
  {
    companyId: "COMP-WIPRO",
    companyName: "Wipro Technologies",
    logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&auto=format&fit=crop&q=80",
    industry: "Global Information Technology",
    headquarters: "Bengaluru, India",
    minGeneralCgpa: 6.0,
    driveDate: "2026-09-02",
    badgeColor: "from-violet-600 to-purple-800",
    roles: [
      {
        roleName: "Wipro Elite",
        ctc: "₹3.50 LPA",
        minCgpaOrPercent: 60,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT"],
        description: "Software engineering role across telecom, healthcare, and financial services technology.",
        tierBadgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
        icon: "code",
      },
      {
        roleName: "Wipro Turbo",
        ctc: "₹6.50 LPA",
        minCgpaOrPercent: 75,
        eligibleBranches: ["CSE", "CSM", "CSD", "ECE", "IT"],
        description: "High-performing developer track for cloud migration, cybersecurity & modern web stacks.",
        tierBadgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
        icon: "sparkles",
      },
      {
        roleName: "Wipro Star",
        ctc: "₹10.00 LPA",
        minCgpaOrPercent: 85,
        eligibleBranches: ["CSE", "CSM", "CSD", "IT"],
        description: "Top-tier innovator role building enterprise AI models and cloud architecture solutions.",
        tierBadgeColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
        icon: "crown",
      },
    ],
  },
];

function isStudentEligibleForRole(student: StudentDriveApplication, role: CompanyRoleOffer): boolean {
  const cutoff = role.minCgpaOrPercent;
  const tenthOk = student.tenthPercentage >= cutoff - 5;
  let higherEduMarks = 0;
  if (student.qualificationStream === "Intermediate" && student.interPercentage) {
    higherEduMarks = student.interPercentage;
  } else if (student.qualificationStream === "Diploma" && student.diplomaPercentage) {
    higherEduMarks = student.diplomaPercentage;
  }
  const streamOk = higherEduMarks >= cutoff - 5;
  const branchOk = role.eligibleBranches.includes(student.department);

  return tenthOk && streamOk && branchOk;
}

export interface CompanyRoleEligibilityCardsProps {
  defaultCompanyId?: string; // e.g. "COMP-GGL" for Google Cloud Recruiter
  allowCompanySwitching?: boolean; // true for Placement Officer (TPO), false for Recruiter
}

export function CompanyRoleEligibilityCards({
  defaultCompanyId = "COMP-GGL",
  allowCompanySwitching = true,
}: CompanyRoleEligibilityCardsProps) {
  // Initialize with default company if provided
  const initialCompany = useMemo(() => {
    return MASTER_ELIGIBILITY_COMPANIES.find((c) => c.companyId === defaultCompanyId) || null;
  }, [defaultCompanyId]);

  const [selectedCompany, setSelectedCompany] = useState<CompanyEligibilityData | null>(initialCompany);
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [streamFilter, setStreamFilter] = useState("ALL");
  const [marksCutoffFilter, setMarksCutoffFilter] = useState<number>(0);

  // Sync initialCompany if defaultCompanyId changes
  useEffect(() => {
    if (defaultCompanyId) {
      const found = MASTER_ELIGIBILITY_COMPANIES.find((c) => c.companyId === defaultCompanyId);
      if (found) setSelectedCompany(found);
    }
  }, [defaultCompanyId]);

  const companyAnalytics = useMemo(() => {
    const map = new Map<
      string,
      {
        totalEligible: number;
        roleCounts: Record<string, number>;
        eligibleStudents: { student: StudentDriveApplication; eligibleRoles: string[] }[];
      }
    >();

    MASTER_ELIGIBILITY_COMPANIES.forEach((comp) => {
      let eligibleList: { student: StudentDriveApplication; eligibleRoles: string[] }[] = [];
      const roleCounts: Record<string, number> = {};

      comp.roles.forEach((r) => {
        roleCounts[r.roleName] = 0;
      });

      SHARED_STUDENT_DRIVE_APPLICATIONS.forEach((student) => {
        const eligibleRoles: string[] = [];
        comp.roles.forEach((r) => {
          if (isStudentEligibleForRole(student, r)) {
            eligibleRoles.push(r.roleName);
            roleCounts[r.roleName] = (roleCounts[r.roleName] || 0) + 1;
          }
        });

        if (eligibleRoles.length > 0) {
          eligibleList.push({ student, eligibleRoles });
        }
      });

      map.set(comp.companyId, {
        totalEligible: eligibleList.length,
        roleCounts,
        eligibleStudents: eligibleList,
      });
    });

    return map;
  }, []);

  const filteredStudents = useMemo(() => {
    if (!selectedCompany) return [];
    const compData = companyAnalytics.get(selectedCompany.companyId);
    if (!compData) return [];

    return compData.eligibleStudents.filter(({ student, eligibleRoles }) => {
      if (activeRoleFilter !== "ALL" && !eligibleRoles.includes(activeRoleFilter)) {
        return false;
      }
      if (deptFilter !== "ALL" && student.department !== deptFilter) {
        return false;
      }
      if (streamFilter !== "ALL" && student.qualificationStream !== streamFilter) {
        return false;
      }
      if (marksCutoffFilter > 0) {
        const higherMarks =
          student.qualificationStream === "Intermediate"
            ? student.interPercentage || 0
            : student.diplomaPercentage || 0;
        if (student.tenthPercentage < marksCutoffFilter || higherMarks < marksCutoffFilter) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = student.studentName.toLowerCase().includes(q);
        const rollMatch = student.rollNo.toLowerCase().includes(q);
        const emailMatch = student.studentEmail.toLowerCase().includes(q);
        const deptMatch = student.department.toLowerCase().includes(q);
        if (!nameMatch && !rollMatch && !emailMatch && !deptMatch) return false;
      }
      return true;
    });
  }, [
    selectedCompany,
    activeRoleFilter,
    deptFilter,
    streamFilter,
    marksCutoffFilter,
    searchQuery,
    companyAnalytics,
  ]);

  const filteredAnalytics = useMemo(() => {
    if (filteredStudents.length === 0) return { avgMarks: 0, interCount: 0, diplomaCount: 0 };
    let sumMarks = 0;
    let interCount = 0;
    let diplomaCount = 0;

    filteredStudents.forEach(({ student }) => {
      const marks =
        student.qualificationStream === "Intermediate"
          ? student.interPercentage || 0
          : student.diplomaPercentage || 0;
      sumMarks += marks;
      if (student.qualificationStream === "Intermediate") interCount++;
      else diplomaCount++;
    });

    return {
      avgMarks: (sumMarks / filteredStudents.length).toFixed(1),
      interCount,
      diplomaCount,
    };
  }, [filteredStudents]);

  const hasActiveFilters =
    activeRoleFilter !== "ALL" ||
    deptFilter !== "ALL" ||
    streamFilter !== "ALL" ||
    marksCutoffFilter > 0 ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setActiveRoleFilter("ALL");
    setDeptFilter("ALL");
    setStreamFilter("ALL");
    setMarksCutoffFilter(0);
    setSearchQuery("");
    toast.success("Reset candidate search filters!");
  };

  const handleExportCSV = () => {
    if (!selectedCompany) return;
    const roleTitle = activeRoleFilter === "ALL" ? "All Roles" : activeRoleFilter;
    const headers =
      "Student Name,Roll No,Department,Email,Phone,Eligible Roles,10th %,Inter/Diploma %,Qualification Stream,Submitted At\n";

    const rows = filteredStudents
      .map(({ student, eligibleRoles }) => {
        const marks =
          student.qualificationStream === "Intermediate"
            ? `${student.interPercentage}%`
            : `${student.diplomaPercentage}%`;
        return `"${student.studentName}","${student.rollNo}","${student.department}","${student.studentEmail}","${student.phone}","${eligibleRoles.join(" | ")}","${student.tenthPercentage}%","${marks}","${student.qualificationStream}","${student.submittedAt}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${selectedCompany.companyName.replace(/\s+/g, "_")}_${roleTitle.replace(/\s+/g, "_")}_Candidates.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredStudents.length} candidate profiles for ${selectedCompany.companyName} (${roleTitle})!`);
  };

  // =========================================================================
  // VIEW 1: ADVANCED RECRUITER CANDIDATE DISCOVERY & FILTERING WORKSPACE
  // =========================================================================
  if (selectedCompany) {
    const compStats = companyAnalytics.get(selectedCompany.companyId);

    return (
      <div className="space-y-6 font-sans animate-in fade-in duration-150">
        {/* TOP BAR NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            {allowCompanySwitching ? (
              <Button
                onClick={() => {
                  setSelectedCompany(null);
                  resetFilters();
                }}
                variant="ghost"
                className="h-9 px-3 text-xs font-bold rounded-xl gap-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ArrowLeft className="size-4" /> Back to All Corporate Directory (TPO Admin View)
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-mono text-[0.68rem] font-bold gap-1 px-2.5 py-1">
                  <Lock className="size-3" /> CORPORATE RECRUITER WORKSPACE
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  Scoped to <strong>{selectedCompany.companyName}</strong> (David Miller)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>Corporate Account</span>
            <span>/</span>
            <span className="font-bold text-foreground">{selectedCompany.companyName}</span>
          </div>
        </div>

        {/* COMPANY HEADER CARD */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={selectedCompany.logo}
              alt={selectedCompany.companyName}
              className="size-16 rounded-2xl object-cover border border-border shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-[0.68rem] bg-muted/60">
                  {selectedCompany.industry}
                </Badge>
                <Badge className="bg-blue-600 text-white font-mono text-[0.68rem] font-bold border-0">
                  {selectedCompany.roles.length} Tiered Roles
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{selectedCompany.companyName}</h1>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Headquarters: {selectedCompany.headquarters} • Cut-off Requirement: Min {selectedCompany.minGeneralCgpa * 10}% Marks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-2xl border border-border/80 shrink-0">
            <div className="text-center font-mono">
              <p className="text-[0.65rem] text-muted-foreground uppercase font-bold">Total Company Pool</p>
              <p className="text-2xl font-black text-blue-600">{compStats?.totalEligible || 0} Candidates</p>
            </div>
          </div>
        </div>

        {/* RECRUITER MULTI-DIMENSIONAL SMART FILTERS CONTROL PANEL */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-blue-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground font-mono">
                {selectedCompany.companyName} Candidate Filter Engine
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

          {/* FILTER DROPDOWNS & CONTROLS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-sans text-xs">
            {/* 1. Keyword Search */}
            <div className="space-y-1">
              <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Candidate Search:</label>
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, Roll No, Email..."
                  className="h-9 text-xs pl-8 rounded-xl bg-background border-input font-sans"
                />
              </div>
            </div>

            {/* 2. Branch / Department Filter */}
            <div className="space-y-1">
              <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Engineering Branch:</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
              >
                <option value="ALL">All Branches (CSE, CSM, ECE...)</option>
                <option value="CSE">CSE (Computer Science)</option>
                <option value="CSM">CSM (AI &amp; Machine Learning)</option>
                <option value="CSD">CSD (Data Science)</option>
                <option value="ECE">ECE (Electronics)</option>
                <option value="IT">IT (Information Tech)</option>
              </select>
            </div>

            {/* 3. Stream Filter */}
            <div className="space-y-1">
              <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Qualification Stream:</label>
              <select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
                className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
              >
                <option value="ALL">All Qualification Streams</option>
                <option value="Intermediate">Intermediate (12th Class)</option>
                <option value="Diploma">Diploma Stream</option>
              </select>
            </div>

            {/* 4. Minimum Academic Marks Cut-off Filter */}
            <div className="space-y-1">
              <label className="text-[0.68rem] font-bold text-muted-foreground font-mono">Academic Score Threshold:</label>
              <select
                value={marksCutoffFilter}
                onChange={(e) => setMarksCutoffFilter(Number(e.target.value))}
                className="w-full h-9 text-xs rounded-xl bg-background border border-input px-3 font-sans"
              >
                <option value={0}>All Passing Marks (&ge; 60%)</option>
                <option value={75}>High Performers (&ge; 75% Marks)</option>
                <option value={85}>Top Performers (&ge; 85% Marks)</option>
                <option value={90}>Exceptional Tier (&ge; 90% Marks)</option>
              </select>
            </div>
          </div>

          {/* ROLE TIER CARDS SELECTION BAR */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="text-[0.68rem] font-bold text-muted-foreground font-mono uppercase tracking-wider block">
              Filter Candidates by {selectedCompany.companyName} Role Tier:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
              <div
                onClick={() => setActiveRoleFilter("ALL")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeRoleFilter === "ALL"
                    ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                    : "bg-background text-foreground border-border hover:border-blue-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs">ALL ROLES</span>
                  <Badge className={activeRoleFilter === "ALL" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"}>
                    {compStats?.totalEligible || 0}
                  </Badge>
                </div>
              </div>

              {selectedCompany.roles.map((role) => {
                const count = compStats?.roleCounts[role.roleName] || 0;
                const isActive = activeRoleFilter === role.roleName;
                return (
                  <div
                    key={role.roleName}
                    onClick={() => setActiveRoleFilter(role.roleName)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? "bg-purple-600 text-white border-purple-600 font-bold shadow-xs"
                        : "bg-background text-foreground border-border hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs uppercase">{role.roleName}</span>
                      <Badge className={isActive ? "bg-white/20 text-white" : "bg-muted text-foreground"}>
                        {role.ctc} ({count})
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS & CLEAR BUTTON */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs font-mono">
              <span className="text-[0.68rem] text-muted-foreground font-bold">Active Filters:</span>

              {activeRoleFilter !== "ALL" && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 gap-1 rounded-lg">
                  Role: {activeRoleFilter}
                  <X className="size-3 cursor-pointer" onClick={() => setActiveRoleFilter("ALL")} />
                </Badge>
              )}

              {deptFilter !== "ALL" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 gap-1 rounded-lg">
                  Branch: {deptFilter}
                  <X className="size-3 cursor-pointer" onClick={() => setDeptFilter("ALL")} />
                </Badge>
              )}

              {streamFilter !== "ALL" && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 rounded-lg">
                  Stream: {streamFilter}
                  <X className="size-3 cursor-pointer" onClick={() => setStreamFilter("ALL")} />
                </Badge>
              )}

              {marksCutoffFilter > 0 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200 gap-1 rounded-lg">
                  Cut-off: &ge; {marksCutoffFilter}% Marks
                  <X className="size-3 cursor-pointer" onClick={() => setMarksCutoffFilter(0)} />
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
              Filter Results: <strong>{filteredStudents.length} Candidates Matched</strong> (out of {compStats?.totalEligible || 0} total)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[0.7rem] text-muted-foreground">
            <span>Avg Marks: <strong className="text-emerald-600">{filteredAnalytics.avgMarks}%</strong></span>
            <span>Stream Split: <strong className="text-purple-600">{filteredAnalytics.interCount} Inter</strong> • <strong className="text-blue-600">{filteredAnalytics.diplomaCount} Diploma</strong></span>
            <Button
              size="sm"
              onClick={handleExportCSV}
              className="h-7 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1"
            >
              <Download className="size-3" /> Export Roster CSV
            </Button>
          </div>
        </div>

        {/* FILTERED CANDIDATE ROSTER GRID */}
        <div className="space-y-3">
          {filteredStudents.length === 0 ? (
            <div className="p-10 text-center bg-card rounded-2xl border border-dashed text-muted-foreground font-sans space-y-2">
              <BadgeAlert className="size-8 mx-auto text-amber-500" />
              <p className="font-bold text-sm">No candidate matches the selected filters.</p>
              <p className="text-xs text-muted-foreground">
                Click <strong>Reset All Filters</strong> to restore candidate roster.
              </p>
              <Button size="sm" variant="outline" onClick={resetFilters} className="mt-2 text-xs font-bold rounded-xl">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {filteredStudents.map(({ student, eligibleRoles }) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-2xs hover:border-blue-400 transition-colors"
                >
                  {/* Student Info Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.passportPhotoUrl}
                        alt={student.studentName}
                        className="size-12 rounded-full object-cover border-2 border-blue-500 shadow-2xs shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-foreground font-sans">{student.studentName}</h4>
                        <p className="text-xs font-mono text-primary font-bold">
                          {student.rollNo} ({student.department})
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground font-mono">
                          {student.studentEmail} • {student.phone}
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-emerald-600 text-white font-mono text-[0.65rem] shrink-0">
                      ✓ {student.qualificationStream}
                    </Badge>
                  </div>

                  {/* Academic Performance Record */}
                  <div className="grid grid-cols-2 gap-2 text-[0.7rem] bg-muted/40 p-2.5 rounded-xl border border-border/60">
                    <div>
                      <span className="text-blue-600 font-bold uppercase text-[0.62rem] block font-sans">
                        10th Class (SSC)
                      </span>
                      <p className="font-bold text-foreground truncate font-sans text-[0.72rem]">{student.tenthSchoolName}</p>
                      <p className="font-extrabold text-emerald-600 text-[0.72rem]">{student.tenthPercentage}% Marks</p>
                    </div>

                    <div>
                      <span className="text-purple-600 font-bold uppercase text-[0.62rem] block font-sans">
                        {student.qualificationStream} Record
                      </span>
                      <p className="font-bold text-foreground truncate font-sans text-[0.72rem]">
                        {student.qualificationStream === "Intermediate"
                          ? student.interCollegeName
                          : student.diplomaCollegeName}
                      </p>
                      <p className="font-extrabold text-purple-600 text-[0.72rem]">
                        {student.qualificationStream === "Intermediate"
                          ? `${student.interPercentage}% Marks`
                          : `${student.diplomaPercentage}% Marks`}
                      </p>
                    </div>
                  </div>

                  {/* Qualified Roles in this Company */}
                  <div className="space-y-1">
                    <span className="text-[0.62rem] uppercase font-bold text-muted-foreground block font-sans">
                      {selectedCompany.companyName} Qualified Roles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {eligibleRoles.map((r) => {
                        const isHighlighted = activeRoleFilter === r;
                        return (
                          <Badge
                            key={r}
                            className={
                              isHighlighted
                                ? "bg-purple-600 text-white font-mono text-[0.65rem] font-bold"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono text-[0.65rem]"
                            }
                          >
                            ✓ {r}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter Validation Explanation Pill */}
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/40 text-[0.65rem] text-emerald-900 dark:text-emerald-300 font-sans flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-600 shrink-0" />
                    <span>
                      Passed all cut-off criteria for <strong>{selectedCompany.companyName}</strong> ({eligibleRoles.join(", ")}).
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[0.68rem] text-muted-foreground">
                    <span className="truncate max-w-[180px]">File: {student.resumeFileName}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        toast.info(`Viewing ${student.studentName}'s resume PDF (${student.resumeFileName})`);
                      }}
                      className="h-7 text-[0.68rem] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 rounded-lg cursor-pointer gap-1"
                    >
                      <FileText className="size-3" /> View Resume PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: MASTER LIST OF ALL ENTERPRISE COMPANY CARDS (TPO ADMIN DIRECTORY VIEW)
  // =========================================================================
  return (
    <div className="space-y-6 font-sans">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-blue-600 text-white font-mono text-[0.65rem] px-2.5 py-0.5 rounded-full">
              PLACEMENT OFFICER (TPO) MASTER DIRECTORY
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Building2 className="size-6 text-blue-600" /> Corporate Partners &amp; Candidate Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select any company below to inspect candidate records segregated by offer role tiers (e.g. <strong>Ninja</strong>, <strong>Digital</strong>, <strong>Prime</strong>).
          </p>
        </div>

        <div className="text-right font-mono text-xs hidden sm:block">
          <p className="text-muted-foreground text-[0.68rem]">Active Corporate Partners</p>
          <p className="font-extrabold text-foreground text-base">{MASTER_ELIGIBILITY_COMPANIES.length} Provisioned Accounts</p>
        </div>
      </div>

      {/* COMPANY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MASTER_ELIGIBILITY_COMPANIES.map((comp) => {
          const compStats = companyAnalytics.get(comp.companyId);
          const totalEligible = compStats?.totalEligible || 0;

          return (
            <div
              key={comp.companyId}
              onClick={() => {
                setSelectedCompany(comp);
                resetFilters();
              }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comp.logo}
                      alt={comp.companyName}
                      className="size-12 rounded-2xl object-cover border border-border shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-tight group-hover:text-blue-600 transition-colors">
                        {comp.companyName}
                      </h3>
                      <p className="text-[0.7rem] text-muted-foreground font-mono mt-0.5">
                        {comp.industry} • {comp.headquarters.split("/")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Eligible Candidates Pill */}
                <div className="flex items-center justify-between bg-muted/40 p-3 rounded-2xl border border-border/80">
                  <span className="text-xs font-bold text-foreground font-sans">Eligible Candidates</span>
                  <Badge className="bg-blue-600 text-white font-mono text-xs px-2.5 py-0.5 rounded-xl font-bold">
                    {totalEligible} Students
                  </Badge>
                </div>

                {/* Role Tiers Offered */}
                <div className="space-y-1.5 font-mono text-xs">
                  <span className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-wider block">
                    Role Tiers Offered ({comp.roles.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.roles.map((role) => {
                      const count = compStats?.roleCounts[role.roleName] || 0;
                      return (
                        <Badge
                          key={role.roleName}
                          variant="secondary"
                          className="bg-muted text-foreground text-[0.68rem] px-2.5 py-1 rounded-xl border border-border flex items-center gap-1 font-mono"
                        >
                          <strong className="font-bold">{role.roleName}</strong>
                          <span className="text-muted-foreground text-[0.62rem]">({role.ctc})</span>
                          <span className="ml-1 bg-blue-600 text-white size-4 rounded-full grid place-items-center text-[0.58rem] font-bold">
                            {count}
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="font-bold text-blue-600 group-hover:underline">
                  Inspect Company Candidates &amp; Roles →
                </span>
                <ChevronRight className="size-4 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
