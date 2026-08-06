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
  UserCheck,
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
    assessmentDate: "2026-08-04",
    interviewDate: "2026-08-09",
    offerDate: "2026-08-14",
    joiningDate: "2026-09-01",
    recruiterName: "Priya Varma (Campus Lead)",
    statusTone: "purple",
  },
  {
    id: "DRIVE-2026-05",
    company: "TCS (Tata Consultancy Services)",
    logoText: "TCS",
    logoBg: "bg-blue-700",
    role: "Ninja & Digital & Prime Tiers",
    CTC: "₹3.36 LPA - ₹11.5 LPA",
    location: "Pan India / Hyderabad",
    type: "On-Campus",
    stage: "Assessment",
    progress: 70,
    eligibleStudents: 580,
    appliedCount: 750,
    assessmentCount: 520,
    interviewCount: 140,
    offersReleased: 28,
    registrationDeadline: "2026-08-08",
    assessmentDate: "2026-08-12",
    interviewDate: "2026-08-18",
    offerDate: "2026-08-24",
    joiningDate: "2026-09-10",
    recruiterName: "Siddharth Mehta (Staff HR)",
    statusTone: "success",
  },
];

const DRIVE_ANALYTICS_DATA = [
  { name: "Google Cloud", applications: 520, assessmentPass: 310, offers: 14 },
  { name: "Microsoft", applications: 610, assessmentPass: 420, offers: 12 },
  { name: "Qualcomm", applications: 430, assessmentPass: 290, offers: 8 },
  { name: "AWS", applications: 480, assessmentPass: 380, offers: 10 },
  { name: "TCS", applications: 750, assessmentPass: 520, offers: 28 },
];

const DRIVE_CALENDAR_EVENTS = [
  { date: "Aug 05, 2026", title: "Google Cloud Registration Cut-off", type: "Deadline", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  { date: "Aug 10, 2026", title: "Google Cloud Online Assessment Day", type: "Assessment", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { date: "Aug 15, 2026", title: "Google Cloud Technical Interview Panels", type: "Interview", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { date: "Aug 18, 2026", title: "Qualcomm Online Screening Test", type: "Assessment", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { date: "Aug 20, 2026", title: "Google Cloud Offer Letter Distribution", type: "Offers", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

export function DriveManagementWorkspace(props: any) {
  return <PlacementDriveWorkspace {...props} />;
}

export function PlacementDriveWorkspace() {
  const [drives, setDrives] = useState<PlacementDrive[]>(INITIAL_DRIVES);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"cards" | "calendar">("cards");

  // Selected Drive for Details Drawer
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);

  // Recruiter Assignment Modal State
  const [assignDriveTarget, setAssignDriveTarget] = useState<PlacementDrive | null>(null);
  const [selectedRecruiterOption, setSelectedRecruiterOption] = useState("David Miller (Staff Recruiter - Google Cloud)");
  const [recruiterScopeOption, setRecruiterScopeOption] = useState("Full Drive & Assessment Scope");

  // Create Drive Modal State
  const [activeModal, setActiveModal] = useState<"none" | "create_drive" | "import_drive">("none");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCTC, setFormCTC] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formType, setFormType] = useState<PlacementDrive["type"]>("On-Campus");

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
    <div className="space-y-8 font-sans animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
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
              Create placement drives, assign provisioned corporate recruiters (e.g. <strong>David Miller</strong>), monitor assessment progress, and manage candidate shortlist releases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setActiveModal("create_drive")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5 shadow-md"
            >
              <Briefcase className="size-4" /> + Create Placement Drive
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const headers = ["Drive ID", "Company", "Role", "CTC", "Assigned Recruiter", "Stage", "Applied", "Offers"];
                const rows = drives.map((d) => [d.id, d.company, d.role, d.CTC, d.recruiterName, d.stage, d.appliedCount, d.offersReleased]);
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
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
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

      {/* DRIVES GRID */}
      {viewMode === "cards" ? (
        <Panel title={`Active Placement Drives (${filteredDrives.length} Drives)`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 font-mono text-xs">
            {filteredDrives.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-border/70 bg-card space-y-4 hover:border-blue-400 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-11 rounded-2xl ${d.logoBg} text-white grid place-items-center font-extrabold text-base shadow-xs`}>
                        {d.logoText}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm font-sans text-foreground">{d.company}</h4>
                        <p className="text-xs text-muted-foreground font-sans">{d.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950">
                      {d.CTC}
                    </Badge>
                  </div>

                  {/* ASSIGNED RECRUITER BADGE & ACTION BUTTON */}
                  <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <UserCheck className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="text-[0.68rem] text-muted-foreground font-sans truncate">
                        HR: <strong className="text-foreground">{d.recruiterName}</strong>
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAssignDriveTarget(d);
                        setSelectedRecruiterOption(d.recruiterName);
                      }}
                      className="h-6 text-[0.62rem] font-bold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg px-2 cursor-pointer shrink-0 font-sans"
                    >
                      Assign / Switch HR
                    </Button>
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
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-[0.7rem] text-muted-foreground font-medium">Drive Stage Progress</span>
                      <span className="font-bold font-mono">{d.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50 font-sans">
                  <Badge className="bg-emerald-600 text-white text-[0.68rem] font-mono">
                    {d.stage}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => setSelectedDrive(d)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 rounded-xl cursor-pointer gap-1"
                  >
                    View Details <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel title="Placement Schedule Calendar">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2 font-mono text-xs">
            {DRIVE_CALENDAR_EVENTS.map((ev, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600">{ev.date}</span>
                  <Badge variant="outline" className={`text-[0.65rem] font-mono ${ev.color}`}>
                    {ev.type}
                  </Badge>
                </div>
                <h4 className="font-sans text-xs font-bold text-foreground">{ev.title}</h4>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* ASSIGN RECRUITER TO DRIVE MODAL */}
      <Dialog open={!!assignDriveTarget} onOpenChange={(open) => !open && setAssignDriveTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-extrabold">
              <UserPlus className="size-5 text-blue-600" /> Assign Provisioned Corporate Recruiter
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              Authorize a provisioned recruiter account to manage <strong>{assignDriveTarget?.company} - {assignDriveTarget?.role}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (assignDriveTarget) {
                setDrives((prev) =>
                  prev.map((drv) =>
                    drv.id === assignDriveTarget.id
                      ? { ...drv, recruiterName: selectedRecruiterOption }
                      : drv
                  )
                );
                toast.success(
                  `Assigned "${selectedRecruiterOption}" to ${assignDriveTarget.company} drive! Access email invitation sent.`
                );
                setAssignDriveTarget(null);
              }
            }}
            className="space-y-4 pt-2 font-mono text-xs"
          >
            <div className="p-3 bg-muted/40 rounded-2xl border border-border space-y-1">
              <p className="text-[0.68rem] font-bold text-muted-foreground uppercase font-sans">Target Recruitment Drive:</p>
              <p className="font-extrabold text-foreground text-sm font-sans">{assignDriveTarget?.company}</p>
              <p className="text-xs text-primary font-bold">{assignDriveTarget?.role} • CTC: {assignDriveTarget?.CTC}</p>
            </div>

            <div className="space-y-1 font-sans">
              <label className="text-xs font-bold text-foreground">Select Provisioned Corporate Recruiter Account:</label>
              <select
                value={selectedRecruiterOption}
                onChange={(e) => setSelectedRecruiterOption(e.target.value)}
                className="w-full h-10 text-xs rounded-xl bg-background border border-input px-3 font-sans font-bold"
              >
                <option value="David Miller (Staff Recruiter - Google Cloud)">David Miller (david.miller@google.com) — Google Cloud HR</option>
                <option value="Ananya Sharma (University Lead - Microsoft)">Ananya Sharma (ananya@microsoft.com) — Microsoft Lead</option>
                <option value="Rajesh Kumar (Tech Hiring Lead - Qualcomm)">Rajesh Kumar (rajesh@qualcomm.com) — Qualcomm Lead</option>
                <option value="Priya Varma (Campus Lead - Amazon AWS)">Priya Varma (priya@amazon.com) — Amazon AWS Lead</option>
                <option value="Siddharth Mehta (Staff HR - TCS)">Siddharth Mehta (siddharth@tcs.com) — TCS Talent Lead</option>
              </select>
            </div>

            <div className="space-y-1 font-sans">
              <label className="text-xs font-bold text-foreground">Recruiter Drive Access Privileges Scope:</label>
              <select
                value={recruiterScopeOption}
                onChange={(e) => setRecruiterScopeOption(e.target.value)}
                className="w-full h-10 text-xs rounded-xl bg-background border border-input px-3 font-sans"
              >
                <option value="Full Drive & Assessment Scope">Full Drive Scope (Forms, ATS Resumes, Test Dispatch &amp; Interviews)</option>
                <option value="Assessment & Candidate Review Only">Assessment &amp; Candidate Resume Review Only</option>
                <option value="Interview Panel Lead Only">Interview Panel Scheduling Only</option>
              </select>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 text-[0.68rem] text-blue-900 dark:text-blue-200 font-sans">
              ✓ Once confirmed, <strong>{selectedRecruiterOption}</strong> can log into their External Recruiter Portal to manage this placement drive.
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAssignDriveTarget(null)} className="rounded-xl h-9 text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-9 text-xs cursor-pointer gap-1.5 shadow-md">
                <UserCheck className="size-4" /> Confirm Assignment &amp; Dispatch Access
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE DRIVE MODAL */}
      <Dialog open={activeModal === "create_drive"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl font-sans">
          <DialogHeader>
            <DialogTitle>Launch New Placement Drive</DialogTitle>
            <DialogDescription>Schedule and publish a corporate recruitment drive.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDriveSubmit} className="space-y-3.5 pt-2 font-mono text-xs">
            <div className="space-y-1 font-sans">
              <label className="text-xs font-semibold">Company Name</label>
              <Input
                required
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Google Cloud India"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 font-sans">
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
            <div className="grid grid-cols-2 gap-3 font-sans">
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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer">Publish Drive</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { PlacementDriveWorkspace as DriveManagementWorkspace };
export default PlacementDriveWorkspace;
