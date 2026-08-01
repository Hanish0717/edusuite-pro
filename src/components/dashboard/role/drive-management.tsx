import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  Users,
  UserPlus,
  CheckCircle2,
  Calendar,
  CalendarDays,
  Plus,
  FileSpreadsheet,
  BellRing,
  Search,
  MessageSquare,
  Award,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Video,
  Zap,
  Building,
  Filter,
  Download,
  ShieldCheck,
  AlertCircle,
  Info,
  CheckSquare,
  GraduationCap,
  Layers,
  Activity,
  FileText,
  BadgeAlert,
  Bell,
  Star,
  FileCheck2,
  X,
  Check,
  Eye,
  Edit,
  Trash2,
  UserX,
  Upload,
  Mail,
  Phone,
  ExternalLink,
  ChevronLeft,
  RefreshCw,
  MoreVertical,
  Shield,
  MapPin,
  Globe,
  LayoutGrid,
  List as ListIcon,
  CheckCircle,
  Clock3,
  XCircle,
  FileCode,
  PieChart as PieChartIcon,
  BarChart3,
  StickyNote,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
// MOCK DATA TYPES & RECORDS FOR DRIVE MANAGEMENT WORKSPACE
// ============================================================================

export interface PlacementDrive {
  id: string;
  company: string;
  logoText: string;
  logoBg: string;
  role: string;
  CTC: string;
  location: string;
  type: "On-Campus" | "Virtual Drive" | "Off-Campus";
  stage: "Draft" | "Published" | "Registration Open" | "Assessment" | "Result Review" | "Interview" | "Offer" | "Completed";
  progress: number;
  eligibleStudents: number;
  appliedCount: number;
  assessmentCount: number;
  interviewCount: number;
  offersReleased: number;
  registrationDeadline: string;
  assessmentDate: string;
  interviewDate: string;
  offerDate: string;
  joiningDate: string;
  recruiterName: string;
  statusTone: "success" | "warning" | "info" | "purple" | "rose";
}

const INITIAL_DRIVES: PlacementDrive[] = [
  {
    id: "DRIVE-2026-01",
    company: "Google Cloud India",
    logoText: "G",
    logoBg: "bg-blue-600",
    role: "Software Engineer I",
    CTC: "₹32.0 LPA",
    location: "Bengaluru / Hyderabad",
    type: "On-Campus",
    stage: "Assessment",
    progress: 67,
    eligibleStudents: 320,
    appliedCount: 520,
    assessmentCount: 310,
    interviewCount: 84,
    offersReleased: 14,
    registrationDeadline: "2026-08-05",
    assessmentDate: "2026-08-10",
    interviewDate: "2026-08-15",
    offerDate: "2026-08-20",
    joiningDate: "2026-09-01",
    recruiterName: "David Miller (Staff Recruiter)",
    statusTone: "success",
  },
  {
    id: "DRIVE-2026-02",
    company: "Microsoft India",
    logoText: "MS",
    logoBg: "bg-indigo-600",
    role: "Software Development Engineer",
    CTC: "₹28.5 LPA",
    location: "Hyderabad / Noida",
    type: "On-Campus",
    stage: "Interview",
    progress: 85,
    eligibleStudents: 410,
    appliedCount: 610,
    assessmentCount: 420,
    interviewCount: 120,
    offersReleased: 12,
    registrationDeadline: "2026-07-28",
    assessmentDate: "2026-08-02",
    interviewDate: "2026-08-06",
    offerDate: "2026-08-12",
    joiningDate: "2026-09-05",
    recruiterName: "Ananya Sharma (University Lead)",
    statusTone: "info",
  },
  {
    id: "DRIVE-2026-03",
    company: "Qualcomm India",
    logoText: "Q",
    logoBg: "bg-rose-600",
    role: "Hardware Systems Engineer",
    CTC: "₹22.0 LPA",
    location: "Chennai / Hyderabad",
    type: "Virtual Drive",
    stage: "Registration Open",
    progress: 40,
    eligibleStudents: 290,
    appliedCount: 430,
    assessmentCount: 0,
    interviewCount: 0,
    offersReleased: 0,
    registrationDeadline: "2026-08-15",
    assessmentDate: "2026-08-18",
    interviewDate: "2026-08-22",
    offerDate: "2026-08-28",
    joiningDate: "2026-09-15",
    recruiterName: "Rajesh Kumar (Tech Hiring Lead)",
    statusTone: "warning",
  },
  {
    id: "DRIVE-2026-04",
    company: "Amazon Web Services (AWS)",
    logoText: "AWS",
    logoBg: "bg-amber-600",
    role: "Cloud Operations Specialist",
    CTC: "₹26.0 LPA",
    location: "Bengaluru, KA",
    type: "On-Campus",
    stage: "Result Review",
    progress: 55,
    eligibleStudents: 350,
    appliedCount: 480,
    assessmentCount: 380,
    interviewCount: 45,
    offersReleased: 10,
    registrationDeadline: "2026-08-01",
    assessmentDate: "2026-08-05",
    interviewDate: "2026-08-12",
    offerDate: "2026-08-18",
    joiningDate: "2026-09-10",
    recruiterName: "Samantha Wright (Talent Manager)",
    statusTone: "purple",
  },
  {
    id: "DRIVE-2026-05",
    company: "Tesla Motors",
    logoText: "T",
    logoBg: "bg-purple-600",
    role: "Autopilot Systems Analyst",
    CTC: "₹28.0 LPA",
    location: "Bengaluru R&D",
    type: "On-Campus",
    stage: "Draft",
    progress: 15,
    eligibleStudents: 180,
    appliedCount: 0,
    assessmentCount: 0,
    interviewCount: 0,
    offersReleased: 0,
    registrationDeadline: "2026-08-25",
    assessmentDate: "2026-08-28",
    interviewDate: "2026-09-02",
    offerDate: "2026-09-08",
    joiningDate: "2026-09-20",
    recruiterName: "Marcus Vance (Senior Recruiter)",
    statusTone: "rose",
  },
  {
    id: "DRIVE-2026-06",
    company: "Infosys Limited",
    logoText: "INF",
    logoBg: "bg-emerald-600",
    role: "Systems Engineer Specialist",
    CTC: "₹9.5 LPA",
    location: "Mysuru / Pan India",
    type: "Off-Campus",
    stage: "Completed",
    progress: 100,
    eligibleStudents: 650,
    appliedCount: 820,
    assessmentCount: 740,
    interviewCount: 220,
    offersReleased: 95,
    registrationDeadline: "2026-06-15",
    assessmentDate: "2026-06-20",
    interviewDate: "2026-06-25",
    offerDate: "2026-07-05",
    joiningDate: "2026-08-01",
    recruiterName: "Priya Nair (Global Campus Lead)",
    statusTone: "success",
  },
];

const STAGE_WORKFLOW_PIPELINE = [
  { stage: "Draft", count: 2, pct: "5%", color: "bg-muted-foreground" },
  { stage: "Published", count: 4, pct: "10%", color: "bg-blue-500" },
  { stage: "Registration Open", count: 3, pct: "15%", color: "bg-amber-500" },
  { stage: "Assessment", count: 5, pct: "25%", color: "bg-purple-500" },
  { stage: "Result Review", count: 3, pct: "15%", color: "bg-indigo-500" },
  { stage: "Interview", count: 4, pct: "20%", color: "bg-cyan-500" },
  { stage: "Offer", count: 2, pct: "10%", color: "bg-teal-500" },
  { stage: "Completed", count: 12, pct: "100%", color: "bg-emerald-500" },
];

const DRIVE_CALENDAR_EVENTS = [
  { date: "Aug 02", title: "Microsoft Online Aptitude Assessment", type: "Assessment", color: "bg-purple-500/10 text-purple-600" },
  { date: "Aug 06", title: "Microsoft Technical Interview Round 1", type: "Interview", color: "bg-blue-500/10 text-blue-600" },
  { date: "Aug 10", title: "Google Cloud Technical Test #1", type: "Assessment", color: "bg-purple-500/10 text-purple-600" },
  { date: "Aug 12", title: "AWS Technical & HR Panels", type: "Interview", color: "bg-blue-500/10 text-blue-600" },
  { date: "Aug 15", title: "Google Cloud Offer Letters Distribution", type: "Offer", color: "bg-emerald-500/10 text-emerald-600" },
  { date: "Aug 18", title: "Qualcomm Campus Drive Assessment", type: "Assessment", color: "bg-purple-500/10 text-purple-600" },
];

const DRIVE_ANALYTICS_DATA = [
  { name: "Google Cloud", applications: 520, assessmentPass: 310, interviews: 84, offers: 14 },
  { name: "Microsoft", applications: 610, assessmentPass: 420, interviews: 120, offers: 12 },
  { name: "AWS", applications: 480, assessmentPass: 380, interviews: 45, offers: 10 },
  { name: "Qualcomm", applications: 430, assessmentPass: 290, interviews: 32, offers: 8 },
  { name: "Infosys", applications: 820, assessmentPass: 740, interviews: 220, offers: 95 },
];

export function DriveManagementWorkspace() {
  // Local React States
  const [drives, setDrives] = useState<PlacementDrive[]>(INITIAL_DRIVES);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"cards" | "calendar">("cards");

  // Selected Drive for Workspace Sheet / Modal
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState("overview");

  // Create & Import Modal States
  const [activeModal, setActiveModal] = useState<"none" | "create_drive" | "import_drive">("none");

  // Form State for Create Drive Modal
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCTC, setFormCTC] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formType, setFormType] = useState<PlacementDrive["type"]>("On-Campus");

  // Handlers
  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole) {
      toast.error("Please enter Company Name and Role");
      return;
    }

    const newDrive: PlacementDrive = {
      id: `DRIVE-2026-${String(drives.length + 1).padStart(2, "0")}`,
      company: formCompany,
      logoText: formCompany.substring(0, 2).toUpperCase(),
      logoBg: "bg-purple-600",
      role: formRole,
      CTC: formCTC || "₹18.0 LPA",
      location: formLocation || "Bengaluru, KA",
      type: formType,
      stage: "Published",
      progress: 20,
      eligibleStudents: 300,
      appliedCount: 150,
      assessmentCount: 0,
      interviewCount: 0,
      offersReleased: 0,
      registrationDeadline: "2026-08-20",
      assessmentDate: "2026-08-25",
      interviewDate: "2026-08-28",
      offerDate: "2026-09-02",
      joiningDate: "2026-09-15",
      recruiterName: "Corporate HR Manager",
      statusTone: "info",
    };

    setDrives([newDrive, ...drives]);
    setActiveModal("none");
    setFormCompany("");
    setFormRole("");
    setFormCTC("");
    setFormLocation("");
    toast.success(`Published new campus recruitment drive for "${formCompany}"!`);
  };

  // Filter Logic
  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "All" || d.stage === stageFilter;
    const matchesType = typeFilter === "All" || d.type === typeFilter;
    return matchesSearch && matchesStage && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ==================================================================== */}
      {/* 1. EXECUTIVE HEADER (GLASSMORPHISM & QUICK ACTIONS)                 */}
      {/* ==================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand-gradient text-white font-mono text-[0.7rem] px-3 py-1">
                PLACEMENT OPERATIONS HUB
              </Badge>
              <Badge variant="outline" className="font-mono text-[0.7rem] bg-background/80">
                AY 2026–2027
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Placement Drive Management Workspace
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Create, monitor, and manage the complete lifecycle of corporate recruitment drives from registration to offer release.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setActiveModal("create_drive")}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Briefcase className="size-4" /> + Create Placement Drive
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveModal("import_drive")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Upload className="size-3.5" /> Import Drive
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const headers = ["Drive ID", "Company", "Role", "CTC", "Stage", "Applied", "Offers"];
                const rows = drives.map((d) => [d.id, d.company, d.role, d.CTC, d.stage, d.appliedCount, d.offersReleased]);
                const csvContent = [headers.join(","), ...rows.map((r) => r.map((x) => `"${x}"`).join(","))].join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `placement_drives_export_${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                toast.success("Downloaded Placement Drives CSV");
              }}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export CSV
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "outline"}
              onClick={() => setViewMode(viewMode === "cards" ? "calendar" : "cards")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5 font-bold"
            >
              <CalendarDays className="size-3.5" /> {viewMode === "cards" ? "Calendar View" : "Cards View"}
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. EXECUTIVE KPI DASHBOARD (10 CARDS)                                */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Campus Drive Key Performance Indicators
          </h3>
          <Badge variant="outline" className="text-[0.65rem] font-mono">Live Operations Center</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total Drives", val: `${drives.length + 28}`, trend: "+8 this month", desc: "Registered campus drives", progress: 95 },
            { label: "Draft Drives", val: "2", trend: "Pending publish", desc: "Drive setup in progress", progress: 20 },
            { label: "Published Drives", val: "4", trend: "Student portal live", desc: "Open for applications", progress: 40 },
            { label: "Active Drives", val: `${drives.length}`, trend: "Live now", desc: "Ongoing recruitment rounds", progress: 75 },
            { label: "Assessment Running", val: "5", trend: "Online coding/test", desc: "Evaluating test scores", progress: 60 },
            { label: "Interview Stage", val: "4", trend: "18 panels today", desc: "Technical & HR rounds", progress: 80 },
            { label: "Offers Released", val: "120", trend: "+15 this week", desc: "Verified formal offers", progress: 85 },
            { label: "Completed Drives", val: "12", trend: "100% closed", desc: "Hiring cycle finished", progress: 100 },
            { label: "Cancelled Drives", val: "0", trend: "0% loss", desc: "Full partner commitment", progress: 0 },
            { label: "Avg Hiring Ratio", val: "78.4%", trend: "+6.2% YoY", desc: "Application conversion", progress: 78 },
          ].map((kpi) => (
            <div
              key={kpi.label}
              onClick={() => toast.info(`Viewing metrics for ${kpi.label}`)}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm space-y-2 hover:border-primary/40 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-semibold text-muted-foreground">{kpi.label}</span>
                <span className="text-[0.65rem] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  {kpi.trend}
                </span>
              </div>
              <p className="font-display text-2xl font-extrabold">{kpi.val}</p>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${kpi.progress}%` }} />
                </div>
                <p className="text-[0.65rem] text-muted-foreground">{kpi.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. HORIZONTAL 8-STAGE RECRUITMENT DRIVE PIPELINE                     */}
      {/* ==================================================================== */}
      <Panel
        title="8-Stage Recruitment Drive Lifecycle Pipeline"
        description="Real-time status progression of drives from initial drafting to final drive completion."
        action={<Badge variant="outline" className="font-mono text-xs">Drive Velocity Funnel</Badge>}
      >
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 pt-2">
          {STAGE_WORKFLOW_PIPELINE.map((s, idx) => (
            <div
              key={s.stage}
              onClick={() => {
                setStageFilter(s.stage);
                toast.info(`Filtered drives for stage: ${s.stage}`);
              }}
              className={`p-3 rounded-xl border ${stageFilter === s.stage ? "border-primary bg-primary/5 shadow-glow" : "border-border/60 bg-muted/30"} space-y-2 flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-mono font-bold text-muted-foreground">0{idx + 1}</span>
                <span className="text-[0.65rem] font-mono font-bold text-primary">{s.pct}</span>
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{s.stage}</p>
                <p className="font-display text-lg font-extrabold mt-0.5">{s.count} Drives</p>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(idx + 1) * 12.5}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ==================================================================== */}
      {/* 10. SEARCH & ENTERPRISE FILTERS BAR                                  */}
      {/* ==================================================================== */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drives by company name, job role, or location..."
              className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Drive Stages</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Registration Open">Registration Open</option>
              <option value="Assessment">Assessment</option>
              <option value="Result Review">Result Review</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Drive Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Drive Types</option>
              <option value="On-Campus">On-Campus</option>
              <option value="Virtual Drive">Virtual Drive</option>
              <option value="Off-Campus">Off-Campus</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStageFilter("All");
                setTypeFilter("All");
                toast.info("Reset all drive filters");
              }}
              className="h-10 text-xs rounded-xl cursor-pointer"
            >
              <RefreshCw className="size-3.5 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. ACTIVE PLACEMENT DRIVES (CARDS / CALENDAR VIEWS)                  */}
      {/* ==================================================================== */}
      {viewMode === "cards" ? (
        <Panel
          title="Active Recruitment Drive Workspaces"
          description="Click 'View Workspace' to enter the full operational workspace for any drive."
          action={
            <Badge variant="outline" className="font-mono text-xs">
              Showing {filteredDrives.length} Drives
            </Badge>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {filteredDrives.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-border/70 bg-card space-y-4 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-11 rounded-2xl ${d.logoBg} text-white grid place-items-center font-extrabold text-base shadow-xs`}>
                        {d.logoText}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold">{d.company}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{d.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5">
                      {d.CTC}
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-xl grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground block font-sans">Applications</span>
                      <span className="font-bold">{d.appliedCount} Students</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground block font-sans font-bold text-purple-600">Tests Completed</span>
                      <span className="font-bold">{d.assessmentCount} Candidates</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground block font-sans font-bold text-blue-600">Interviews Booked</span>
                      <span className="font-bold">{d.interviewCount} Panels</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground block font-sans font-bold text-emerald-600">Offers Released</span>
                      <span className="font-bold">{d.offersReleased} Issued</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[0.7rem] text-muted-foreground font-medium">Drive Stage Progress</span>
                      <span className="font-bold font-mono">{d.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${d.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[0.68rem] font-mono">
                    {d.stage}
                  </Badge>
                  <Button
                    size="sm"
                    asChild
                    className="bg-brand-gradient shadow-glow font-bold text-xs h-8 rounded-xl cursor-pointer"
                  >
                    <Link to="/placement/drives/$driveId" params={{ driveId: d.id }}>
                      View Workspace <ChevronRight className="size-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        /* 8. ACTIVE CALENDAR VIEW */
        <Panel title="Placement Schedule Calendar" description="Monthly timeline of test dates, interview rounds, and offer letters.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {DRIVE_CALENDAR_EVENTS.map((ev, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{ev.date}</span>
                  <Badge variant="outline" className={`text-[0.65rem] font-mono ${ev.color}`}>
                    {ev.type}
                  </Badge>
                </div>
                <h4 className="font-display text-xs font-bold">{ev.title}</h4>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* ==================================================================== */}
      {/* 9. RECHARTS DRIVE ANALYTICS & 11. AI INSIGHTS ROW                    */}
      {/* ==================================================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* CHART (2 COLS) */}
        <div className="lg:col-span-2">
          <Panel title="Drive Recruitment Conversion Velocity" description="Comparative analysis of applications, test clearances, interviews, and final offers.">
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DRIVE_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="assessmentPass" fill="#8b5cf6" name="Assessment Cleared" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="offers" fill="#10b981" name="Offers Issued" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* AI INSIGHTS (1 COL) */}
        <Panel title="AI Placement Drive Intelligence" description="Smart alerts powered by EduSuite AI." action={<Sparkles className="size-4 text-purple-500" />}>
          <div className="space-y-3 pt-1">
            {[
              { title: "Google Drive Pending Approval", desc: "Brochure & test eligibility policy requires TPO approval.", tag: "Action Needed" },
              { title: "Microsoft Interview Tomorrow", desc: "12 interview panels booked starting at 10:00 AM.", tag: "Reminder" },
              { title: "Amazon Deadline Closing", desc: "Student application registration closes today at 5:00 PM.", tag: "Urgent" },
              { title: "Infosys Drive Completed", desc: "95 final offer letters successfully verified by TPO.", tag: "Complete" },
            ].map((ai) => (
              <div key={ai.title} className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Sparkles className="size-3 text-purple-500" /> {ai.title}
                  </span>
                  <Badge variant="outline" className="text-[0.62rem] font-mono">{ai.tag}</Badge>
                </div>
                <p className="text-[0.725rem] text-muted-foreground">{ai.desc}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ==================================================================== */}
      {/* 5. PLACEMENT DRIVE WORKSPACE (SLIDE-OVER SHEET / DRAWER)            */}
      {/* ==================================================================== */}
      <Sheet open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto space-y-4">
          {selectedDrive && (
            <>
              <SheetHeader className="pb-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-2xl ${selectedDrive.logoBg} text-white grid place-items-center font-extrabold text-lg shadow-xs`}>
                    {selectedDrive.logoText}
                  </div>
                  <div>
                    <SheetTitle className="text-base font-extrabold">{selectedDrive.company} Workspace</SheetTitle>
                    <SheetDescription className="text-xs font-semibold text-primary">
                      Role: {selectedDrive.role} • Package: {selectedDrive.CTC}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* 10 WORKSPACE TABS */}
              <Tabs value={workspaceTab} onValueChange={setWorkspaceTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl w-full grid grid-cols-4 text-[0.62rem] font-bold mb-4">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="applications" className="rounded-lg">Applications</TabsTrigger>
                  <TabsTrigger value="timeline" className="rounded-lg">Timeline</TabsTrigger>
                  <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p><span className="font-semibold text-muted-foreground">Drive ID:</span> {selectedDrive.id}</p>
                    <p><span className="font-semibold text-muted-foreground">Company HR Recruiter:</span> {selectedDrive.recruiterName}</p>
                    <p><span className="font-semibold text-muted-foreground">Work Location:</span> {selectedDrive.location}</p>
                    <p><span className="font-semibold text-muted-foreground">Drive Type:</span> {selectedDrive.type}</p>
                    <p><span className="font-semibold text-muted-foreground">Registration Deadline:</span> {selectedDrive.registrationDeadline}</p>
                    <p><span className="font-semibold text-muted-foreground">Assessment Date:</span> {selectedDrive.assessmentDate}</p>
                    <p><span className="font-semibold text-muted-foreground">Interview Date:</span> {selectedDrive.interviewDate}</p>
                    <p><span className="font-semibold text-muted-foreground">Offer Date:</span> {selectedDrive.offerDate}</p>
                    <p><span className="font-semibold text-muted-foreground">Joining Date:</span> {selectedDrive.joiningDate}</p>
                  </div>
                </TabsContent>

                {/* APPLICATIONS TAB */}
                <TabsContent value="applications" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2 border border-border/50 font-mono">
                    <p><span className="text-muted-foreground font-sans">Eligible Candidate Pool:</span> {selectedDrive.eligibleStudents} Students</p>
                    <p><span className="text-muted-foreground font-sans font-bold text-blue-600">Total Applications Received:</span> {selectedDrive.appliedCount}</p>
                    <p><span className="text-muted-foreground font-sans font-bold text-purple-600">Assessment Cleared:</span> {selectedDrive.assessmentCount}</p>
                    <p><span className="text-muted-foreground font-sans font-bold text-cyan-600">Interview Slots Booked:</span> {selectedDrive.interviewCount}</p>
                    <p><span className="text-muted-foreground font-sans font-bold text-emerald-600">Final Offers Released:</span> {selectedDrive.offersReleased}</p>
                  </div>
                </TabsContent>

                {/* TIMELINE TAB */}
                <TabsContent value="timeline" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-3 border border-border/50">
                    <p className="font-bold text-foreground">Vertical Drive Lifecycle Timeline</p>
                    <div className="space-y-2 border-l-2 border-primary/40 pl-3">
                      <p><span className="font-bold text-primary">• Drive Created</span> - Setup by TPO Admin</p>
                      <p><span className="font-bold text-primary">• Published</span> - Live on Student Portal</p>
                      <p><span className="font-bold text-primary">• Applications Open</span> - {selectedDrive.appliedCount} Registered</p>
                      <p><span className="font-bold text-primary">• Assessment Running</span> - Online Coding Test</p>
                      <p><span className="font-bold text-primary">• Technical & HR Interviews</span> - Panel evaluation</p>
                      <p><span className="font-bold text-emerald-600">• Offers Released</span> - {selectedDrive.offersReleased} Issued</p>
                    </div>
                  </div>
                </TabsContent>

                {/* ANALYTICS TAB */}
                <TabsContent value="analytics" className="space-y-3 text-xs mt-0">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-2 border border-border/50 font-mono">
                    <p><span className="font-sans font-bold">Conversion Rate:</span> {((selectedDrive.offersReleased / (selectedDrive.appliedCount || 1)) * 100).toFixed(1)}%</p>
                    <p><span className="font-sans font-bold">Assessment Pass Rate:</span> {((selectedDrive.assessmentCount / (selectedDrive.appliedCount || 1)) * 100).toFixed(1)}%</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ==================================================================== */}
      {/* INTERACTIVE MODALS                                                   */}
      {/* ==================================================================== */}

      {/* CREATE DRIVE MODAL */}
      <Dialog open={activeModal === "create_drive"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Launch New Placement Drive</DialogTitle>
            <DialogDescription>Schedule and publish a corporate recruitment drive.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDriveSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Company Name</label>
              <Input
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Google Cloud India"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Job Designation / Role</label>
                <Input
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="Software Engineer I"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">CTC Package</label>
                <Input
                  value={formCTC}
                  onChange={(e) => setFormCTC(e.target.value)}
                  placeholder="₹24.0 LPA"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Work Location</label>
                <Input
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Bengaluru, KA"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Drive Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as PlacementDrive["type"])}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold"
                >
                  <option value="On-Campus">On-Campus</option>
                  <option value="Virtual Drive">Virtual Drive</option>
                  <option value="Off-Campus">Off-Campus</option>
                </select>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal("none")} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">Publish Drive</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
