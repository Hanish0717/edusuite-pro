import { useState } from "react";
import {
  SHARED_ASSESSMENT_REQUESTS,
  getAllStudentSubmissions,
  updateStudentSubmissionRecord,
  type StudentSubmissionRecord,
} from "@/lib/shared-assessment-store";

import {
  Code2,
  Search,
  Calendar,
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
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Brain,
  FileSpreadsheet,
  CheckCheck,
  RotateCcw,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ============================================================================
// MOCK DATA TYPES & RECORDS FOR ASSESSMENT REQUESTS APPROVAL CENTER
// ============================================================================

export type RequestStatus =
  | "Submitted"
  | "Under Review"
  | "Changes Requested"
  | "Resubmitted"
  | "Approved"
  | "Published"
  | "Used in Session"
  | "Rejected";

export type RequestPriority = "High" | "Medium" | "Standard";

export interface McqQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  marks: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface CodingQuestion {
  id: string;
  title: string;
  problemStatement: string;
  languagesAllowed: string[];
  sampleInput: string;
  sampleOutput: string;
  marks: number;
  difficulty: "Medium" | "Hard";
}

export interface SqlQuestion {
  id: string;
  title: string;
  queryTask: string;
  tablesGiven: string;
  expectedColumns: string;
  marks: number;
  difficulty: "Medium";
}

export interface AssessmentRequestRecord {
  id: string;
  assessmentId: string;
  name: string;
  recruiterName: string;
  recruiterEmail: string;
  company: string;
  companyLogoBg: string;
  assessmentType: "MCQ + Coding + SQL" | "Coding Only" | "Aptitude & MCQ";
  mcqCount: number;
  codingCount: number;
  sqlCount: number;
  totalQuestions: number;
  duration: string;
  totalMarks: number;
  passingMarksPct: number;
  submittedDate: string;
  priority: RequestPriority;
  status: RequestStatus;
  version: string;
  expectedCandidates: number;
  programmingLanguages: string[];
  recruiterNotes: string;
  mcqQuestions: McqQuestion[];
  codingQuestions: CodingQuestion[];
  sqlQuestions: SqlQuestion[];
  auditTrail: { timestamp: string; action: string; actor: string; notes: string }[];
  versionHistory: { version: string; date: string; status: string; author: string }[];
}

const INITIAL_ASSESSMENT_REQUESTS: AssessmentRequestRecord[] = [
  {
    id: "REQ-2026-001",
    assessmentId: "AST-2026-GGL-01",
    name: "Google Cloud Aptitude & Coding Round 1",
    recruiterName: "David Miller (Staff Recruiter)",
    recruiterEmail: "david.miller@google.com",
    company: "Google Cloud India",
    companyLogoBg: "bg-blue-600",
    assessmentType: "MCQ + Coding + SQL",
    mcqCount: 35,
    codingCount: 5,
    sqlCount: 5,
    totalQuestions: 45,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarksPct: 75,
    submittedDate: "2026-07-28",
    priority: "High",
    status: "Submitted",
    version: "v1.2",
    expectedCandidates: 360,
    programmingLanguages: ["C++", "Java", "Python 3", "SQL"],
    recruiterNotes: "Assessment covers Distributed Systems, Cloud Architecture MCQs, 5 LeetCode Medium/Hard DSA problems, and PostgreSQL queries.",
    mcqQuestions: [
      { id: "MCQ-01", question: "Which algorithm is used in Google Bigtable for distributed data storage?", options: ["LSM-Tree", "B+ Tree", "Red-Black Tree", "Hash Map"], correctOption: 0, marks: 2, difficulty: "Medium" },
      { id: "MCQ-02", question: "What is the primary consistency model guarantee in Google Spanner?", options: ["Eventual Consistency", "External Consistency (TrueTime)", "Causal Consistency", "Read-Uncommitted"], correctOption: 1, marks: 2, difficulty: "Hard" },
    ],
    codingQuestions: [
      { id: "COD-01", title: "Distributed Cache Eviction LRU-K", problemStatement: "Implement an LRU-K cache eviction strategy with O(1) time complexity per access.", languagesAllowed: ["C++", "Java", "Python"], sampleInput: "Capacity=3, K=2", sampleOutput: "Evicted Node ID 4", marks: 15, difficulty: "Hard" },
    ],
    sqlQuestions: [
      { id: "SQL-01", title: "Highest Revenue Per Cloud Region", queryTask: "Write a SQL query to calculate top 3 revenue-generating cloud zones per region.", tablesGiven: "cloud_billing, regions", expectedColumns: "region_name, zone_id, revenue", marks: 10, difficulty: "Medium" },
    ],
    auditTrail: [
      { timestamp: "2026-07-28 09:30 AM", action: "Created Assessment Request", actor: "David Miller", notes: "Drafted test structure." },
      { timestamp: "2026-07-28 10:15 AM", action: "Submitted for TPO Review", actor: "David Miller", notes: "Submitted for upcoming campus drive." },
    ],
    versionHistory: [
      { version: "v1.0", date: "2026-07-28", status: "Submitted", author: "David Miller" },
      { version: "v1.1", date: "2026-07-29", status: "Under Review", author: "Dr. Anand Sharma" },
      { version: "v1.2", date: "2026-07-30", status: "Submitted", author: "David Miller" },
    ],
  },
  {
    id: "REQ-2026-002",
    assessmentId: "AST-2026-MSF-01",
    name: "Microsoft Software Engineering Technical Test",
    recruiterName: "Ananya Sharma (HR Lead)",
    recruiterEmail: "ananya.sharma@microsoft.com",
    company: "Microsoft India",
    companyLogoBg: "bg-emerald-600",
    assessmentType: "Coding Only",
    mcqCount: 0,
    codingCount: 6,
    sqlCount: 0,
    totalQuestions: 6,
    duration: "120 Mins",
    totalMarks: 120,
    passingMarksPct: 80,
    submittedDate: "2026-07-29",
    priority: "High",
    status: "Under Review",
    version: "v2.0",
    expectedCandidates: 280,
    programmingLanguages: ["C#", "C++", "Java", "Python"],
    recruiterNotes: "Strict coding assessment focusing on Graph algorithms, Dynamic Programming, and System Optimization.",
    mcqQuestions: [],
    codingQuestions: [
      { id: "COD-MS-01", title: "Shortest Path in Weighted Grid with Obstacles", problemStatement: "Find shortest distance from top-left to bottom-right cell given K obstacle eliminations.", languagesAllowed: ["C#", "C++", "Java", "Python"], sampleInput: "Grid 5x5, K=1", sampleOutput: "Shortest Distance = 8", marks: 20, difficulty: "Hard" },
    ],
    sqlQuestions: [],
    auditTrail: [
      { timestamp: "2026-07-29 02:00 PM", action: "Submitted for Review", actor: "Ananya Sharma", notes: "Assessment test suite uploaded." },
    ],
    versionHistory: [
      { version: "v2.0", date: "2026-07-29", status: "Under Review", author: "Ananya Sharma" },
    ],
  },
  {
    id: "REQ-2026-003",
    assessmentId: "AST-2026-AMZ-01",
    name: "Amazon AWS System Design & DSA Assessment",
    recruiterName: "Samantha Wright (Talent Manager)",
    recruiterEmail: "samantha.w@amazon.com",
    company: "Amazon AWS",
    companyLogoBg: "bg-amber-600",
    assessmentType: "MCQ + Coding + SQL",
    mcqCount: 30,
    codingCount: 4,
    sqlCount: 4,
    totalQuestions: 38,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarksPct: 70,
    submittedDate: "2026-07-25",
    priority: "Medium",
    status: "Changes Requested",
    version: "v1.0",
    expectedCandidates: 420,
    programmingLanguages: ["Java", "Python", "C++"],
    recruiterNotes: "Focuses on Leadership Principles, Object-Oriented Design, and AWS DynamoDB query optimization.",
    mcqQuestions: [],
    codingQuestions: [],
    sqlQuestions: [],
    auditTrail: [
      { timestamp: "2026-07-25 11:00 AM", action: "Submitted for Review", actor: "Samantha Wright", notes: "First revision submitted." },
      { timestamp: "2026-07-26 04:00 PM", action: "Changes Requested", actor: "Dr. Anand Sharma", notes: "Please reduce MCQ count and add 1 extra coding question." },
    ],
    versionHistory: [
      { version: "v1.0", date: "2026-07-25", status: "Changes Requested", author: "Samantha Wright" },
    ],
  },
  {
    id: "REQ-2026-004",
    assessmentId: "AST-2026-QLC-01",
    name: "Qualcomm Hardware & Embedded C Assessment",
    recruiterName: "Rajesh Kumar (Technical Lead)",
    recruiterEmail: "rajesh.k@qualcomm.com",
    company: "Qualcomm India",
    companyLogoBg: "bg-purple-600",
    assessmentType: "Aptitude & MCQ",
    mcqCount: 50,
    codingCount: 2,
    sqlCount: 0,
    totalQuestions: 52,
    duration: "90 Mins",
    totalMarks: 100,
    passingMarksPct: 65,
    submittedDate: "2026-07-26",
    priority: "Standard",
    status: "Approved",
    version: "v1.1",
    expectedCandidates: 150,
    programmingLanguages: ["Embedded C", "Assembly", "C++"],
    recruiterNotes: "Hardware concepts, Microcontrollers, System Verilog, and Bit Manipulation questions.",
    mcqQuestions: [],
    codingQuestions: [],
    sqlQuestions: [],
    auditTrail: [
      { timestamp: "2026-07-26 01:00 PM", action: "Submitted for Review", actor: "Rajesh Kumar", notes: "Embedded system test ready." },
      { timestamp: "2026-07-27 10:00 AM", action: "Approved by TPO", actor: "Dr. Anand Sharma", notes: "Approved for hardware drive." },
    ],
    versionHistory: [
      { version: "v1.0", date: "2026-07-26", status: "Submitted", author: "Rajesh Kumar" },
      { version: "v1.1", date: "2026-07-27", status: "Approved", author: "Dr. Anand Sharma" },
    ],
  },
];

const PIPELINE_STAGES: RequestStatus[] = [
  "Submitted",
  "Under Review",
  "Changes Requested",
  "Resubmitted",
  "Approved",
  "Published",
  "Used in Session",
];

export function AssessmentRequestsApprovalWorkspace() {
  const [requests, setRequests] = useState<AssessmentRequestRecord[]>(SHARED_ASSESSMENT_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState<string>("All");

  // Selected Request Drawer
  const [selectedReq, setSelectedReq] = useState<AssessmentRequestRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("overview");

  // Modals
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);

  // Form Inputs for Modals
  const [rejectReason, setRejectReason] = useState("");
  const [changeCategory, setChangeCategory] = useState("Question Issues");
  const [changeRemarks, setChangeRemarks] = useState("");

  // Helper for copying text with fallback for HTTP / restricted clipboard environments
  const fallbackCopyTextToClipboard = (text: string, label: string = "link") => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) {
        toast.success(`Copied ${label} to clipboard!`);
      } else {
        prompt("Copy exam link manually:", text);
      }
    } catch (err) {
      prompt("Copy exam link manually:", text);
    }
  };

  const copyToClipboard = (text: string, label: string = "link") => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => toast.success(`Copied ${label} to clipboard!`),
        () => fallbackCopyTextToClipboard(text, label)
      );
    } else {
      fallbackCopyTextToClipboard(text, label);
    }
  };

  // Dispatch to Students Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchReq, setDispatchReq] = useState<AssessmentRequestRecord | null>(null);
  const [dispatchSeries, setDispatchSeries] = useState("2022 Series (CSE / ECE / CSM)");
  const [dispatchMinCgpa, setDispatchMinCgpa] = useState("7.5");
  const [sharedAssessmentIds, setSharedAssessmentIds] = useState<Record<string, boolean>>({});

  // Student Submissions State & Edit Modal State
  const [studentSubmissionsList, setStudentSubmissionsList] = useState<StudentSubmissionRecord[]>(() => getAllStudentSubmissions());
  const [editingSub, setEditingSub] = useState<StudentSubmissionRecord | null>(null);
  const [isEditSubModalOpen, setIsEditSubModalOpen] = useState(false);
  const [editPassStatus, setEditPassStatus] = useState<boolean>(true);
  const [editMcqScore, setEditMcqScore] = useState<number>(0);
  const [editCodingScore, setEditCodingScore] = useState<number>(0);
  const [editRemarks, setEditRemarks] = useState<string>("");

  const refreshStudentSubmissions = () => {
    setStudentSubmissionsList(getAllStudentSubmissions());
  };

  const handleQuickTogglePassStatus = (sub: StudentSubmissionRecord) => {
    const updatedStatus = !sub.passStatus;
    const updatedRecord: StudentSubmissionRecord = {
      ...sub,
      passStatus: updatedStatus,
    };
    updateStudentSubmissionRecord(updatedRecord);
    refreshStudentSubmissions();
    if (updatedStatus) {
      toast.success(`Updated ${sub.studentName} (${sub.rollNo}): Changed status to PASSED ✓`);
    } else {
      toast.error(`Updated ${sub.studentName} (${sub.rollNo}): Changed status to FAILED ✕`);
    }
  };

  const openEditSubModal = (sub: StudentSubmissionRecord) => {
    setEditingSub(sub);
    setEditPassStatus(sub.passStatus);
    setEditMcqScore(sub.mcqScore);
    setEditCodingScore(sub.codingScore);
    setEditRemarks("");
    setIsEditSubModalOpen(true);
  };

  const handleSaveSubChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    const totalObtained = editMcqScore + editCodingScore;
    const totalPossible = editingSub.mcqTotal + editingSub.codingTotal;
    const calculatedPct = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : editingSub.totalPercentage;

    const updatedRecord: StudentSubmissionRecord = {
      ...editingSub,
      passStatus: editPassStatus,
      mcqScore: editMcqScore,
      codingScore: editCodingScore,
      totalPercentage: calculatedPct,
    };

    updateStudentSubmissionRecord(updatedRecord);
    refreshStudentSubmissions();
    setIsEditSubModalOpen(false);
    toast.success(`Saved updated result for ${editingSub.studentName}! Status: ${editPassStatus ? "PASSED ✓" : "FAILED ✕"}`);
  };

  const handleSendResultsToRecruiter = () => {
    const allSubs = getAllStudentSubmissions();
    const passedCount = allSubs.filter((s) => s.passStatus).length;
    toast.success(
      `📢 Sent all ${allSubs.length} candidate scorecards (${passedCount} PASSED) to corporate recruiters via email notification!`
    );
  };

  const handleSendSingleResultToRecruiter = (sub: StudentSubmissionRecord) => {
    toast.success(`📧 Dispatched ${sub.studentName}'s (${sub.rollNo}) verified scorecard directly to the recruiter!`);
  };

  const handleExportStudentResultsCsv = () => {
    const allSubs = getAllStudentSubmissions();
    const headers = "Student Roll No,College Email,Department,Assessment Title,MCQ Score,Coding Score,Total Percentage,Status,Proctoring Warnings,Submission Timestamp\n";
    const rows = allSubs.map((sub) =>
      `"${sub.rollNo}","${sub.studentEmail}","${sub.department}","${sub.assessmentTitle}","${sub.mcqScore}/${sub.mcqTotal}","${sub.codingScore}/${sub.codingTotal}","${sub.totalPercentage}%","${sub.passStatus ? "PASSED" : "FAILED"}","${sub.violationsLogged} Warnings","${sub.submissionTime}"`
    ).join("\n");


    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tpo_student_assessment_results_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported TPO student assessment results to Excel CSV!");
  };

  // Handlers
  const handleConfirmApprove = () => {
    if (!selectedReq) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === selectedReq.id ? { ...r, status: "Approved" } : r))
    );

    setIsApproveModalOpen(false);
    toast.success(`Approved assessment "${selectedReq.name}"! Available in Assessment Session Wizard.`);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === selectedReq.id ? { ...r, status: "Rejected" } : r))
    );

    setIsRejectModalOpen(false);
    toast.error(`Rejected assessment request for "${selectedReq.name}". Recruiter notified.`);
  };

  const handleConfirmRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === selectedReq.id ? { ...r, status: "Changes Requested" } : r))
    );

    setIsRequestChangesModalOpen(false);
    toast.info(`Sent revision request to ${selectedReq.recruiterName} for "${selectedReq.name}".`);
  };

  // Bulk Actions
  const handleBulkApprove = () => {
    setRequests((prev) =>
      prev.map((r) => (r.status === "Submitted" || r.status === "Under Review" ? { ...r, status: "Approved" } : r))
    );
    toast.success("Bulk approved all pending recruiter assessment requests!");
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assessmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recruiterName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany = companyFilter === "All" || r.company === companyFilter;
    const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter;
    const matchesStage = stageFilter === "All" || r.status === stageFilter;

    return matchesSearch && matchesCompany && matchesPriority && matchesStage;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* 1. PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-purple-600 text-white font-mono text-[0.7rem]">
                ● TPO APPROVAL GATEWAY
              </Badge>
              <Badge variant="outline" className="font-mono text-[0.7rem] bg-primary/5 text-primary">
                Recruiter Test Review
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Assessment Request Approval Center
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Review recruiter-created assessments before allowing them to be used in placement drives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleBulkApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5 shadow-glow"
            >
              <CheckCheck className="size-4" /> Bulk Approve Pending
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Bulk rejected non-compliant assessment drafts")}
              className="text-xs border-rose-500/40 text-rose-600 rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <XCircle className="size-3.5" /> Bulk Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Refreshed assessment request queue from recruiters")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <RefreshCw className="size-3.5" /> Refresh Queue
            </Button>
          </div>
        </div>
      </div>

      {/* 2. TOP KPI CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Pending Requests", val: `${requests.filter((r) => r.status === "Submitted" || r.status === "Under Review").length}`, badge: "Awaiting TPO Action", pct: 60, sub: "Recruiter submissions" },
          { label: "Approved Today", val: `${requests.filter((r) => r.status === "Approved").length + 10}`, badge: "Ready for Drives", pct: 90, sub: "Verified corporate tests" },
          { label: "Rejected Requests", val: `${requests.filter((r) => r.status === "Rejected").length + 1}`, badge: "Non-Compliant", pct: 20, sub: "Rejected by TPO" },
          { label: "Needs Revision", val: `${requests.filter((r) => r.status === "Changes Requested").length}`, badge: "Sent to Recruiter", pct: 35, sub: "Awaiting edits" },
          { label: "Avg Review Time", val: "1.4 Hours", badge: "Speed Index", pct: 85, sub: "TPO response time" },
          { label: "High Priority", val: `${requests.filter((r) => r.priority === "High").length}`, badge: "Urgent Campus Test", pct: 50, sub: "Priority reviews" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{kpi.label}</span>
              <span className="text-[0.65rem] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {kpi.badge}
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{kpi.val}</p>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${kpi.pct}%` }} />
            </div>
            <p className="text-[0.68rem] text-slate-400 dark:text-slate-500 font-mono mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. REQUEST PIPELINE STAGES FILTER */}
      <Panel title="Assessment Request Lifecycle Pipeline (Click Stage to Filter)">
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          <Button
            size="sm"
            variant={stageFilter === "All" ? "default" : "outline"}
            onClick={() => setStageFilter("All")}
            className="rounded-xl h-8 text-xs cursor-pointer"
          >
            All Stages ({requests.length})
          </Button>
          {PIPELINE_STAGES.map((st) => (
            <Button
              key={st}
              size="sm"
              variant={stageFilter === st ? "default" : "outline"}
              onClick={() => {
                setStageFilter(st);
                toast.info(`Filtered for stage: ${st}`);
              }}
              className={`rounded-xl h-8 text-xs cursor-pointer ${
                stageFilter === st ? "bg-purple-600 text-white font-bold" : ""
              }`}
            >
              {st} ({requests.filter((r) => r.status === st).length})
            </Button>
          ))}
        </div>
      </Panel>

      {/* 4. SEARCH & FILTERS BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by assessment name, test ID, company, or recruiter name..."
              className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Companies</option>
              <option value="Google Cloud India">Google Cloud India</option>
              <option value="Microsoft India">Microsoft India</option>
              <option value="Amazon AWS">Amazon AWS</option>
              <option value="Qualcomm India">Qualcomm India</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. REQUEST DIRECTORY TABLE */}
      <Panel title="Recruiter Assessment Requests Queue">
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Assessment Title & ID</th>
                <th className="p-3">Recruiter & Company</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-center">Questions</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center">Marks</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-foreground text-xs">{req.name}</p>
                    <span className="text-[0.65rem] font-mono text-primary font-bold">{req.assessmentId} • {req.version}</span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-foreground">{req.company}</p>
                    <span className="text-[0.68rem] text-muted-foreground">{req.recruiterName}</span>
                  </td>
                  <td className="p-3 font-mono">
                    <Badge variant="outline" className="text-[0.62rem] text-purple-600 border-purple-500/30">
                      {req.assessmentType}
                    </Badge>
                  </td>
                  <td className="p-3 text-center font-mono font-bold">{req.totalQuestions} Qs</td>
                  <td className="p-3 text-center font-mono font-bold text-primary">{req.duration}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-600">{req.totalMarks} Mks</td>
                  <td className="p-3 font-mono text-[0.68rem] text-muted-foreground">{req.submittedDate}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        req.priority === "High"
                          ? "bg-rose-500/10 text-rose-600 font-mono text-[0.62rem]"
                          : "bg-blue-500/10 text-blue-600 font-mono text-[0.62rem]"
                      }
                    >
                      {req.priority}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      className={
                        req.status === "Approved"
                          ? "bg-emerald-600 text-white font-mono text-[0.65rem]"
                          : req.status === "Changes Requested"
                          ? "bg-amber-600 text-white font-mono text-[0.65rem]"
                          : req.status === "Rejected"
                          ? "bg-rose-600 text-white font-mono text-[0.65rem]"
                          : "bg-purple-600 text-white font-mono text-[0.65rem]"
                      }
                    >
                      ● {req.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedReq(req);
                          setDrawerTab("overview");
                          setIsDrawerOpen(true);
                        }}
                        className="h-7 text-xs rounded-lg cursor-pointer"
                      >
                        <Eye className="size-3.5 mr-1" /> View
                      </Button>

                      {sharedAssessmentIds[req.id] ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setDispatchReq(req);
                            setIsDispatchModalOpen(true);
                          }}
                          className="h-7 text-[0.68rem] bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 rounded-lg cursor-pointer font-bold gap-1 shadow-2xs"
                          title="Shared with students. Click to reshare or manage dispatch."
                        >
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" /> Shared to Students
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            setDispatchReq(req);
                            setIsDispatchModalOpen(true);
                          }}
                          className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer font-bold gap-1 shadow-xs"
                          title="Share Exam Link directly with eligible students"
                        >
                          <Send className="size-3" /> Share with Students
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          copyToClipboard(
                            `http://192.168.1.122:8082/exam/take?id=${req.assessmentId}`,
                            `exam link for ${req.name}`
                          );
                        }}
                        className="h-7 text-[0.68rem] text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg cursor-pointer font-bold"
                        title="Copy Live Student Exam Conducting URL"
                      >
                        <Copy className="size-3 mr-1" /> Link
                      </Button>

                      {req.status !== "Approved" && req.status !== "Rejected" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedReq(req);
                              setIsApproveModalOpen(true);
                            }}
                            className="h-7 text-[0.68rem] bg-emerald-600 text-white rounded-lg cursor-pointer font-bold"
                          >
                            <Check className="size-3 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReq(req);
                              setIsRequestChangesModalOpen(true);
                            }}
                            className="h-7 text-[0.68rem] rounded-lg cursor-pointer"
                          >
                            <RotateCcw className="size-3 mr-1" /> Revision
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 6. TPO STORED STUDENT ASSESSMENT RESULTS TABLE & EXCEL EXPORT */}
      <Panel
        title="TPO Central Stored Student Assessment Results & Scorecards"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleSendResultsToRecruiter}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-8 cursor-pointer gap-1.5 shadow-xs"
            >
              <Send className="size-3.5" /> Send Results to Recruiter
            </Button>

            <Button onClick={handleExportStudentResultsCsv} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-8 cursor-pointer gap-1.5 shadow-xs">
              <Download className="size-3.5" /> Export Stored Results to Excel (.csv)
            </Button>
          </div>
        }
      >
        <div className="space-y-4 pt-1 font-sans">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono flex items-center justify-between">
            <span className="font-bold text-emerald-800 dark:text-emerald-200">
              📊 Live Stored Test Submissions ({studentSubmissionsList.length} Students Submitted)
            </span>
            <span className="text-muted-foreground text-[0.68rem]">
              Auto-stored upon candidate completion • TPO has permission to override status (FAIL ➔ PASS) &amp; dispatch to recruiter
            </span>
          </div>

          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase text-[0.65rem]">
                  <th className="p-3">Candidate / Roll No</th>
                  <th className="p-3">College Email</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3">Assessment Title</th>
                  <th className="p-3">MCQ Score</th>
                  <th className="p-3">Coding Score</th>
                  <th className="p-3">Overall %</th>
                  <th className="p-3">Status (Click to Override)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-[0.72rem]">
                {studentSubmissionsList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-sans font-bold text-foreground">{sub.studentName} ({sub.rollNo})</td>
                    <td className="p-3 text-blue-600">{sub.studentEmail}</td>
                    <td className="p-3 text-muted-foreground font-bold">{sub.department}</td>
                    <td className="p-3 font-sans max-w-xs truncate">{sub.assessmentTitle}</td>
                    <td className="p-3 font-bold text-foreground">{sub.mcqScore} / {sub.mcqTotal}</td>
                    <td className="p-3 font-bold text-purple-600">{sub.codingScore} / {sub.codingTotal}</td>
                    <td className="p-3 font-bold text-emerald-600">{sub.totalPercentage}%</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleQuickTogglePassStatus(sub)}
                        className="cursor-pointer group flex items-center gap-1.5"
                        title="Click to toggle status between PASSED and FAILED"
                      >
                        <Badge className={sub.passStatus ? "bg-emerald-600 hover:bg-emerald-700 text-white text-[0.62rem] px-2 py-0.5 rounded-full" : "bg-rose-600 hover:bg-rose-700 text-white text-[0.62rem] px-2 py-0.5 rounded-full"}>
                          {sub.passStatus ? "PASSED ✓" : "FAILED ✕"}
                        </Badge>
                        <span className="text-[0.62rem] text-muted-foreground underline group-hover:text-primary transition-colors font-sans">
                          (Toggle)
                        </span>
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-sans">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditSubModal(sub)}
                          className="h-7 text-[0.68rem] rounded-lg cursor-pointer px-2.5 font-bold gap-1"
                        >
                          <Edit className="size-3" /> Edit Result
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendSingleResultToRecruiter(sub)}
                          className="h-7 text-[0.68rem] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg cursor-pointer px-2.5 font-bold gap-1 shadow-xs"
                        >
                          <Send className="size-3" /> Send to Recruiter
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      {/* ========================================================================= */}
      {/* VIEW ASSESSMENT DRAWER (FULL DETAIL PREVIEW)                             */}
      {/* ========================================================================= */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto space-y-4">
          {selectedReq && (
            <>
              <SheetHeader className="pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-xl ${selectedReq.companyLogoBg} text-white grid place-items-center font-extrabold text-sm shadow-xs`}>
                    {selectedReq.company.substring(0, 2)}
                  </div>
                  <div>
                    <SheetTitle className="text-base font-extrabold">{selectedReq.name}</SheetTitle>
                    <SheetDescription className="text-xs font-mono text-primary font-bold">
                      {selectedReq.assessmentId} • {selectedReq.version} • Submitted by {selectedReq.recruiterName}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* DRAWER TABS */}
              <Tabs value={drawerTab} onValueChange={setDrawerTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl w-full grid grid-cols-6 text-[0.6rem] font-bold mb-4">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="questions" className="rounded-lg">Questions</TabsTrigger>
                  <TabsTrigger value="difficulty" className="rounded-lg">Difficulty</TabsTrigger>
                  <TabsTrigger value="ai_analysis" className="rounded-lg">AI Audit</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg">Versions</TabsTrigger>
                  <TabsTrigger value="audit" className="rounded-lg">Timeline</TabsTrigger>
                </TabsList>

                {/* TAB 1: OVERVIEW */}
                <TabsContent value="overview" className="space-y-3 text-xs font-mono mt-0">
                  <div className="p-4 bg-card rounded-2xl border border-border/70 space-y-2">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Assessment ID:</span>
                      <strong className="text-primary">{selectedReq.assessmentId}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Company & Recruiter:</span>
                      <strong className="text-foreground">{selectedReq.company} ({selectedReq.recruiterName})</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Assessment Type:</span>
                      <strong className="text-purple-600">{selectedReq.assessmentType}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Total Questions:</span>
                      <strong className="text-foreground">{selectedReq.totalQuestions} Questions ({selectedReq.mcqCount} MCQ, {selectedReq.codingCount} Coding, {selectedReq.sqlCount} SQL)</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Test Duration:</span>
                      <strong className="text-foreground">{selectedReq.duration}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Passing Cutoff:</span>
                      <strong className="text-emerald-600">{selectedReq.passingMarksPct}% Marks ({selectedReq.totalMarks} Total Marks)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Programming Languages:</span>
                      <strong className="text-foreground">{selectedReq.programmingLanguages.join(", ")}</strong>
                    </div>
                  </div>

                  {/* STUDENT ASSESSMENT CONDUCTING URL & SHARING BOX */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold font-sans">
                        <CheckCircle2 className="size-4" /> Live Student Exam Link (TPO Shared)
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[0.62rem]">Active Test Link</Badge>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-background border font-mono text-xs text-blue-600">
                      <span className="truncate">http://192.168.1.122:8082/exam/take?id={selectedReq.assessmentId}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          copyToClipboard(
                            `http://192.168.1.122:8082/exam/take?id=${selectedReq.assessmentId}`,
                            "Student Exam URL"
                          );
                        }}
                        className="h-7 text-xs rounded-lg cursor-pointer shrink-0 gap-1 font-sans"
                      >
                        <Copy className="size-3" /> Copy Link
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground font-sans">
                      <span>Share this link directly with eligible students for conducting the exam online.</span>
                      {selectedReq && sharedAssessmentIds[selectedReq.id] ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setDispatchReq(selectedReq);
                            setIsDispatchModalOpen(true);
                          }}
                          className="h-7 text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 rounded-lg font-bold cursor-pointer gap-1"
                        >
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" /> Shared to Students
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            setDispatchReq(selectedReq);
                            setIsDispatchModalOpen(true);
                          }}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer gap-1"
                        >
                          <Send className="size-3" /> Share with Students
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-muted/30 rounded-xl space-y-1 font-sans">
                    <span className="font-bold text-xs">Recruiter Submission Notes</span>
                    <p className="text-xs text-muted-foreground italic">"{selectedReq.recruiterNotes}"</p>
                  </div>
                </TabsContent>

                {/* TAB 2: QUESTION PAPER PREVIEW */}
                <TabsContent value="questions" className="space-y-4 text-xs font-mono mt-0">
                  <div className="space-y-3">
                    <span className="font-bold font-sans text-xs text-primary uppercase tracking-wider block">MCQ Questions ({selectedReq.mcqQuestions.length})</span>
                    {selectedReq.mcqQuestions.map((mcq, idx) => (
                      <div key={mcq.id} className="p-3.5 rounded-xl border border-border/70 bg-card space-y-2">
                        <p className="font-bold font-sans text-foreground">Q{idx + 1}. {mcq.question}</p>
                        <div className="grid grid-cols-2 gap-1 text-[0.7rem] text-muted-foreground pl-3">
                          {mcq.options.map((opt, oIdx) => (
                            <div key={oIdx} className={oIdx === mcq.correctOption ? "font-bold text-emerald-600" : ""}>
                              {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === mcq.correctOption && "✓"}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <span className="font-bold font-sans text-xs text-purple-600 uppercase tracking-wider block pt-2">Coding Challenges ({selectedReq.codingQuestions.length})</span>
                    {selectedReq.codingQuestions.map((cod, idx) => (
                      <div key={cod.id} className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2">
                        <div className="flex justify-between font-sans">
                          <p className="font-bold text-foreground">Coding Q{idx + 1}: {cod.title}</p>
                          <Badge className="bg-purple-600 text-white text-[0.6rem]">{cod.marks} Marks</Badge>
                        </div>
                        <p className="text-muted-foreground">{cod.problemStatement}</p>
                        <div className="p-2 bg-background rounded-lg border text-[0.68rem]">
                          Sample Input: {cod.sampleInput} | Output: {cod.sampleOutput}
                        </div>
                      </div>
                    ))}

                    <span className="font-bold font-sans text-xs text-blue-600 uppercase tracking-wider block pt-2">SQL Database Queries ({selectedReq.sqlQuestions.length})</span>
                    {selectedReq.sqlQuestions.map((sql, idx) => (
                      <div key={sql.id} className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                        <div className="flex justify-between font-sans">
                          <p className="font-bold text-foreground">SQL Q{idx + 1}: {sql.title}</p>
                          <Badge className="bg-blue-600 text-white text-[0.6rem]">{sql.marks} Marks</Badge>
                        </div>
                        <p className="text-muted-foreground">{sql.queryTask}</p>
                        <div className="p-2 bg-background rounded-lg border text-[0.68rem] font-mono">
                          Tables: {sql.tablesGiven} | Columns: {sql.expectedColumns}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* TAB 4: AI REVIEW PANEL */}
                <TabsContent value="ai_analysis" className="space-y-3 text-xs font-mono mt-0">
                  <div className="p-4 rounded-2xl border border-purple-500/40 bg-purple-500/10 space-y-3">
                    <div className="flex items-center gap-2 text-purple-600 font-bold font-sans">
                      <Brain className="size-5" /> AI Question Quality & Bloom's Taxonomy Audit
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div>Question Difficulty Score: <strong className="text-foreground">78 / 100 (Optimal)</strong></div>
                      <div>Duplicate Detection: <strong className="text-emerald-600">0% Duplicates Found</strong></div>
                      <div>Topic Coverage: <strong className="text-emerald-600">96% Syllabus Match</strong></div>
                      <div>Estimated Student Pass Rate: <strong className="text-purple-600">74.2% Expected</strong></div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 5: VERSION HISTORY */}
                <TabsContent value="history" className="space-y-3 text-xs font-mono mt-0">
                  {selectedReq.versionHistory.map((vh) => (
                    <div key={vh.version} className="p-3 rounded-xl border border-border/70 bg-card flex justify-between items-center">
                      <div>
                        <span className="font-bold text-primary">{vh.version}</span>
                        <p className="text-[0.68rem] text-muted-foreground">{vh.author} • {vh.date}</p>
                      </div>
                      <Badge variant="outline">{vh.status}</Badge>
                    </div>
                  ))}
                </TabsContent>

                {/* TAB 6: AUDIT TIMELINE */}
                <TabsContent value="audit" className="space-y-3 text-xs font-mono mt-0">
                  {selectedReq.auditTrail.map((at, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
                      <div className="flex justify-between text-[0.68rem] text-muted-foreground">
                        <span className="font-bold text-foreground font-sans">{at.action}</span>
                        <span>{at.timestamp}</span>
                      </div>
                      <p className="text-[0.7rem] text-muted-foreground">Actor: {at.actor} • Notes: "{at.notes}"</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* DISPATCH EXAM LINK TO ELIGIBLE STUDENTS MODAL DIALOG */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-600 text-white grid place-items-center shadow-glow">
                <Send className="size-5" />
              </div>
              <div>
                <DialogTitle className="font-extrabold font-sans text-base">Dispatch Exam Link to Eligible Students</DialogTitle>
                <DialogDescription className="text-[0.7rem] font-mono">
                  Send live conducting link via email to selected student roll number series.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {dispatchReq && (
            <div className="space-y-4 pt-2 text-xs font-sans">
              <div className="p-3.5 rounded-xl border bg-card space-y-1 font-mono">
                <p className="text-muted-foreground text-[0.65rem] uppercase font-bold">Assessment</p>
                <p className="font-bold text-foreground font-sans text-sm">{dispatchReq.name}</p>
                <p className="text-[0.68rem] text-blue-600">ID: {dispatchReq.assessmentId} • {dispatchReq.duration}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Target Student Roll Series</label>
                  <select
                    value={dispatchSeries}
                    onChange={(e) => setDispatchSeries(e.target.value)}
                    className="w-full h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold cursor-pointer font-mono"
                  >
                    <option value="2022 Series (CSE / ECE / CSM)">2022 Series (2022CSE &amp; 2022ECE)</option>
                    <option value="2023 Series (23341A4229 CSM Series)">2023 Series (23341A4229 CSM Series)</option>
                    <option value="All Eligible Campus Batches">All Eligible Campus Batches</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Minimum Cutoff CGPA</label>
                  <Input
                    value={dispatchMinCgpa}
                    onChange={(e) => setDispatchMinCgpa(e.target.value)}
                    required
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* LIVE EXAM LINK PREVIEW */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-card border border-border/80 text-foreground font-mono text-[0.68rem] space-y-2 shadow-2xs">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">📨 Email Preview Dispatched to Students:</p>
                <p className="text-muted-foreground font-sans">"Dear Student (e.g. 23341a4229@college.edu.in), you are invited to attempt the official online assessment '{dispatchReq.name}'. Please use your student college email ID to log in."</p>
                <p className="text-blue-600 dark:text-blue-400 underline font-bold">http://192.168.1.122:8082/exam/take?id={dispatchReq.assessmentId}</p>
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDispatchModalOpen(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (dispatchReq) {
                      setSharedAssessmentIds((prev) => ({ ...prev, [dispatchReq.id]: true }));
                    }
                    setIsDispatchModalOpen(false);
                    toast.success(`Dispatched exam link to all eligible ${dispatchSeries} students! Candidate test results will automatically store below upon submission.`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer gap-1.5"
                >
                  <Send className="size-3.5" /> Confirm &amp; Send Link to Students
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* APPROVE CONFIRMATION MODAL */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Approve Assessment Request</DialogTitle>
            <DialogDescription>
              Confirming approval will add "{selectedReq?.name}" to the Approved Assessment Library for Placement Drives.
            </DialogDescription>
          </DialogHeader>

          {selectedReq && (
            <div className="p-4 bg-muted/30 rounded-xl space-y-2 text-xs font-mono border">
              <p>• Assessment: <strong className="text-foreground">{selectedReq.name}</strong></p>
              <p>• Company: <strong className="text-foreground">{selectedReq.company}</strong></p>
              <p>• Recruiter: <strong className="text-foreground">{selectedReq.recruiterName}</strong></p>
              <p>• Total Questions: <strong className="text-purple-600">{selectedReq.totalQuestions} Questions</strong></p>
              <p>• Passing Cutoff: <strong className="text-emerald-600">{selectedReq.passingMarksPct}% Marks</strong></p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleConfirmApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer">
              Approve Assessment ✓
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT CONFIRMATION MODAL */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reject Assessment Request</DialogTitle>
            <DialogDescription>Record mandatory rejection reason for recruiter notification.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReject} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold">Mandatory Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Enter mandatory rejection remarks..."
                required
                className="w-full rounded-xl border border-input bg-card p-2.5 text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRejectModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" variant="destructive" className="font-bold rounded-xl cursor-pointer">
                Confirm & Reject Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* REQUEST CHANGES MODAL */}
      <Dialog open={isRequestChangesModalOpen} onOpenChange={setIsRequestChangesModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Request Changes / Revisions</DialogTitle>
            <DialogDescription>Send feedback back to recruiter for assessment modifications.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmRequestChanges} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold">Revision Reason Category</label>
              <select
                value={changeCategory}
                onChange={(e) => setChangeCategory(e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold cursor-pointer"
              >
                <option value="Question Issues">Question Issues & Typos</option>
                <option value="Difficulty Too High">Difficulty Level Too High</option>
                <option value="Difficulty Too Low">Difficulty Level Too Low</option>
                <option value="Duplicate Questions">Duplicate Questions Detected</option>
                <option value="Wrong Answers">Incorrect Answer Keys</option>
                <option value="Policy Violation">Placement Policy Violation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Reviewer Revision Remarks</label>
              <textarea
                value={changeRemarks}
                onChange={(e) => setChangeRemarks(e.target.value)}
                rows={3}
                placeholder="Enter detailed revision feedback for recruiter..."
                required
                className="w-full rounded-xl border border-input bg-card p-2.5 text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRequestChangesModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">
                Send Back to Recruiter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      {/* EDIT STUDENT ASSESSMENT RESULT MODAL */}
      <Dialog open={isEditSubModalOpen} onOpenChange={setIsEditSubModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#2563EB] text-white grid place-items-center shadow-md">
                <Edit className="size-5" />
              </div>
              <div>
                <DialogTitle className="font-extrabold text-base">Edit Candidate Assessment Result</DialogTitle>
                <DialogDescription className="text-xs font-mono">
                  Override candidate status (FAILED ➔ PASSED) or update score breakdown.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {editingSub && (
            <form onSubmit={handleSaveSubChanges} className="space-y-4 pt-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl space-y-1 font-mono text-[0.72rem] border">
                <p>• Student: <strong className="text-foreground">{editingSub.studentName} ({editingSub.rollNo})</strong></p>
                <p>• Email: <strong className="text-blue-600">{editingSub.studentEmail}</strong></p>
                <p>• Test Title: <strong className="text-foreground">{editingSub.assessmentTitle}</strong></p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-xs text-foreground block">Override Result Status (Pass / Fail)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditPassStatus(true)}
                    className={`p-3 rounded-xl border text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      editPassStatus
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-background text-slate-700 dark:text-slate-200 border-border hover:bg-muted"
                    }`}
                  >
                    <CheckCircle2 className="size-4" /> PASSED ✓
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditPassStatus(false)}
                    className={`p-3 rounded-xl border text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      !editPassStatus
                        ? "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-background text-slate-700 dark:text-slate-200 border-border hover:bg-muted"
                    }`}
                  >
                    <XCircle className="size-4" /> FAILED ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-xs">MCQ Score (Max {editingSub.mcqTotal})</label>
                  <input
                    type="number"
                    min={0}
                    max={editingSub.mcqTotal}
                    value={editMcqScore}
                    onChange={(e) => setEditMcqScore(Number(e.target.value))}
                    className="w-full h-9 rounded-xl border border-input bg-card px-3 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-xs">Coding Score (Max {editingSub.codingTotal})</label>
                  <input
                    type="number"
                    min={0}
                    max={editingSub.codingTotal}
                    value={editCodingScore}
                    onChange={(e) => setEditCodingScore(Number(e.target.value))}
                    className="w-full h-9 rounded-xl border border-input bg-card px-3 text-xs font-mono font-bold text-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-xs">TPO Override Remarks / Justification</label>
                <textarea
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  rows={2}
                  placeholder="e.g., Manual code inspection approved / Grace marks awarded for technical glitch..."
                  className="w-full rounded-xl border border-input bg-card p-2.5 text-xs font-mono"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditSubModalOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer">
                  Save Updated Result ✓
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
