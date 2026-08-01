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
  UserCheck,
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
  HeartPulse,
  PieChart as PieChartIcon,
  ShieldAlert,
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
import { useRole } from "@/context/role-context";

// ============================================================================
// MOCK DATA FOR CHARTS & WIDGETS
// ============================================================================

const monthlyPlacementsData = [
  { month: "Jan", offers: 45, drives: 8, avgPackage: 9.8 },
  { month: "Feb", offers: 65, drives: 12, avgPackage: 10.4 },
  { month: "Mar", offers: 90, drives: 15, avgPackage: 11.2 },
  { month: "Apr", offers: 140, drives: 22, avgPackage: 11.8 },
  { month: "May", offers: 180, drives: 28, avgPackage: 12.1 },
  { month: "Jun", offers: 240, drives: 35, avgPackage: 12.4 },
  { month: "Jul", offers: 310, drives: 40, avgPackage: 12.4 },
];

const deptPlacementData = [
  { dept: "CSE", eligible: 240, placed: 231, rate: 96.2, avg: 14.8 },
  { dept: "ECE", eligible: 180, placed: 164, rate: 91.1, avg: 12.2 },
  { dept: "EEE", eligible: 140, placed: 118, rate: 84.2, avg: 10.5 },
  { dept: "ME", eligible: 130, placed: 101, rate: 77.6, avg: 8.8 },
  { dept: "Civil", eligible: 90, placed: 65, rate: 72.2, avg: 7.9 },
  { dept: "MBA", eligible: 70, placed: 62, rate: 88.5, avg: 11.4 },
];

const packageDistData = [
  { name: "> ₹20 LPA", value: 14, color: "#8b5cf6" },
  { name: "₹12 - ₹20 LPA", value: 32, color: "#3b82f6" },
  { name: "₹6 - ₹12 LPA", value: 42, color: "#10b981" },
  { name: "< ₹6 LPA", value: 12, color: "#f59e0b" },
];

const FUNNEL_STAGES = [
  { stage: "Eligible", count: 850, pct: 100, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  { stage: "Applied", count: 720, pct: 84.7, color: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
  { stage: "Assessment", count: 610, pct: 71.8, color: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
  { stage: "Qualified", count: 420, pct: 49.4, color: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
  { stage: "Technical", count: 250, pct: 29.4, color: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
  { stage: "HR Round", count: 180, pct: 21.2, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  { stage: "Offer", count: 120, pct: 14.1, color: "bg-teal-500", text: "text-teal-600 dark:text-teal-400" },
  { stage: "Placed", count: 95, pct: 11.2, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
];

const INITIAL_DRIVES = [
  {
    id: "d1",
    company: "Google Cloud",
    role: "Software Engineer I",
    CTC: "₹32.0 LPA",
    applications: 520,
    eligible: 320,
    progress: 67,
    status: "Running",
    statusTone: "success",
    logoText: "G",
    logoBg: "bg-blue-600",
    date: "Aug 10, 2026",
  },
  {
    id: "d2",
    company: "Microsoft India",
    role: "Software Development Engineer",
    CTC: "₹28.5 LPA",
    applications: 610,
    eligible: 410,
    progress: 85,
    status: "Interviews Active",
    statusTone: "info",
    logoText: "MS",
    logoBg: "bg-indigo-600",
    date: "Aug 4, 2026",
  },
  {
    id: "d3",
    company: "Qualcomm India",
    role: "Hardware Systems Engineer",
    CTC: "₹22.0 LPA",
    applications: 430,
    eligible: 290,
    progress: 40,
    status: "Registrations Open",
    statusTone: "warning",
    logoText: "Q",
    logoBg: "bg-rose-600",
    date: "Aug 18, 2026",
  },
  {
    id: "d4",
    company: "Amazon Web Services",
    role: "Cloud Operations Specialist",
    CTC: "₹26.0 LPA",
    applications: 480,
    eligible: 350,
    progress: 55,
    status: "Shortlisting",
    statusTone: "purple",
    logoText: "AWS",
    logoBg: "bg-amber-600",
    date: "Aug 12, 2026",
  },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    dayLabel: "Today",
    time: "10:00 AM",
    title: "Google Technical Interview Round 1",
    location: "Lab 3 & Virtual Panels",
    type: "Interview",
    typeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: 2,
    dayLabel: "Tomorrow",
    time: "02:00 PM",
    title: "Microsoft Online Aptitude Assessment",
    location: "Computer Center 1 & 2",
    type: "Assessment",
    typeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    id: 3,
    dayLabel: "Friday, Aug 7",
    time: "09:00 AM",
    title: "Amazon Campus Drive Briefing Session",
    location: "Main Campus Auditorium",
    type: "Drive",
    typeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: 4,
    dayLabel: "Monday, Aug 10",
    time: "11:00 AM",
    title: "Qualcomm Final Offer Letter Distribution",
    location: "TPO Boardroom",
    type: "Offer",
    typeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];

const NOTIFICATIONS = [
  { id: 1, text: "Aptitude Test #4 for Qualcomm has been approved", type: "Assessment", unread: true, time: "5m ago" },
  { id: 2, text: "TCS Digital Off-Campus Drive published to all final year students", type: "Drive", unread: true, time: "20m ago" },
  { id: 3, text: "Google Cloud Technical Round 1 schedule updated", type: "Interview", unread: true, time: "1h ago" },
  { id: 4, text: "12 new offer letters uploaded by Microsoft HR", type: "Offer", unread: false, time: "3h ago" },
  { id: 5, text: "Senior Talent Manager from Tesla Motors registered profile", type: "Recruiter", unread: false, time: "5h ago" },
];

const RECRUITER_ACTIVITIES = [
  { id: 1, company: "Google Cloud", recruiter: "David Miller (Staff Tech Recruiter)", action: "Shortlisted 84 students for Technical Interview Round 1", time: "15 mins ago" },
  { id: 2, company: "Microsoft India", recruiter: "Ananya Sharma (University Relations Lead)", action: "Uploaded offer letters for 12 selected candidates", time: "1 hour ago" },
  { id: 3, company: "Tesla Motors", recruiter: "Marcus Vance (Senior Talent Acquisition)", action: "Signed 3-Year Institutional MoU for Campus Recruitment", time: "3 hours ago" },
  { id: 4, company: "Qualcomm", recruiter: "Rajesh K. (Technical Hiring Manager)", action: "Approved online coding test threshold score (75%)", time: "Yesterday" },
];

export function PlacementDashboard() {
  const { profile } = useRole();

  // Local React State for Interactive Frontend Functionality
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [events, setEvents] = useState(UPCOMING_EVENTS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [searchFilter, setSearchFilter] = useState("");

  // Modal Dialog States for Quick Actions
  const [activeModal, setActiveModal] = useState<
    "none" | "create_drive" | "register_company" | "add_recruiter" | "publish_alert" | "generate_report" | "view_calendar" | "view_drive" | "event_detail" | "health_details"
  >("none");

  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form State for Modals
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCTC, setFormCTC] = useState("");
  const [formNoticeTitle, setFormNoticeTitle] = useState("");

  // Register Company Form State
  const [companyName, setCompanyName] = useState("");
  const [companySector, setCompanySector] = useState("IT / Software");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyTier, setCompanyTier] = useState("Tier 1 Super Dream");

  // Add Recruiter Form State
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterCompany, setRecruiterCompany] = useState("Google Cloud");
  const [recruiterDesignation, setRecruiterDesignation] = useState("Senior Talent Acquisition Lead");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");

  // Handlers for Interactive Modals
  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole) {
      toast.error("Please fill in Company Name and Role");
      return;
    }
    const newDrive = {
      id: `d${drives.length + 1}`,
      company: formCompany,
      role: formRole,
      CTC: formCTC || "₹18.0 LPA",
      applications: 120,
      eligible: 100,
      progress: 10,
      status: "Running",
      statusTone: "success",
      logoText: formCompany.substring(0, 2).toUpperCase(),
      logoBg: "bg-purple-600",
      date: "Aug 25, 2026",
    };
    setDrives([newDrive, ...drives]);
    setActiveModal("none");
    setFormCompany("");
    setFormRole("");
    setFormCTC("");
    toast.success(`Published new campus drive for ${formCompany}!`);
  };

  const handleRegisterCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) {
      toast.error("Company Legal Name is required");
      return;
    }
    setActiveModal("none");
    toast.success(`Registered corporate partner "${companyName}" (${companySector})`);
    setCompanyName("");
    setCompanyWebsite("");
  };

  const handleAddRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName || !recruiterEmail) {
      toast.error("Recruiter Full Name and Email are required");
      return;
    }
    setActiveModal("none");
    toast.success(`Invited HR recruiter ${recruiterName} (${recruiterCompany}) to TPO Portal`);
    setRecruiterName("");
    setRecruiterEmail("");
    setRecruiterPhone("");
  };

  const handlePublishAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNoticeTitle) {
      toast.error("Announcement title is required");
      return;
    }
    const newNotif = {
      id: Date.now(),
      text: formNoticeTitle,
      type: "Announcement",
      unread: true,
      time: "Just now",
    };
    setNotifications([newNotif, ...notifications]);
    setActiveModal("none");
    setFormNoticeTitle("");
    toast.success("Broadcast alert sent to all eligible students!");
  };

  const handleMarkNotifRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    toast.success("Marked notification as read");
  };

  // Filter drives based on header search
  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ==================================================================== */}
      {/* HEADER SECTION (GLASSMORPHISM & ENTERPRISE GREETING)                 */}
      {/* ==================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand-gradient text-white font-mono text-[0.7rem] px-3 py-1">
                TPO PORTAL 2026–27
              </Badge>
              <Badge variant="outline" className="font-mono text-[0.7rem] bg-background/80">
                AY 2026–2027
              </Badge>
              <Badge variant="secondary" className="font-mono text-[0.7rem]">
                Aug 01, 2026
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {profile?.personaName || "Placement Officer"} 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage campus recruitment, monitor placement activities, and track hiring progress from one single comprehensive enterprise dashboard.
            </p>
          </div>

          {/* RIGHT SIDE GLOBAL CONTROLS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Global TPO search..."
                className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-background/60 border border-border p-1 rounded-xl shadow-xs">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal("view_calendar")}
                className="relative size-9 rounded-lg cursor-pointer"
                title="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 animate-pulse" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast.info("Opening Messages Portal...")}
                className="relative size-9 rounded-lg cursor-pointer"
                title="Messages"
              >
                <MessageSquare className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-blue-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModal("view_calendar")}
                className="size-9 rounded-lg cursor-pointer"
                title="Calendar"
              >
                <CalendarDays className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                {profile?.initials || "TPO"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PLACEMENT HEALTH SCORE BANNER WIDGET                                 */}
      {/* ==================================================================== */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-emerald-500 text-white grid place-items-center shadow-glow shrink-0">
            <HeartPulse className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-extrabold">Placement Operations Health Score</h3>
              <Badge className="bg-emerald-500 text-white font-mono text-[0.65rem]">94 / 100 EXCELLENT</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Offer verification index: 98% • CGPA Verification: 95% • Recruiter SLA Response: 91% • Policy Compliance: 92%
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveModal("health_details")}
          className="text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 rounded-xl shrink-0 cursor-pointer"
        >
          View Health Audit
        </Button>
      </div>

      {/* ==================================================================== */}
      {/* QUICK ACTIONS SECTION (6 INTERACTIVE ACTION CARDS)                   */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { id: "create_drive", title: "+ Create Drive", desc: "Launch new recruitment drive", icon: Briefcase, color: "from-blue-500/10 to-indigo-500/10 text-blue-600" },
            { id: "register_company", title: "+ Register Company", desc: "Add new corporate partner", icon: Building2, color: "from-emerald-500/10 to-teal-500/10 text-emerald-600" },
            { id: "add_recruiter", title: "+ Add Recruiter", desc: "Invite corporate HR team", icon: UserPlus, color: "from-purple-500/10 to-violet-500/10 text-purple-600" },
            { id: "publish_alert", title: "+ Publish Alert", desc: "Broadcast drive notice", icon: BellRing, color: "from-amber-500/10 to-orange-500/10 text-amber-600" },
            { id: "generate_report", title: "+ Generate Report", desc: "Export NAAC / NIRF audit data", icon: FileSpreadsheet, color: "from-rose-500/10 to-pink-500/10 text-rose-600" },
            { id: "view_calendar", title: "+ View Calendar", desc: "Manage interview schedules", icon: CalendarDays, color: "from-cyan-500/10 to-blue-500/10 text-cyan-600" },
          ].map((action) => (
            <button
              key={action.title}
              onClick={() => setActiveModal(action.id as any)}
              className="text-left w-full group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className={`size-10 rounded-xl bg-gradient-to-br ${action.color} grid place-items-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="size-5" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold group-hover:text-primary transition-colors flex items-center justify-between">
                  {action.title}
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[0.7rem] text-muted-foreground mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* KPI ANALYTICS SECTION (10 ENTERPRISE CARDS)                         */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Placement Key Performance Indicators
          </h3>
          <Badge variant="outline" className="text-[0.65rem] font-mono">
            Live Metrics
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Eligible Students", val: "850", trend: "+12%", desc: "Batch of '26", progress: 100 },
            { label: "Applied Students", val: "720", trend: "+8%", desc: "84.7% registered", progress: 84.7 },
            { label: "Active Companies", val: `${drives.length + 38}`, trend: "+5 new", desc: "Live partnerships", progress: 75 },
            { label: "Active Drives", val: `${drives.length}`, trend: "3 closing", desc: "Campus drives live", progress: 60 },
            { label: "Assessments Running", val: "8", trend: "4 today", desc: "Online test rounds", progress: 45 },
            { label: "Interviews Today", val: "18", trend: "12 Tech, 6 HR", desc: "Scheduled panels", progress: 90 },
            { label: "Offers Released", val: "120", trend: "+15 this week", desc: "Verified offers", progress: 70 },
            { label: "Placement Rate", val: "88.4%", trend: "+6.2% YoY", desc: "Institutional avg", progress: 88.4 },
            { label: "Highest Package", val: "₹44.5 LPA", trend: "Google Cloud", desc: "Record high CTC", progress: 95 },
            { label: "Average Package", val: "₹12.4 LPA", trend: "+14% YoY", desc: "Institutional CTC", progress: 80 },
          ].map((kpi) => (
            <div
              key={kpi.label}
              onClick={() => toast.info(`Viewing analytics for ${kpi.label}`)}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm space-y-2 hover:border-primary/40 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold text-muted-foreground">{kpi.label}</span>
                <span className="text-[0.65rem] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  {kpi.trend}
                </span>
              </div>
              <p className="font-display text-2xl font-extrabold">{kpi.val}</p>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                    style={{ width: `${kpi.progress}%` }}
                  />
                </div>
                <p className="text-[0.65rem] text-muted-foreground">{kpi.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PLACEMENT PIPELINE (HORIZONTAL HIRING FUNNEL)                        */}
      {/* ==================================================================== */}
      <Panel
        title="Campus Recruitment Pipeline & Hiring Funnel"
        description="Real-time conversion breakdown from student registration to final offer acceptance."
        action={<Badge variant="outline" className="font-mono text-xs">8-Stage Funnel</Badge>}
      >
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 pt-2">
          {FUNNEL_STAGES.map((s, idx) => (
            <div
              key={s.stage}
              onClick={() => toast.info(`Funnel Stage: ${s.stage} — ${s.count} candidates (${s.pct}%)`)}
              className="relative p-3 rounded-xl border border-border/60 bg-muted/30 space-y-2 flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:bg-card transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-mono font-bold text-muted-foreground uppercase">Step 0{idx + 1}</span>
                <span className={`text-[0.65rem] font-bold ${s.text}`}>{s.pct}%</span>
              </div>
              <div>
                <p className="text-xs font-bold">{s.stage}</p>
                <p className="font-display text-lg font-extrabold">{s.count}</p>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ==================================================================== */}
      {/* ACTIVE DRIVES & UPCOMING EVENTS SPLIT ROW                            */}
      {/* ==================================================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ACTIVE DRIVES CARDS (2 COLS) */}
        <div className="lg:col-span-2 space-y-4">
          <Panel
            title="Active Corporate Recruitment Drives"
            description="Live ongoing campus recruitment drives and active shortlisting rounds."
            action={
              <Button variant="ghost" size="sm" asChild className="text-xs gap-1 cursor-pointer">
                <Link to="/placement/drives">View All Drives <ChevronRight className="size-3" /></Link>
              </Button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              {filteredDrives.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl border border-border/70 bg-card space-y-3 hover:border-primary/40 transition-all shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl ${d.logoBg} text-white grid place-items-center font-extrabold text-sm shadow-xs`}>
                        {d.logoText}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold">{d.company}</h4>
                        <p className="text-xs text-muted-foreground">{d.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5">
                      {d.CTC}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-1 text-xs">
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="text-[0.65rem] text-muted-foreground block">Applications</span>
                      <span className="font-bold">{d.applications} Candidates</span>
                    </div>
                    <div className="bg-muted/40 p-2 rounded-lg">
                      <span className="text-[0.65rem] text-muted-foreground block">Eligible Pool</span>
                      <span className="font-bold">{d.eligible} Verified</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[0.7rem] font-medium text-muted-foreground">Drive Progress</span>
                      <span className="font-bold">{d.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${d.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[0.68rem] font-mono">
                      {d.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(d);
                        setActiveModal("view_drive");
                      }}
                      className="h-8 text-xs rounded-xl cursor-pointer"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* UPCOMING EVENTS TIMELINE (1 COL) */}
        <div className="space-y-6">
          <Panel
            title="Upcoming Placement Schedule"
            description="Timeline of upcoming drive events, test rounds, and interview panels."
          >
            <div className="space-y-3 pt-1">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedItem(ev);
                    setActiveModal("event_detail");
                  }}
                  className="relative pl-4 border-l-2 border-primary/30 space-y-1 cursor-pointer hover:bg-muted/30 p-2 rounded-r-xl transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-mono font-bold text-primary uppercase">{ev.dayLabel} • {ev.time}</span>
                    <Badge variant="outline" className={`text-[0.62rem] font-mono ${ev.typeColor}`}>
                      {ev.type}
                    </Badge>
                  </div>
                  <h4 className="font-display text-xs font-bold">{ev.title}</h4>
                  <p className="text-[0.7rem] text-muted-foreground flex items-center gap-1">
                    <Building className="size-3" /> {ev.location}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* RECRUITER ACTIVITY & NOTIFICATIONS SPLIT ROW                         */}
      {/* ==================================================================== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RECRUITER ACTIVITY FEED */}
        <Panel
          title="Recent Recruiter Activity Feed"
          description="Live corporate partner interactions, shortlists, and HR engagements."
        >
          <div className="space-y-3 pt-1">
            {RECRUITER_ACTIVITIES.map((act) => (
              <div key={act.id} className="p-3 rounded-xl border border-border/60 bg-card space-y-1.5 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary">{act.company}</span>
                  <span className="text-[0.65rem] text-muted-foreground font-mono">{act.time}</span>
                </div>
                <p className="text-xs font-semibold text-foreground">{act.recruiter}</p>
                <p className="text-[0.725rem] text-muted-foreground">{act.action}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* NOTIFICATION CENTER */}
        <Panel title="TPO Notification Center" description="Live system alerts, recruiter updates, and approval queues.">
          <div className="space-y-2.5 pt-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkNotifRead(n.id)}
                className={`p-3 rounded-xl border ${n.unread ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card"} space-y-1 cursor-pointer hover:border-primary/60 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[0.62rem] font-mono">
                    {n.type}
                  </Badge>
                  <span className="text-[0.65rem] text-muted-foreground font-mono">{n.time}</span>
                </div>
                <p className="text-xs font-medium leading-tight">{n.text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ==================================================================== */}
      {/* ANALYTICS CHARTS (RECHARTS)                                          */}
      {/* ==================================================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* CHART 1: MONTHLY PLACEMENTS TREND */}
        <div className="lg:col-span-2">
          <Panel
            title="Monthly Placement & Drive Velocity"
            description="Comparative growth of total offers released and recruitment drives conducted."
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPlacementsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="offersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "12px", border: "1px solid #334155", color: "#fff", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="offers" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#offersGrad)" name="Total Offers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* CHART 2: PACKAGE DISTRIBUTION PIE */}
        <div>
          <Panel title="CTC Package Breakdown" description="Distribution of salary packages across placed students.">
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={packageDistData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {packageDistData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              {packageDistData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[0.7rem] font-medium text-muted-foreground">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM SECTION: DEPARTMENT LEADERBOARD & AI INSIGHTS                */}
      {/* ==================================================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* DEPARTMENT LEADERBOARD (2 COLS) */}
        <div className="lg:col-span-2">
          <Panel
            title="Department Placement Leaderboard"
            description="Branch-wise placement statistics, eligible pool, and average CTC."
          >
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-mono uppercase text-[0.65rem]">Department</th>
                    <th className="pb-2 font-mono uppercase text-[0.65rem]">Eligible</th>
                    <th className="pb-2 font-mono uppercase text-[0.65rem]">Placed</th>
                    <th className="pb-2 font-mono uppercase text-[0.65rem]">Placement %</th>
                    <th className="pb-2 font-mono uppercase text-[0.65rem]">Avg Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-medium">
                  {deptPlacementData.map((d) => (
                    <tr key={d.dept} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-bold">{d.dept}</td>
                      <td className="py-2.5 font-mono">{d.eligible}</td>
                      <td className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{d.placed}</td>
                      <td className="py-2.5 font-mono font-extrabold">{d.rate}%</td>
                      <td className="py-2.5 font-mono text-primary font-bold">₹{d.avg} LPA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* AI INSIGHTS PANEL (1 COL) */}
        <Panel
          title="AI Placement Insights"
          description="Automated intelligence recommendations powered by EduSuite AI."
          action={<Sparkles className="size-4 text-purple-500" />}
        >
          <div className="space-y-3 pt-1">
            {[
              { title: "CSE Placement Surge", desc: "CSE placement rate increased by +14% following recent Cloud drive additions.", tag: "Performance", icon: TrendingUp },
              { title: "Approvals Pending", desc: "3 recruitment drives require TPO eligibility & brochure approval today.", tag: "Action Needed", icon: AlertCircle },
              { title: "Major Drive Tomorrow", desc: "Google Cloud Round 1 interviews start tomorrow at 10:00 AM.", tag: "Reminder", icon: Calendar },
              { title: "Salary Benchmark", desc: "Average package increased by +14.2% (₹12.4 LPA) compared to last season.", tag: "Benchmark", icon: Sparkles },
            ].map((item) => (
              <div
                key={item.title}
                onClick={() => toast.success(`AI Insight Acknowledged: ${item.title}`)}
                className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <item.icon className="size-3.5 text-primary" /> {item.title}
                  </span>
                  <Badge variant="outline" className="text-[0.62rem] font-mono">
                    {item.tag}
                  </Badge>
                </div>
                <p className="text-[0.725rem] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ==================================================================== */}
      {/* INTERACTIVE DASHBOARD DIALOG MODALS                                  */}
      {/* ==================================================================== */}

      {/* HEALTH AUDIT MODAL */}
      <Dialog open={activeModal === "health_details"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <HeartPulse className="size-5" /> Placement Health Audit Report
            </DialogTitle>
            <DialogDescription>Institutional readiness index and compliance breakdown.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div className="p-3 bg-emerald-500/10 rounded-xl space-y-1.5 border border-emerald-500/20">
              <p><span className="font-semibold text-muted-foreground">Offer Verification Index:</span> 98% (118/120 Verified)</p>
              <p><span className="font-semibold text-muted-foreground">CGPA & Backlog Audit:</span> 95% Compliant</p>
              <p><span className="font-semibold text-muted-foreground">Recruiter SLA Response:</span> 91% (Avg 4.2h Response)</p>
              <p><span className="font-semibold text-muted-foreground">NAAC Placement Readiness:</span> 94% Audit Ready</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setActiveModal("none")} className="rounded-xl cursor-pointer">Close Audit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE DRIVE MODAL */}
      <Dialog open={activeModal === "create_drive"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Launch New Placement Drive</DialogTitle>
            <DialogDescription>Schedule and publish a corporate campus drive to students.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDriveSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Company Name</label>
              <Input
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Google Cloud"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Job Designation</label>
                <Input
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="Software Engineer"
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
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal("none")} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">Publish Drive</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* REGISTER COMPANY MODAL */}
      <Dialog open={activeModal === "register_company"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Register Corporate Partner (Company)</DialogTitle>
            <DialogDescription>Add new enterprise partner to institutional recruitment database.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterCompanySubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Company Legal Name</label>
              <Input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Tesla Motors India Pvt Ltd"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Industry Sector</label>
                <select
                  value={companySector}
                  onChange={(e) => setCompanySector(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold"
                >
                  <option value="IT / Software">IT / Software</option>
                  <option value="Core Engineering">Core Engineering</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Consulting & BFSI">Consulting & BFSI</option>
                  <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tier Category</label>
                <select
                  value={companyTier}
                  onChange={(e) => setCompanyTier(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold"
                >
                  <option value="Tier 1 Super Dream">Tier 1 Super Dream</option>
                  <option value="Tier 2 Dream">Tier 2 Dream</option>
                  <option value="Core Specialty">Core Specialty</option>
                  <option value="Mass Recruiter">Mass Recruiter</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Corporate Website URL</label>
              <Input
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://www.tesla.com"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal("none")} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">Register Company</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD RECRUITER MODAL */}
      <Dialog open={activeModal === "add_recruiter"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Invite Corporate HR Recruiter</DialogTitle>
            <DialogDescription>Grant TPO Portal access to an enterprise HR contact person.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRecruiterSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Recruiter Full Name</label>
              <Input
                required
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Associated Partner Company</label>
                <select
                  value={recruiterCompany}
                  onChange={(e) => setRecruiterCompany(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold"
                >
                  <option value="Google Cloud">Google Cloud</option>
                  <option value="Microsoft India">Microsoft India</option>
                  <option value="Qualcomm India">Qualcomm India</option>
                  <option value="Amazon Web Services">Amazon Web Services</option>
                  <option value="Tesla Motors">Tesla Motors</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">HR Designation</label>
                <Input
                  value={recruiterDesignation}
                  onChange={(e) => setRecruiterDesignation(e.target.value)}
                  placeholder="e.g. University Relations Lead"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Official Work Email</label>
                <Input
                  type="email"
                  required
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="ananya.sharma@company.com"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Contact Phone Number</label>
                <Input
                  value={recruiterPhone}
                  onChange={(e) => setRecruiterPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal("none")} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">Invite HR Recruiter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PUBLISH ALERT MODAL */}
      <Dialog open={activeModal === "publish_alert"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Broadcast Placement Announcement</DialogTitle>
            <DialogDescription>Send instant drive alert notification to all eligible students.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePublishAlertSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Announcement Title</label>
              <Input
                value={formNoticeTitle}
                onChange={(e) => setFormNoticeTitle(e.target.value)}
                placeholder="e.g. Amazon Interview Schedule Updated"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveModal("none")} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">Send Broadcast Alert</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW DRIVE DETAILS MODAL */}
      <Dialog open={activeModal === "view_drive"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="size-4 text-primary" /> {selectedItem?.company} Drive Details
            </DialogTitle>
            <DialogDescription>Role: {selectedItem?.role} • CTC: {selectedItem?.CTC}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-muted/40 rounded-xl space-y-1.5">
                <p><span className="font-semibold text-muted-foreground">Applications:</span> {selectedItem.applications} Candidates</p>
                <p><span className="font-semibold text-muted-foreground">Eligible Pool:</span> {selectedItem.eligible} Students</p>
                <p><span className="font-semibold text-muted-foreground">Drive Date:</span> {selectedItem.date}</p>
                <p><span className="font-semibold text-muted-foreground">Current Status:</span> {selectedItem.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setActiveModal("none")} className="rounded-xl cursor-pointer">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
