import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
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
  ArrowLeft,
  Send,
  Lock,
  FileCheck,
  SlidersHorizontal,
  Tag as TagIcon,
  MessageCircle,
  Scale,
  FileDown,
  Sparkle,
  CheckSquare2,
  FileQuestion,
  UserCheck,
  UserX2,
  Play,
  Pause,
  AlertTriangle,
  Monitor,
  Code2,
  Database,
  HelpCircle,
  ShieldAlert,
  CheckSquare as CheckSquareIcon,
  FolderTree,
  Radio,
  Wifi,
  Camera,
  Mic,
  AlertOctagon,
  Volume2,
  Server,
  Terminal,
  ActivitySquare,
  Trophy,
  Medal,
  Percent,
  UserCheck2,
  Share2,
  UserPlus2,
  DollarSign,
  FileBadge,
  GraduationCap as GraduationCapIcon,
  Printer,
  FileCheck as FileCheckIcon,
  Archive,
  FolderArchive,
  CheckSquare as CheckSquare2Icon,
} from "lucide-react";
import {
  ResponsiveContainer,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ============================================================================
// MOCK DATA TYPES & SETUP FOR DRIVE CLOSURE & ARCHIVE CENTER
// ============================================================================

const MOCK_DRIVE_DETAILS = {
  id: "DRIVE-2026-01",
  company: "Google Cloud India",
  logoText: "G",
  logoBg: "bg-blue-600",
  role: "Software Engineer I",
  CTC: "₹32.0 LPA",
  location: "Bengaluru / Hyderabad",
  type: "On-Campus",
  stage: "Drive Closure",
  progress: 100,
  eligibleStudents: 320,
  appliedCount: 520,
  assessmentCount: 310,
  interviewCount: 84,
  offersReleased: 14,
  placedCount: 12,
  registrationDeadline: "2026-08-05",
  assessmentDate: "2026-08-10",
  interviewDate: "2026-08-15",
  offerDate: "2026-08-20",
  joiningDate: "2026-09-01",
  recruiterName: "David Miller (Staff Recruiter)",
  recruiterEmail: "david.miller@google.com",
  recruiterPhone: "+91 98765 43210",
  minCgpa: "7.5 / 10",
  maxBacklogs: "0 Active Backlogs",
};

const CHECKLIST_ITEMS = [
  { title: "Company Profile Verified", status: "Completed", date: "2026-08-01" },
  { title: "Recruiters Approved", status: "Completed", date: "2026-08-02" },
  { title: "Registration & Applications Closed", status: "Completed", date: "2026-08-05" },
  { title: "Assessment Operations Completed", status: "Completed", date: "2026-08-10" },
  { stage: "Results Published", status: "Completed", date: "2026-08-11" },
  { title: "Interview Rounds Completed", status: "Completed", date: "2026-08-15" },
  { title: "Offers Released & Verified", status: "Completed", date: "2026-08-20" },
  { title: "Joining Confirmation Verified", status: "Completed", date: "2026-08-25" },
  { title: "Institutional Placement Completed", status: "Completed", date: "2026-08-28" },
  { title: "Audit Reports Generated", status: "Completed", date: "2026-08-01" },
];

const CLOSURE_REPORTS_LIST = [
  { name: "Comprehensive Institutional Placement Report", desc: "Complete hiring analytics, candidate list, and offer CTC data." },
  { name: "Assessment Performance & Malpractice Audit Report", desc: "Detailed breakdown of proctoring alerts and section cutoff scores." },
  { name: "Corporate Recruiter Feedback & Rating Report", desc: "Recruiter evaluations, panel comments, and candidate scores." },
  { name: "Institutional Offer Ledger & Policy Audit Report", desc: "Policy compliance confirmation (One Student One Job, Dream Upgrades)." },
];

const FUNNEL_ANALYTICS = [
  { stage: "Applied", count: 520, fill: "#3b82f6" },
  { stage: "Test Taken", count: 310, fill: "#8b5cf6" },
  { stage: "Qualified", count: 84, fill: "#10b981" },
  { stage: "Interviewed", count: 68, fill: "#f59e0b" },
  { stage: "Offers", count: 14, fill: "#ec4899" },
  { stage: "Placed", count: 12, fill: "#06b6d4" },
];

export function PlacementDriveDetailsWorkspace() {
  const { driveId } = useParams({ strict: false }) as { driveId?: string };
  const [activeTab, setActiveTab] = useState("closure");

  // Closure State
  const [isDriveClosed, setIsDriveClosed] = useState(false);
  const [isDriveArchived, setIsDriveArchived] = useState(false);

  // Dialog States
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  // Action Handlers
  const handleConfirmCloseDrive = () => {
    setIsDriveClosed(true);
    setIsCloseModalOpen(false);
    toast.success("Drive DRIVE-2026-01 (Google Cloud India) has been officially CLOSED.");
  };

  const handleConfirmArchiveDrive = () => {
    setIsDriveArchived(true);
    setIsArchiveModalOpen(false);
    toast.success("Drive DRIVE-2026-01 has been moved to Archived Drives!");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* BREADCRUMB & BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1.5 cursor-pointer">
          <Link to="/placement/drives">
            <ArrowLeft className="size-4" /> Back to All Placement Drives
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">
          Drive Reference ID: {driveId || MOCK_DRIVE_DETAILS.id}
        </Badge>
      </div>

      {/* EXECUTIVE FULL-PAGE HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className={`size-16 rounded-2xl ${MOCK_DRIVE_DETAILS.logoBg} text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0`}>
              {MOCK_DRIVE_DETAILS.logoText}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${isDriveClosed ? "bg-rose-600" : "bg-emerald-600"} text-white font-mono text-[0.7rem]`}>
                  ● {isDriveArchived ? "Drive Archived" : isDriveClosed ? "Drive Closed (Read-Only)" : "Drive Ready for Closure"}
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem] bg-primary/5 text-primary">
                  {MOCK_DRIVE_DETAILS.company}
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Drive Closure & Archive Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Finalize recruitment operations, archive the drive, preserve audit history, and generate institutional reports.
              </p>
            </div>
          </div>

          {/* HEADER ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsCloseModalOpen(true)}
              disabled={isDriveClosed}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5 shadow-glow"
            >
              <Lock className="size-4" /> {isDriveClosed ? "Drive Closed" : "Close Drive"}
            </Button>
            <Button
              onClick={() => setIsArchiveModalOpen(true)}
              disabled={isDriveArchived}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Archive className="size-4" /> {isDriveArchived ? "Archived" : "Archive Drive"}
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Generated Complete Drive Operational Report PDF")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5 font-bold"
            >
              <FileText className="size-3.5" /> Generate Final Report
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const csvData = "Drive ID,Company,Role,Applications,Placed,Max CTC,Status\nDRIVE-2026-01,Google Cloud India,Software Engineer I,520,12,₹32.0 LPA,Closed";
                const blob = new Blob([csvData], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "google_cloud_drive_closure_archive.csv";
                a.click();
                toast.success("Exported Complete Drive Records CSV");
              }}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Complete Drive
            </Button>
          </div>
        </div>
      </div>

      {/* 13 FULL-PAGE OPERATIONAL WORKSPACE TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/40 p-1.5 rounded-2xl w-full flex flex-wrap gap-1 text-xs font-bold mb-6 overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-xl px-3 py-2">Overview</TabsTrigger>
          <TabsTrigger value="eligible" className="rounded-xl px-3 py-2">Eligible Students (320)</TabsTrigger>
          <TabsTrigger value="applications" className="rounded-xl px-3 py-2">Applications (520)</TabsTrigger>
          <TabsTrigger value="assessment" className="rounded-xl px-3 py-2">Assessment (310)</TabsTrigger>
          <TabsTrigger value="results" className="rounded-xl px-3 py-2">Results (84)</TabsTrigger>
          <TabsTrigger value="qualified" className="rounded-xl px-3 py-2">Qualified (84)</TabsTrigger>
          <TabsTrigger value="interview" className="rounded-xl px-3 py-2">Interview (68)</TabsTrigger>
          <TabsTrigger value="offers" className="rounded-xl px-3 py-2">Offers (14)</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl px-3 py-2">Completed (12)</TabsTrigger>
          <TabsTrigger value="closure" className="rounded-xl px-3 py-2 font-extrabold text-primary">
            Drive Closure & Archive (Final)
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-xl px-3 py-2">Timeline</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl px-3 py-2">Analytics</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-xl px-3 py-2">Documents</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl px-3 py-2">Settings</TabsTrigger>
        </TabsList>

        {/* 10. DRIVE CLOSURE & ARCHIVE CENTER SUB-SYSTEM */}
        <TabsContent value="closure" className="space-y-6 mt-0">

          {/* 2. KPI DASHBOARD (10 CARDS) */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
            {[
              { label: "Drive Status", val: isDriveClosed ? "Closed" : "Ready", desc: "Read-Only Prepped", color: "text-rose-600 bg-rose-500/10" },
              { label: "Applications", val: "520", desc: "Total Received", color: "text-blue-600 bg-blue-500/10" },
              { label: "Qualified", val: "84", desc: "Test Cleared", color: "text-emerald-600 bg-emerald-500/10" },
              { label: "Interviewed", val: "68", desc: "Panel Evaluated", color: "text-purple-600 bg-purple-500/10" },
              { label: "Offers Released", val: "14", desc: "Letters Sent", color: "text-purple-600 bg-purple-500/10" },
              { label: "Placed Students", val: "12", desc: "Joined & Verified", color: "text-emerald-600 bg-emerald-500/10" },
              { label: "Hiring Ratio", val: "85.7%", desc: "Offer Acceptance", color: "text-teal-600 bg-teal-500/10" },
              { label: "Drive Duration", val: "15 Days", desc: "Total Ops Time", color: "text-amber-600 bg-amber-500/10" },
              { label: "Reports Prepped", val: "7 Reports", desc: "Audited PDFs", color: "text-indigo-600 bg-indigo-500/10" },
              { label: "Archive Status", val: isDriveArchived ? "Archived" : "Ready", desc: "7-Yr Compliance", color: "text-emerald-600 bg-emerald-500/10" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-3 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs">
                <span className="text-[0.62rem] font-semibold text-muted-foreground block truncate">{kpi.label}</span>
                <p className="font-display text-lg font-extrabold truncate">{kpi.val}</p>
                <span className={`text-[0.6rem] font-mono px-1 py-0.5 rounded-md block truncate ${kpi.color}`}>
                  {kpi.desc}
                </span>
              </div>
            ))}
          </div>

          {/* 3. DRIVE COMPLETION CHECKLIST (10 ITEMS) */}
          <Panel
            title="Drive Operations Completion Audit Checklist"
            description="Verification checklist before final drive closure and institutional archiving."
            action={<Badge className="bg-emerald-600 text-white font-mono text-xs">10 / 10 Requirements Passed</Badge>}
          >
            <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-5 pt-1">
              {CHECKLIST_ITEMS.map((item) => (
                <div key={item.title} className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> {item.status}
                    </span>
                    <span className="text-[0.6rem] font-mono text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-[0.725rem] font-semibold leading-tight">{item.title}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* 6. FINAL DOCUMENT CENTER (4 INSTITUTIONAL REPORTS) */}
          <Panel
            title="Institutional Drive Closure Document & Report Center"
            description="Generate and download institutional reports for placement archives."
          >
            <div className="grid gap-4 sm:grid-cols-2 pt-1">
              {CLOSURE_REPORTS_LIST.map((rep) => (
                <div key={rep.name} className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <FileText className="size-4 text-primary" /> {rep.name}
                    </span>
                    <Badge variant="outline" className="text-[0.62rem] font-mono">PDF Report</Badge>
                  </div>
                  <p className="text-[0.725rem] text-muted-foreground font-mono">{rep.desc}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.info(`Previewing ${rep.name}`)} className="h-8 text-xs rounded-xl cursor-pointer">
                      <Eye className="size-3 mr-1" /> Preview
                    </Button>
                    <Button size="sm" onClick={() => toast.success(`Generated and downloaded ${rep.name}`)} className="h-8 text-xs bg-emerald-600 text-white rounded-xl cursor-pointer">
                      <Download className="size-3 mr-1" /> Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* 10. RECHARTS FUNNEL ANALYTICS & 9. AI EXECUTIVE SUMMARY */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Panel title="Application-to-Placement Conversion Funnel" description="Candidate drop-off and conversion across recruitment lifecycle.">
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FUNNEL_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                      <Bar dataKey="count" fill="#3b82f6" name="Candidates Count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>

            <Panel title="AI Executive Summary" description="Institutional performance highlights." action={<Sparkles className="size-4 text-purple-500" />}>
              <div className="space-y-3 pt-1">
                {[
                  { title: "Highest CTC ₹32.0 LPA", desc: "Drive achieved highest package of ₹32.0 LPA by Google Cloud.", tag: "Highest Package" },
                  { title: "96% CSE Placement", desc: "CSE department achieved 96% placement rate in this drive.", tag: "Top Dept" },
                  { title: "85.7% Offer Acceptance", desc: "12 out of 14 candidates accepted official offers.", tag: "High Conversion" },
                ].map((ai) => (
                  <div key={ai.title} className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Sparkles className="size-3 text-purple-500" /> {ai.title}
                      </span>
                      <Badge variant="outline" className="text-[0.62rem] font-mono">{ai.tag}</Badge>
                    </div>
                    <p className="text-[0.725rem] text-muted-foreground font-mono">{ai.desc}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* 7. AUDIT CENTER (CHRONOLOGICAL LOG) */}
          <Panel title="Institutional Drive Audit Trail History">
            <div className="p-4 bg-muted/30 rounded-xl space-y-3 text-xs border border-border/50 font-mono">
              <div className="space-y-2 border-l-2 border-primary/40 pl-3">
                <p><span className="font-bold text-foreground">• Drive Created</span> — Dr. Anand Sharma (Placement Officer) — 2026-08-01 09:00 AM IST</p>
                <p><span className="font-bold text-foreground">• Assessment Conducted & Published</span> — 310 candidates — 2026-08-10 11:30 AM IST</p>
                <p><span className="font-bold text-foreground">• Interviews Finalized & Offers Uploaded</span> — David Miller (Google HR) — 2026-08-20 02:00 PM IST</p>
                <p><span className="font-bold text-emerald-600">• Placement Registry Confirmed & Ready for Closure</span> — 12 candidates placed — 2026-08-28 05:00 PM IST</p>
              </div>
            </div>
          </Panel>

        </TabsContent>

        {/* OTHER WORKSPACE TABS */}
        <TabsContent value="overview" className="mt-0">
          <Panel title="Drive Overview Details">
            <div className="p-4 text-xs font-mono">Overview details for {MOCK_DRIVE_DETAILS.company}.</div>
          </Panel>
        </TabsContent>
      </Tabs>

      {/* 11. CONFIRMATION DIALOG MODAL — CLOSE DRIVE */}
      <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Lock className="size-5" /> Confirm Drive Closure
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              This will officially close the placement drive <strong>DRIVE-2026-01 (Google Cloud India)</strong>.
              After closing, the drive will become Read-Only and no further candidate operational modifications will be permitted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button variant="outline" onClick={() => setIsCloseModalOpen(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button onClick={handleConfirmCloseDrive} className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer">
              Close Placement Drive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 11. CONFIRMATION DIALOG MODAL — ARCHIVE DRIVE */}
      <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-600 flex items-center gap-2">
              <Archive className="size-5" /> Archive Placement Drive
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Move placement drive <strong>DRIVE-2026-01</strong> to institutional archived drives. Records will be preserved under 7-Year Compliance Policy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button onClick={handleConfirmArchiveDrive} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer">
              Archive Drive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
