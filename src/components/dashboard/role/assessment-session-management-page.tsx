import { useState } from "react";
import {
  Code2,
  Search,
  Calendar as CalendarIcon,
  Plus,
  Download,
  Upload,
  Clock,
  Building,
  Users,
  CheckCircle2,
  AlertCircle,
  Play,
  CheckSquare,
  Sparkles,
  RefreshCw,
  Copy,
  Eye,
  Edit,
  XCircle,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  Send,
  Layers,
  Radio,
  UserCheck,
  X,
  Check,
  FileCode,
  Database,
  HelpCircle,
  Award,
  ArrowLeft,
  Lock,
  Briefcase,
  MapPin,
  GraduationCap,
  AlertTriangle,
  FileBadge,
  ShieldCheck,
  FileText,
  Bell,
  Percent,
  ChevronsRight,
  ChevronsLeft,
  History,
  UserPlus,
  UserMinus,
  MessageSquare,
  Shield,
  Monitor,
  Key,
  Shuffle,
  Save,
  Server,
  Terminal,
  Mail,
  Smartphone,
  MessageCircle,
  BellRing,
  SmartphoneNfc,
  CheckCheck,
  Laptop,
  CheckCircle,
  ExternalLink,
  Activity,
  Cpu,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ============================================================================
// MOCK DATA TYPES & SETUP FOR ASSESSMENT SESSION MANAGEMENT & STEPPER WIZARD
// ============================================================================

export interface AssessmentSessionRecord {
  id: string;
  sessionCode: string;
  assessmentName: string;
  company: string;
  companyLogoBg: string;
  placementDrive: string;
  date: string;
  time: string;
  duration: string;
  assignedStudents: number;
  attemptedStudents: number;
  status: "Draft" | "Scheduled" | "Published" | "Live" | "Completed" | "Cancelled";
  progress: number;
  createdBy: string;
  lastUpdated: string;
}

export interface ApprovedAssessment {
  id: string;
  assessmentId: string;
  name: string;
  company: string;
  companyLogoBg: string;
  recruiterName: string;
  assessmentType: "MCQ + Coding + SQL" | "Coding Only" | "Aptitude & MCQ";
  mcqCount: number;
  codingCount: number;
  sqlCount: number;
  duration: string;
  totalMarks: number;
  passingMarks: number;
  createdDate: string;
  approvedDate: string;
  version: string;
  status: "Approved";
}

export interface PlacementDriveRecord {
  id: string;
  driveId: string;
  driveName: string;
  company: string;
  companyLogoBg: string;
  jobRole: string;
  packageCtc: string;
  location: string;
  departments: string[];
  minCgpa: number;
  maxBacklogs: number;
  regDeadline: string;
  assessmentDate: string;
  interviewDate: string;
  expectedHiring: number;
  currentApplications: number;
  eligibleStudentsCount: number;
  status: "Active Registration" | "Assessment Stage" | "Interview Stage" | "Completed";
  progressPct: number;
  driveType: "Campus Recruitment" | "Pool Drive" | "Off-Campus Drive";
  campus: "Main Campus" | "North Extension";
}

export interface CandidateStudentRecord {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  section: string;
  cgpa: number;
  attendancePct: number;
  backlogs: number;
  resumeStatus: "Verified (94%)" | "Verified (88%)" | "Pending Review";
  appStatus: "Applied" | "Not Applied";
  eligibilityStatus: "Eligible" | "Ineligible";
  placementStatus: "Unplaced" | "Placed";
  avatar: string;
  sourceBadge?: "Automatically Assigned" | "Manually Added" | "Policy Exception" | "Recruiter Recommendation" | "Dean Approval";
}

export interface OverrideAuditLog {
  id: string;
  timestamp: string;
  studentName: string;
  action: "Added" | "Removed";
  reason: string;
  approvedBy: string;
  comments: string;
}

export interface ExtraTimeAccommodation {
  id: string;
  studentName: string;
  rollNo: string;
  extraMinutes: number;
  reason: string;
  approvedBy: string;
  status: "Approved";
}

const APPROVED_RECRUITER_ASSESSMENTS: ApprovedAssessment[] = [
  {
    id: "APPROVED-AST-01",
    assessmentId: "AST-2026-GGL-01",
    name: "Google Cloud Aptitude & Coding Round 1",
    company: "Google Cloud India",
    companyLogoBg: "bg-blue-600",
    recruiterName: "David Miller (Staff Recruiter)",
    assessmentType: "MCQ + Coding + SQL",
    mcqCount: 35,
    codingCount: 5,
    sqlCount: 5,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarks: 75,
    createdDate: "2026-07-28",
    approvedDate: "2026-07-30",
    version: "v1.2",
    status: "Approved",
  },
  {
    id: "APPROVED-AST-02",
    assessmentId: "AST-2026-MSF-01",
    name: "Microsoft Software Engineering Assessment",
    company: "Microsoft",
    companyLogoBg: "bg-emerald-600",
    recruiterName: "Satya Nadella HR Team",
    assessmentType: "Coding Only",
    mcqCount: 0,
    codingCount: 6,
    sqlCount: 0,
    duration: "120 Mins",
    totalMarks: 120,
    passingMarks: 90,
    createdDate: "2026-07-29",
    approvedDate: "2026-07-31",
    version: "v2.0",
    status: "Approved",
  },
];

const PLACEMENT_DRIVES_LIST: PlacementDriveRecord[] = [
  {
    id: "DRV-101",
    driveId: "DRV-2026-GGL-01",
    driveName: "Google Cloud SDE Hiring Drive 2026",
    company: "Google Cloud India",
    companyLogoBg: "bg-blue-600",
    jobRole: "Software Engineer I (Cloud Solutions)",
    packageCtc: "₹32.0 LPA",
    location: "Bengaluru / Hyderabad",
    departments: ["CSE", "AI & ML", "ECE"],
    minCgpa: 7.5,
    maxBacklogs: 0,
    regDeadline: "2026-08-05",
    assessmentDate: "2026-08-10",
    interviewDate: "2026-08-15",
    expectedHiring: 25,
    currentApplications: 360,
    eligibleStudentsCount: 320,
    status: "Assessment Stage",
    progressPct: 88.8,
    driveType: "Campus Recruitment",
    campus: "Main Campus",
  },
];

const STEP3_STUDENTS_LIST: CandidateStudentRecord[] = [
  {
    id: "STU-001",
    name: "Aditya Sharma",
    rollNo: "2022CSE188",
    department: "CSE",
    section: "Sec A",
    cgpa: 9.2,
    attendancePct: 94,
    backlogs: 0,
    resumeStatus: "Verified (94%)",
    appStatus: "Applied",
    eligibilityStatus: "Eligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    sourceBadge: "Automatically Assigned",
  },
  {
    id: "STU-002",
    name: "Rohan Varma",
    rollNo: "2022CSE104",
    department: "CSE",
    section: "Sec B",
    cgpa: 8.9,
    attendancePct: 91,
    backlogs: 0,
    resumeStatus: "Verified (94%)",
    appStatus: "Applied",
    eligibilityStatus: "Eligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    sourceBadge: "Automatically Assigned",
  },
  {
    id: "STU-003",
    name: "Sneha Reddy",
    rollNo: "2022ECE042",
    department: "ECE",
    section: "Sec A",
    cgpa: 8.4,
    attendancePct: 88,
    backlogs: 0,
    resumeStatus: "Verified (88%)",
    appStatus: "Applied",
    eligibilityStatus: "Eligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    sourceBadge: "Dean Approval",
  },
  {
    id: "STU-004",
    name: "Pooja Hegde",
    rollNo: "2022ECE012",
    department: "ECE",
    section: "Sec B",
    cgpa: 8.8,
    attendancePct: 89,
    backlogs: 0,
    resumeStatus: "Verified (88%)",
    appStatus: "Applied",
    eligibilityStatus: "Eligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    sourceBadge: "Automatically Assigned",
  },
  {
    id: "STU-005",
    name: "Ashok Dora",
    rollNo: "2022CSE210",
    department: "CSE",
    section: "Sec A",
    cgpa: 7.4,
    attendancePct: 85,
    backlogs: 0,
    resumeStatus: "Verified (88%)",
    appStatus: "Applied",
    eligibilityStatus: "Ineligible",
    placementStatus: "Unplaced",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    sourceBadge: "Manually Added",
  },
];

const INITIAL_SESSIONS_LIST: AssessmentSessionRecord[] = [
  {
    id: "SESS-2026-01",
    sessionCode: "SES-GGL-01",
    assessmentName: "Google Cloud Aptitude & Coding Round 1",
    company: "Google Cloud India",
    companyLogoBg: "bg-blue-600",
    placementDrive: "Google Cloud SDE Hiring Drive 2026",
    date: "2026-08-10",
    time: "10:00 AM – 11:30 AM IST",
    duration: "90 Mins",
    assignedStudents: 360,
    attemptedStudents: 310,
    status: "Live",
    progress: 86.1,
    createdBy: "David Miller (Staff Recruiter)",
    lastUpdated: "2026-08-01 10:30 AM",
  },
];

const SESSION_LIFECYCLE_STAGES = [
  { stage: "All", label: "All Sessions", count: 55, pct: "100%" },
  { stage: "Draft", label: "Draft", count: 4, pct: "7.2%" },
  { stage: "Assessment Selected", label: "Approved Test", count: 24, pct: "43.6%" },
  { stage: "Drive Linked", label: "Drive Linked", count: 24, pct: "43.6%" },
  { stage: "Students Assigned", label: "Assigned", count: 22, pct: "40.0%" },
  { stage: "Scheduled", label: "Scheduled", count: 8, pct: "14.5%" },
  { stage: "Published", label: "Published", count: 12, pct: "21.8%" },
  { stage: "Live", label: "Live Proctored", count: 2, pct: "3.6%" },
  { stage: "Completed", label: "Completed", count: 28, pct: "50.9%" },
];

const STEPPER_ITEMS = [
  { step: 1, label: "Select Assessment" },
  { step: 2, label: "Select Placement Drive" },
  { step: 3, label: "Load Eligible Students" },
  { step: 4, label: "Manual Student Override" },
  { step: 5, label: "Schedule Assessment" },
  { step: 6, label: "Notifications" },
  { step: 7, label: "Preview" },
  { step: 8, label: "Publish" },
];

export function AssessmentSessionManagementWorkspace() {
  const [sessions, setSessions] = useState<AssessmentSessionRecord[]>(INITIAL_SESSIONS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");

  // Multi-Step Wizard States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState(1);

  // Selections
  const [selectedAssessment, setSelectedAssessment] = useState<ApprovedAssessment | null>(
    APPROVED_RECRUITER_ASSESSMENTS[0] || null
  );
  const [selectedDrive, setSelectedDrive] = useState<PlacementDriveRecord | null>(
    PLACEMENT_DRIVES_LIST[0] || null
  );

  // Roster & Timing State
  const [assignedStudentsList] = useState<CandidateStudentRecord[]>(STEP3_STUDENTS_LIST);
  const [assessmentDate] = useState("2026-08-10");
  const [startTime] = useState("10:00 AM");
  const [endTime] = useState("11:30 AM");

  // Handler Functions
  const handlePublishSession = (id: string, name: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Published" } : s))
    );
    toast.success(`Published assessment session "${name}" to assigned students!`);
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.assessmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.placementDrive.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* 1. EXECUTIVE HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <Code2 className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-purple-600 text-white font-mono text-[0.7rem]">
                  ● Recruiter Approved Test Lifecycle
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem] bg-primary/5 text-primary">
                  Enterprise Session Management
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Assessment Session Management
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Create, schedule, publish and monitor assessment sessions for approved recruiter assessments.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => {
                setIsWizardOpen(true);
                setCurrentWizardStep(1);
              }}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Plus className="size-4" /> + Create Assessment Session
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Opening Proctored Assessment Calendar View")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5 font-bold"
            >
              <CalendarIcon className="size-3.5 text-primary" /> Calendar View
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Imported 12 recruiter assessment sessions CSV")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Upload className="size-3.5" /> Import Sessions
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const csvHeader = "Session Code,Assessment Title,Company,Placement Drive,Date,Time,Assigned,Status\n";
                const csvBody = sessions.map((s) => `${s.sessionCode},"${s.assessmentName}","${s.company}","${s.placementDrive}",${s.date},${s.time},${s.assignedStudents},${s.status}`).join("\n");
                const blob = new Blob([csvHeader + csvBody], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "assessment_sessions_ledger.csv";
                a.click();
                toast.success("Exported Assessment Sessions Ledger CSV");
              }}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI DASHBOARD */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
        {[
          { label: "Draft Sessions", val: "4", desc: "Configuration", color: "text-amber-600 bg-amber-500/10" },
          { label: "Scheduled Sessions", val: "8", desc: "Upcoming Slots", color: "text-blue-600 bg-blue-500/10" },
          { label: "Published Sessions", val: "12", desc: "Live on Portal", color: "text-purple-600 bg-purple-500/10" },
          { label: "Live Sessions", val: "2", desc: "Proctoring Now", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Completed Sessions", val: "28", desc: "Graded & Audited", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Cancelled Sessions", val: "1", desc: "Rescheduled", color: "text-rose-600 bg-rose-500/10" },
          { label: "Students Assigned", val: "1,450", desc: "Batch Eligible", color: "text-teal-600 bg-teal-500/10" },
          { label: "Students Attempted", val: "1,280", desc: "Test Taken", color: "text-purple-600 bg-purple-500/10" },
          { label: "Average Attendance", val: "88.2%", desc: "Turnout Ratio", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Pass Percentage", val: "74.5%", desc: "Cutoff Cleared", color: "text-indigo-600 bg-indigo-500/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-3 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs hover:border-primary/50 transition-all">
            <span className="text-[0.62rem] font-semibold text-muted-foreground block truncate">{kpi.label}</span>
            <p className="font-display text-lg font-extrabold truncate">{kpi.val}</p>
            <span className={`text-[0.6rem] font-mono px-1 py-0.5 rounded-md block truncate ${kpi.color}`}>
              {kpi.desc}
            </span>
          </div>
        ))}
      </div>

      {/* 4. SESSION DIRECTORY CARDS VIEW */}
      <Panel title="Assessment Sessions Directory">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-1">
          {filteredSessions.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl border border-border/80 bg-card space-y-4 shadow-xs">
              <h3 className="font-display text-sm font-extrabold leading-tight text-foreground">{s.assessmentName}</h3>
              <p className="text-xs text-muted-foreground">{s.company} • {s.placementDrive}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ========================================================================= */}
      {/* FULL-SCREEN ENTERPRISE MULTI-STEP WIZARD CONTAINER */}
      {/* ========================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-2xl overflow-y-auto flex flex-col justify-between animate-fade-in">
          {/* TOP STEPPER HEADER */}
          <div className="border-b border-border bg-card/90 px-6 py-4 sticky top-0 z-20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-brand-gradient text-white grid place-items-center font-bold text-sm shadow-glow">
                    0{currentWizardStep}
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-foreground">
                      Create Assessment Session Wizard
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground">
                      Step {currentWizardStep} of 8: {STEPPER_ITEMS.find((s) => s.step === currentWizardStep)?.label}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsWizardOpen(false)}
                  className="size-9 rounded-full cursor-pointer hover:bg-muted"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="flex items-center gap-2 min-w-max">
                  {STEPPER_ITEMS.map((st) => (
                    <div
                      key={st.step}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${
                        currentWizardStep === st.step
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-glow"
                          : currentWizardStep > st.step
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                          : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      <span className="size-5 rounded-full bg-background border grid place-items-center text-[0.65rem] font-bold">
                        {st.step}
                      </span>
                      <span>{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* STEP 8 CONTENT: PUBLISHED & LIVE ACTIVATION CENTER */}
          {/* ===================================================================== */}
          {currentWizardStep === 8 && (
            <div className="max-w-7xl mx-auto w-full p-6 sm:p-8 flex-1 space-y-6">
              {/* FULL-SCREEN HERO SUCCESS EXPERIENCE */}
              <div className="p-8 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 text-center space-y-4 backdrop-blur-2xl shadow-glow relative overflow-hidden">
                <div className="size-20 rounded-full bg-emerald-600 text-white grid place-items-center mx-auto shadow-glow font-extrabold text-3xl animate-bounce">
                  ✓
                </div>
                <div className="space-y-1">
                  <Badge className="bg-emerald-600 text-white font-mono text-xs">
                    ● Institutional Session Published & Activated
                  </Badge>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    Assessment Session Published Successfully!
                  </h1>
                  <p className="text-xs text-muted-foreground font-mono max-w-xl mx-auto">
                    The assessment session has been registered in the institutional ledger, candidate hall passes generated, and proctored execution engines armed.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto pt-2 font-mono text-xs text-left bg-card/60 p-4 rounded-2xl border border-emerald-500/30">
                  <div>Session Code: <strong className="text-primary font-bold">SES-GGL-2026-01</strong></div>
                  <div>Session ID: <strong className="text-foreground">SESS-98402</strong></div>
                  <div>Scheduled Target: <strong className="text-purple-600 font-bold">{assessmentDate} ({startTime})</strong></div>
                  <div>Target Candidates: <strong className="text-emerald-600 font-bold">{assignedStudentsList.length} Roster</strong></div>
                </div>
              </div>

              {/* SECTION 1: PUBLICATION SUMMARY BADGES */}
              <Panel title="Section 1: Publication Verification & Execution Summary">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1 font-mono text-xs">
                  {[
                    { label: "Assessment Published", val: "✓ Verified", color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Recruiter Approved", val: "✓ David Miller", color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Drive Linked", val: "✓ Google Cloud 2026", color: "text-blue-600 bg-blue-500/10" },
                    { label: "Students Assigned", val: `${assignedStudentsList.length} Candidates`, color: "text-purple-600 bg-purple-500/10" },
                    { label: "Notifications Scheduled", val: "✓ 7 Stage Timeline", color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Security Lock Enabled", val: "✓ 10 Policies Active", color: "text-purple-600 bg-purple-500/10" },
                    { label: "Labs Allocated", val: "✓ Labs 1–4 Seats", color: "text-teal-600 bg-teal-500/10" },
                    { label: "Ready for Live Test", val: "✓ Proctored Engine", color: "text-emerald-600 bg-emerald-500/10" },
                  ].map((item) => (
                    <div key={item.label} className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1 shadow-xs">
                      <span className="text-[0.68rem] text-muted-foreground font-sans font-bold block">{item.label}</span>
                      <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-md inline-block ${item.color}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* SECTION 6: QUICK LAUNCH CENTER */}
              <Panel title="Section 6: Executive Quick Launch Center">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-1 text-xs">
                  <div
                    onClick={() => {
                      toast.info("Navigating to /placement/live-assessment-monitor");
                    }}
                    className="p-5 rounded-2xl border border-purple-500/40 bg-purple-500/10 space-y-2 cursor-pointer hover:border-purple-500 shadow-glow transition-all"
                  >
                    <Monitor className="size-6 text-purple-600" />
                    <h4 className="font-display text-sm font-extrabold text-foreground">Open Live Monitoring Center</h4>
                    <p className="text-[0.68rem] text-muted-foreground font-mono">Real-time proctoring webcam feeds, browser tab lock flags, and candidate progress.</p>
                  </div>

                  <div
                    onClick={() => {
                      setIsWizardOpen(false);
                      toast.success("Returned to Assessment Session Management Dashboard");
                    }}
                    className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 cursor-pointer hover:border-primary transition-all"
                  >
                    <Layers className="size-6 text-primary" />
                    <h4 className="font-display text-sm font-extrabold text-foreground">View Session Dashboard</h4>
                    <p className="text-[0.68rem] text-muted-foreground font-mono">Return to session directory table and active session cards.</p>
                  </div>

                  <div
                    onClick={() => {
                      toast.success("Exported session attendance roster CSV");
                    }}
                    className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 cursor-pointer hover:border-primary transition-all"
                  >
                    <FileSpreadsheet className="size-6 text-emerald-600" />
                    <h4 className="font-display text-sm font-extrabold text-foreground">Download Attendance Sheet</h4>
                    <p className="text-[0.68rem] text-muted-foreground font-mono">Export printable lab attendance checklist with student roll numbers and QR passes.</p>
                  </div>

                  <div
                    onClick={() => {
                      toast.success("Downloaded complete assessment session audit report PDF");
                    }}
                    className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 cursor-pointer hover:border-primary transition-all"
                  >
                    <Download className="size-6 text-blue-600" />
                    <h4 className="font-display text-sm font-extrabold text-foreground">Download Session Audit PDF</h4>
                    <p className="text-[0.68rem] text-muted-foreground font-mono">Download official signed session ledger with TPO audit waivers.</p>
                  </div>
                </div>
              </Panel>

              {/* SECTION 8: AI EXECUTIVE INSIGHTS */}
              <Panel title="Section 8: AI Executive Intelligence Insights">
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 pt-1 font-mono text-xs">
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                    <span className="font-sans font-bold text-foreground block">Estimated Attendance</span>
                    <span className="text-emerald-600 font-extrabold text-base">96.4% Turnout</span>
                    <p className="text-[0.65rem] text-muted-foreground">Based on historical CSE/ECE test attendance trends.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                    <span className="font-sans font-bold text-foreground block">Network Latency Risk</span>
                    <span className="text-blue-600 font-extrabold text-base">0.2ms Low Latency</span>
                    <p className="text-[0.65rem] text-muted-foreground">Main Campus 10 Gbps LAN fiber active.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                    <span className="font-sans font-bold text-foreground block">Expected Completion</span>
                    <span className="text-purple-600 font-extrabold text-base">11:28 AM IST</span>
                    <p className="text-[0.65rem] text-muted-foreground">Auto-submission countdown armed.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                    <span className="font-sans font-bold text-foreground block">Infrastructure Health</span>
                    <span className="text-emerald-600 font-extrabold text-base">100% Operational</span>
                    <p className="text-[0.65rem] text-muted-foreground">Sandbox compiler containers warm.</p>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {/* BOTTOM FIXED ACTION BAR */}
          <div className="border-t border-border bg-card/90 px-6 py-4 sticky bottom-0 z-20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentWizardStep(1);
                  toast.info("Reset wizard to create another assessment session");
                }}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                + Create Another Session
              </Button>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsWizardOpen(false);
                    toast.success("Returned to Assessment Sessions Workspace");
                  }}
                  className="rounded-xl text-xs font-bold cursor-pointer"
                >
                  Go To Session Dashboard
                </Button>

                <Button
                  onClick={() => {
                    toast.info("Navigating to /placement/live-assessment-monitor");
                  }}
                  className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-5 cursor-pointer gap-1.5"
                >
                  Go To Live Monitoring Center →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
