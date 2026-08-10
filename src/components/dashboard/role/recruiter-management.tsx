import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  UserCheck,
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
  Briefcase,
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
  Copy,
  Lock,
  Key,
  KeyRound,
  Printer,
  FileDown,
  Send,
  EyeOff,
  User,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ============================================================================
// MOCK DATA TYPES & ENTERPRISE RECRUITER MODELS
// ============================================================================

export type AccountStatus =
  | "Active"
  | "Pending Activation"
  | "Password Reset Required"
  | "Suspended"
  | "Inactive";

export type CredentialStatus =
  | "Generated"
  | "Sent"
  | "First Login Pending"
  | "Activated";

export interface Recruiter {
  id: string;
  recruiterId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  company: string;
  companyLogoText: string;
  companyLogoBg: string;
  industry: string;
  designation: string;
  department: string;
  location: string;
  status: AccountStatus;
  credentialStatus: CredentialStatus;
  permissionTemplate: "Recruiter" | "Senior Recruiter" | "HR Manager" | "Super Recruiter";
  drivesManaged: number;
  assessmentsCreated: number;
  interviewsScheduled: number;
  offersReleased: number;
  lastLogin: string;
  requestedDate: string;
  tempPasswordMasked: string;
  passwordLastReset: string;
  accountCreatedBy: string;
  avatar: string;
}

const INITIAL_RECRUITERS: Recruiter[] = [
  {
    id: "REC-101",
    recruiterId: "REC-GGL-2026-001",
    name: "David Miller",
    username: "david.miller",
    email: "david.miller@google.com",
    phone: "+91 98765 43210",
    company: "Google Cloud",
    companyLogoText: "G",
    companyLogoBg: "bg-blue-600",
    industry: "IT & Cloud Software",
    designation: "Staff University Recruiter",
    department: "Campus Hiring & University Relations",
    location: "Bengaluru, KA",
    status: "Active",
    credentialStatus: "Activated",
    permissionTemplate: "Super Recruiter",
    drivesManaged: 4,
    assessmentsCreated: 14,
    interviewsScheduled: 48,
    offersReleased: 14,
    lastLogin: "10 mins ago",
    requestedDate: "2026-07-15",
    tempPasswordMasked: "GGL@8742#",
    passwordLastReset: "2026-07-15",
    accountCreatedBy: "Dr. Anand Sharma (Placement Head)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "REC-102",
    recruiterId: "REC-MSF-2026-002",
    name: "Ananya Sharma",
    username: "ananya.sharma",
    email: "ananya.sharma@microsoft.com",
    phone: "+91 98123 45678",
    company: "Microsoft India",
    companyLogoText: "MS",
    companyLogoBg: "bg-indigo-600",
    industry: "Enterprise Software",
    designation: "University Relations Lead",
    department: "Global Talent Acquisition",
    location: "Hyderabad, TS",
    status: "Active",
    credentialStatus: "Activated",
    permissionTemplate: "Senior Recruiter",
    drivesManaged: 3,
    assessmentsCreated: 8,
    interviewsScheduled: 36,
    offersReleased: 12,
    lastLogin: "1 hour ago",
    requestedDate: "2026-07-18",
    tempPasswordMasked: "MSF@9912#",
    passwordLastReset: "2026-07-18",
    accountCreatedBy: "Dr. Anand Sharma (Placement Head)",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "REC-103",
    recruiterId: "REC-TSL-2026-003",
    name: "Marcus Vance",
    username: "marcus.vance",
    email: "marcus.vance@tesla.com",
    phone: "+91 97890 12345",
    company: "Tesla Motors",
    companyLogoText: "T",
    companyLogoBg: "bg-purple-600",
    industry: "Automotive Systems",
    designation: "Senior Talent Manager",
    department: "R&D Talent Operations",
    location: "Bengaluru R&D",
    status: "Pending Activation",
    credentialStatus: "First Login Pending",
    permissionTemplate: "Recruiter",
    drivesManaged: 1,
    assessmentsCreated: 2,
    interviewsScheduled: 8,
    offersReleased: 0,
    lastLogin: "Never (Pending First Login)",
    requestedDate: "2026-07-31",
    tempPasswordMasked: "TSL@4481#",
    passwordLastReset: "2026-07-31",
    accountCreatedBy: "TPO Super Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "REC-104",
    recruiterId: "REC-QLC-2026-004",
    name: "Rajesh Kumar",
    username: "rajesh.kumar",
    email: "rajesh.k@qualcomm.com",
    phone: "+91 96543 21098",
    company: "Qualcomm India",
    companyLogoText: "Q",
    companyLogoBg: "bg-rose-600",
    industry: "Semiconductors",
    designation: "Technical Hiring Lead",
    department: "Hardware Engineering Hiring",
    location: "Chennai, TN",
    status: "Password Reset Required",
    credentialStatus: "Sent",
    permissionTemplate: "Senior Recruiter",
    drivesManaged: 2,
    assessmentsCreated: 6,
    interviewsScheduled: 24,
    offersReleased: 8,
    lastLogin: "Yesterday",
    requestedDate: "2026-07-10",
    tempPasswordMasked: "QLC@1088#",
    passwordLastReset: "2026-07-10",
    accountCreatedBy: "Dr. Anand Sharma (Placement Head)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "REC-105",
    recruiterId: "REC-AMZ-2026-005",
    name: "Samantha Wright",
    username: "samantha.wright",
    email: "samantha.w@amazon.com",
    phone: "+91 95432 10987",
    company: "Amazon Web Services",
    companyLogoText: "AWS",
    companyLogoBg: "bg-amber-600",
    industry: "Cloud & E-Commerce",
    designation: "Talent Specialist",
    department: "AWS Cloud Engineering",
    location: "Bengaluru, KA",
    status: "Active",
    credentialStatus: "Activated",
    permissionTemplate: "HR Manager",
    drivesManaged: 3,
    assessmentsCreated: 9,
    interviewsScheduled: 40,
    offersReleased: 10,
    lastLogin: "2 days ago",
    requestedDate: "2026-06-25",
    tempPasswordMasked: "AWS@5521#",
    passwordLastReset: "2026-06-25",
    accountCreatedBy: "Dr. Anand Sharma (Placement Head)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

const PERMISSION_ITEMS = [
  { id: "dashboard", label: "Dashboard", category: "Core Access" },
  { id: "company_access", label: "Company Access", category: "Core Access" },
  { id: "assessment_builder", label: "Assessment Builder", category: "Assessments" },
  { id: "question_bank", label: "Question Bank", category: "Assessments" },
  { id: "mcq_builder", label: "MCQ Builder", category: "Assessments" },
  { id: "coding_builder", label: "Coding Builder", category: "Assessments" },
  { id: "sql_builder", label: "SQL Builder", category: "Assessments" },
  { id: "assessment_history", label: "Assessment History", category: "Assessments" },
  { id: "assessment_drafts", label: "Assessment Drafts", category: "Assessments" },
  { id: "assessment_submission", label: "Assessment Submission", category: "Assessments" },
  { id: "interview_feedback", label: "Interview Feedback", category: "Interviews" },
  { id: "offer_upload", label: "Offer Upload", category: "Offer Management" },
  { id: "reports", label: "Reports & Analytics", category: "Intelligence" },
  { id: "notifications", label: "Notifications & Reminders", category: "Communication" },
  { id: "profile_settings", label: "Profile Settings", category: "Account Settings" },
];

const TEMPLATE_PERMISSIONS = {
  Recruiter: ["dashboard", "company_access", "assessment_builder", "assessment_drafts", "assessment_submission", "interview_feedback"],
  "Senior Recruiter": ["dashboard", "company_access", "assessment_builder", "question_bank", "mcq_builder", "coding_builder", "sql_builder", "assessment_history", "assessment_drafts", "assessment_submission", "interview_feedback", "offer_upload"],
  "HR Manager": ["dashboard", "company_access", "assessment_builder", "question_bank", "mcq_builder", "coding_builder", "sql_builder", "assessment_history", "assessment_drafts", "assessment_submission", "interview_feedback", "offer_upload", "reports", "notifications"],
  "Super Recruiter": PERMISSION_ITEMS.map((p) => p.id),
};

const COMPANY_CARD_SUMMARIES = [
  { company: "Google Cloud", logoText: "G", logoBg: "bg-blue-600", recruitersCount: 8, activeDrives: 4 },
  { company: "Microsoft India", logoText: "MS", logoBg: "bg-indigo-600", recruitersCount: 5, activeDrives: 2 },
  { company: "Amazon Web Services", logoText: "AWS", logoBg: "bg-amber-600", recruitersCount: 3, activeDrives: 3 },
  { company: "Infosys Limited", logoText: "INF", logoBg: "bg-emerald-600", recruitersCount: 6, activeDrives: 2 },
  { company: "Qualcomm India", logoText: "Q", logoBg: "bg-rose-600", recruitersCount: 4, activeDrives: 2 },
  { company: "Tesla Motors", logoText: "T", logoBg: "bg-purple-600", recruitersCount: 2, activeDrives: 1 },
];

const RECRUITER_TIMELINE_STEPS = [
  { step: "Created Assessment", company: "Google Cloud", recruiter: "David Miller", time: "10 mins ago", icon: FileCheck2 },
  { step: "Uploaded Results", company: "Microsoft India", recruiter: "Ananya Sharma", time: "1 hour ago", icon: FileText },
  { step: "Scheduled Interviews", company: "Amazon Web Services", recruiter: "Samantha Wright", time: "Yesterday", icon: Video },
  { step: "Released Offer Letters", company: "Qualcomm India", recruiter: "Rajesh Kumar", time: "2 days ago", icon: Award },
];

export function RecruiterManagementWorkspace() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>(INITIAL_RECRUITERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");

  // Profile Drawer State
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("credentials");

  // Show/Hide Temporary Password in Drawer
  const [showDrawerPassword, setShowDrawerPassword] = useState(false);

  // 4-STEP RECRUITER ACCOUNT PROVISIONING WIZARD MODAL STATE
  const [isProvisionWizardOpen, setIsProvisionWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // STEP 1 FIELDS
  const [wName, setWName] = useState("");
  const [wDesignation, setWDesignation] = useState("Talent Acquisition Manager");
  const [wDepartment, setWDepartment] = useState("University Hiring");
  const [wEmail, setWEmail] = useState("");
  const [wPhone, setWPhone] = useState("");
  const [wCompany, setWCompany] = useState("Google Cloud");
  const [wLocation, setWLocation] = useState("Bengaluru, KA");
  const [wPhotoUrl, setWPhotoUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");

  // STEP 2 AUTO GENERATED CREDENTIALS
  const [wRecruiterId, setWRecruiterId] = useState("REC-GGL-2026-009");
  const [wUsername, setWUsername] = useState("");
  const [wTempPassword, setWTempPassword] = useState("GGL@9821#");
  const [showWizardPassword, setShowWizardPassword] = useState(false);

  // STEP 3 PERMISSIONS
  const [selectedPermissionTemplate, setSelectedPermissionTemplate] = useState<
    "Recruiter" | "Senior Recruiter" | "HR Manager" | "Super Recruiter"
  >("Senior Recruiter");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    TEMPLATE_PERMISSIONS["Senior Recruiter"]
  );

  // Helper: Auto generate credentials on Step 1 completion
  const handleGenerateStep2Credentials = () => {
    const cleanName = wName.toLowerCase().replace(/[^a-z0-9]/g, ".");
    const uname = cleanName ? (cleanName.includes(".") ? cleanName : `${cleanName}.hr`) : "david.miller";
    setWUsername(uname);

    const compCode = wCompany.substring(0, 3).toUpperCase() || "GGL";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setWRecruiterId(`REC-${compCode}-2026-${Math.floor(100 + Math.random() * 900)}`);
    setWTempPassword(`${compCode}@${randNum}#`);
  };

  const handleRegeneratePassword = () => {
    const compCode = wCompany.substring(0, 3).toUpperCase() || "REC";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newPass = `${compCode}@${randNum}#`;
    setWTempPassword(newPass);
    toast.success("Generated new strong temporary password");
  };

  const handleApplyPermissionTemplate = (tpl: "Recruiter" | "Senior Recruiter" | "HR Manager" | "Super Recruiter") => {
    setSelectedPermissionTemplate(tpl);
    setSelectedPermissions(TEMPLATE_PERMISSIONS[tpl]);
    toast.info(`Applied "${tpl}" permission preset`);
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // STEP 4 SUBMIT -> CREATE RECRUITER ACCOUNT
  const handleCreateRecruiterAccount = () => {
    const newRec: Recruiter = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      recruiterId: wRecruiterId,
      name: wName || "David Miller",
      username: wUsername || "david.miller",
      email: wEmail || "david.miller@google.com",
      phone: wPhone || "+91 98765 43210",
      company: wCompany,
      companyLogoText: wCompany.substring(0, 2).toUpperCase(),
      companyLogoBg: "bg-blue-600",
      industry: "IT & Cloud Software",
      designation: wDesignation,
      department: wDepartment,
      location: wLocation,
      status: "Pending Activation",
      credentialStatus: "First Login Pending",
      permissionTemplate: selectedPermissionTemplate,
      drivesManaged: 0,
      assessmentsCreated: 0,
      interviewsScheduled: 0,
      offersReleased: 0,
      lastLogin: "Never (Pending First Login)",
      requestedDate: new Date().toISOString().split("T")[0] || "2026-08-01",
      tempPasswordMasked: wTempPassword,
      passwordLastReset: "Just now",
      accountCreatedBy: "Dr. Anand Sharma (Placement Officer)",
      avatar: wPhotoUrl,
    };

    setRecruiters([newRec, ...recruiters]);
    if (typeof window !== "undefined") {
      localStorage.setItem("loggedInRecruiterName", newRec.name);
      localStorage.setItem("loggedInRecruiterEmail", newRec.email);
      localStorage.setItem("loggedInRecruiterCompany", newRec.company);
    }
    setWizardStep(5); // Move to Success Screen
    toast.success(`Provisioned new recruiter account for ${newRec.name} (${newRec.recruiterId})! Passkey: ${newRec.tempPasswordMasked}`);
  };

  // Drawer Credentials Actions
  const handleDrawerResetPassword = () => {
    if (!selectedRecruiter) return;
    const compCode = selectedRecruiter.company.substring(0, 3).toUpperCase() || "REC";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newPass = `${compCode}@${randNum}#`;

    setRecruiters((prev) =>
      prev.map((r) =>
        r.id === selectedRecruiter.id
          ? {
              ...r,
              tempPasswordMasked: newPass,
              passwordLastReset: "Just now",
              status: "Password Reset Required",
              credentialStatus: "Sent",
            }
          : r
      )
    );
    setSelectedRecruiter({
      ...selectedRecruiter,
      tempPasswordMasked: newPass,
      passwordLastReset: "Just now",
      status: "Password Reset Required",
      credentialStatus: "Sent",
    });
    toast.success(`Reset temporary password to: ${newPass}`);
  };

  const handleDrawerDeactivateAccount = () => {
    if (!selectedRecruiter) return;
    setRecruiters((prev) =>
      prev.map((r) =>
        r.id === selectedRecruiter.id ? { ...r, status: "Suspended" } : r
      )
    );
    setSelectedRecruiter({
      ...selectedRecruiter,
      status: "Suspended",
    });
    toast.error(`Suspended recruiter account for ${selectedRecruiter.name}`);
  };

  // Filtering Logic
  const filteredRecruiters = recruiters.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recruiterId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany = companyFilter === "All" || r.company === companyFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    if (activeTab === "pending") return matchesSearch && (r.status === "Pending Activation" || r.credentialStatus === "First Login Pending");
    if (activeTab === "active") return matchesSearch && r.status === "Active";
    if (activeTab === "suspended") return matchesSearch && (r.status === "Suspended" || r.status === "Inactive");

    return matchesSearch && matchesCompany && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-up">
      {/* 1. EXECUTIVE HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand-gradient text-white font-mono text-[0.7rem] px-3 py-1">
                ENTERPRISE RECRUITER PROVISIONING
              </Badge>
              <Badge variant="outline" className="font-mono text-[0.7rem] bg-background/80">
                142 Active Recruiter Accounts
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruiter Management & Credentials Center
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl font-mono text-xs">
              Provision recruiter credentials, configure role access permissions, issue temporary passkeys, and audit recruiter account logins.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => {
                setWName("");
                setWEmail("");
                setWPhone("");
                setWizardStep(1);
                setIsProvisionWizardOpen(true);
              }}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <UserPlus className="size-4" /> + Provision Recruiter Account
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Exported Recruiter Accounts Credentials Ledger CSV")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export Ledger
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI METRICS (5 CARDS) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Provisioned", val: `${recruiters.length + 137}`, desc: "HR Accounts", color: "text-blue-600 bg-blue-500/10" },
          { label: "Pending Activation", val: `${recruiters.filter((r) => r.status === "Pending Activation").length + 4}`, desc: "First Login Pending", color: "text-amber-600 bg-amber-500/10" },
          { label: "Active Recruiters", val: `${recruiters.filter((r) => r.status === "Active").length + 120}`, desc: "Managing Drives", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Password Reset Required", val: `${recruiters.filter((r) => r.status === "Password Reset Required").length + 2}`, desc: "Passkey Issued", color: "text-purple-600 bg-purple-500/10" },
          { label: "Suspended / Inactive", val: `${recruiters.filter((r) => r.status === "Suspended").length}`, desc: "Access Blocked", color: "text-rose-600 bg-rose-500/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs">
            <span className="text-[0.68rem] font-semibold text-muted-foreground block truncate">{kpi.label}</span>
            <p className="font-display text-2xl font-extrabold">{kpi.val}</p>
            <span className={`text-[0.62rem] font-mono px-2 py-0.5 rounded-md inline-block ${kpi.color}`}>
              {kpi.desc}
            </span>
          </div>
        ))}
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recruiter name, recruiter ID, username, or official email..."
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
              <option value="Google Cloud">Google Cloud</option>
              <option value="Microsoft India">Microsoft India</option>
              <option value="Amazon Web Services">Amazon Web Services</option>
              <option value="Qualcomm India">Qualcomm India</option>
              <option value="Tesla Motors">Tesla Motors</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Account Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Activation">Pending Activation</option>
              <option value="Password Reset Required">Password Reset Required</option>
              <option value="Suspended">Suspended</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCompanyFilter("All");
                setStatusFilter("All");
                toast.info("Reset recruiter search filters");
              }}
              className="h-10 text-xs rounded-xl cursor-pointer"
            >
              <RefreshCw className="size-3.5 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* 4. RECRUITER DIRECTORY TABLE WITH NEW CREDENTIAL COLUMNS */}
      <Panel
        title="Institutional Recruiter Account Directory"
        description="Comprehensive directory with auto-generated recruiter credentials and status badges."
        action={
          <Badge variant="outline" className="font-mono text-xs">
            Showing {filteredRecruiters.length} Recruiter Accounts
          </Badge>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/40 p-1 rounded-xl mb-4">
            <TabsTrigger value="all" className="rounded-lg text-xs font-bold cursor-pointer">
              All Recruiters ({recruiters.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-xs font-bold cursor-pointer">
              Pending First Login ({recruiters.filter((r) => r.status === "Pending Activation").length})
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg text-xs font-bold cursor-pointer">
              Active ({recruiters.filter((r) => r.status === "Active").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                    <th className="p-3">Recruiter Name & ID</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Official Email</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Credential Status</th>
                    <th className="p-3">Last Login</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-medium">
                  {filteredRecruiters.map((rec) => (
                    <tr key={rec.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border border-border">
                            <AvatarImage src={rec.avatar} />
                            <AvatarFallback>{rec.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground text-xs">{rec.name}</p>
                            <span className="text-[0.65rem] font-mono text-primary font-bold">{rec.recruiterId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-foreground">{rec.company}</td>
                      <td className="p-3 font-mono text-[0.68rem] text-muted-foreground">{rec.email}</td>
                      <td className="p-3 font-mono text-purple-600 font-bold">{rec.username}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            rec.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-[0.62rem]"
                              : rec.status === "Pending Activation"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 font-mono text-[0.62rem]"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20 font-mono text-[0.62rem]"
                          }
                        >
                          ● {rec.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            rec.credentialStatus === "Activated"
                              ? "text-emerald-600 border-emerald-500/30 font-mono text-[0.62rem]"
                              : "text-purple-600 border-purple-500/30 font-mono text-[0.62rem]"
                          }
                        >
                          {rec.credentialStatus}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-[0.68rem] text-muted-foreground">{rec.lastLogin}</td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRecruiter(rec);
                            setDrawerTab("credentials");
                            setIsDrawerOpen(true);
                          }}
                          className="h-8 text-xs rounded-xl cursor-pointer text-primary hover:bg-primary/10"
                        >
                          <Eye className="size-3.5 mr-1" /> View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Panel>

      {/* ========================================================================= */}
      {/* 4-STEP RECRUITER ACCOUNT PROVISIONING WIZARD MODAL                        */}
      {/* ========================================================================= */}
      <Dialog open={isProvisionWizardOpen} onOpenChange={setIsProvisionWizardOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6 backdrop-blur-2xl">
          <DialogHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-brand-gradient text-white grid place-items-center font-bold text-sm shadow-glow">
                  0{wizardStep < 5 ? wizardStep : 4}
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold">
                    Recruiter Account Provisioning Wizard
                  </DialogTitle>
                  <DialogDescription className="text-xs font-mono">
                    {wizardStep === 1 && "Step 1: Recruiter Contact & Profile Information"}
                    {wizardStep === 2 && "Step 2: Auto-Generated Account Credentials"}
                    {wizardStep === 3 && "Step 3: Role Access Permissions & Templates"}
                    {wizardStep === 4 && "Step 4: Final Review & Provision Account"}
                    {wizardStep === 5 && "Account Created & Provisioned Successfully"}
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* STEP PROGRESS BAR */}
            {wizardStep < 5 && (
              <div className="flex items-center gap-2 pt-3">
                {["Information", "Credentials", "Permissions", "Review & Create"].map((stLabel, idx) => {
                  const stNum = idx + 1;
                  return (
                    <div
                      key={stLabel}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        wizardStep >= stNum ? "bg-brand-gradient" : "bg-secondary"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </DialogHeader>

          {/* STEP 1 – RECRUITER INFORMATION */}
          {wizardStep === 1 && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Recruiter Full Name *</label>
                  <Input
                    value={wName}
                    onChange={(e) => setWName(e.target.value)}
                    placeholder="e.g. David Miller"
                    required
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Official Company Email *</label>
                  <Input
                    type="email"
                    value={wEmail}
                    onChange={(e) => setWEmail(e.target.value)}
                    placeholder="david.miller@google.com"
                    required
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Corporate Company *</label>
                  <select
                    value={wCompany}
                    onChange={(e) => setWCompany(e.target.value)}
                    className="w-full h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold cursor-pointer"
                  >
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Microsoft India">Microsoft India</option>
                    <option value="Amazon Web Services">Amazon Web Services</option>
                    <option value="Qualcomm India">Qualcomm India</option>
                    <option value="Tesla Motors">Tesla Motors</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Designation *</label>
                  <Input
                    value={wDesignation}
                    onChange={(e) => setWDesignation(e.target.value)}
                    placeholder="Staff University Recruiter"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">HR Department</label>
                  <Input
                    value={wDepartment}
                    onChange={(e) => setWDepartment(e.target.value)}
                    placeholder="Campus Hiring & University Relations"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Mobile Phone Number</label>
                  <Input
                    value={wPhone}
                    onChange={(e) => setWPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Office Location</label>
                <Input
                  value={wLocation}
                  onChange={(e) => setWLocation(e.target.value)}
                  placeholder="Bengaluru, KA"
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsProvisionWizardOpen(false)} className="rounded-xl">Cancel</Button>
                <Button
                  disabled={!wName || !wEmail}
                  onClick={() => {
                    handleGenerateStep2Credentials();
                    setWizardStep(2);
                  }}
                  className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer"
                >
                  Next: Generate Credentials →
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 2 – ACCOUNT CREDENTIALS */}
          {wizardStep === 2 && (
            <div className="space-y-4 pt-2 text-xs font-mono">
              <div className="p-4 rounded-2xl border border-primary/40 bg-primary/5 space-y-3">
                <span className="text-[0.68rem] text-primary font-bold uppercase tracking-wider block">Auto-Generated Account Passkey Preview</span>

                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-sans">Recruiter ID:</span>
                    <p className="font-bold text-foreground">{wRecruiterId}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-sans">Generated Username:</span>
                    <p className="font-bold text-purple-600">{wUsername}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-sans">Temporary Passkey:</span>
                    <p className="font-bold text-emerald-600">{showWizardPassword ? wTempPassword : "••••••••••"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setShowWizardPassword(!showWizardPassword)} className="h-8 text-xs rounded-xl cursor-pointer">
                    {showWizardPassword ? <EyeOff className="size-3.5 mr-1" /> : <Eye className="size-3.5 mr-1" />}
                    {showWizardPassword ? "Hide Passkey" : "Show Passkey"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleRegeneratePassword} className="h-8 text-xs rounded-xl cursor-pointer">
                    <RefreshCw className="size-3.5 mr-1" /> Generate New Password
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`Username: ${wUsername} | Temp Password: ${wTempPassword}`);
                      toast.success("Copied generated credentials to clipboard!");
                    }}
                    className="h-8 text-xs rounded-xl cursor-pointer"
                  >
                    <Copy className="size-3.5 mr-1" /> Copy Credentials
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-bold">Password Strength Indicator</span>
                  <span className="text-emerald-600 font-bold">Strong (100%)</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setWizardStep(1)} className="rounded-xl">← Back</Button>
                <Button
                  onClick={() => setWizardStep(3)}
                  className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer"
                >
                  Next: Permissions →
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 3 – PERMISSIONS & TEMPLATES */}
          {wizardStep === 3 && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="space-y-2">
                <span className="font-bold font-sans text-muted-foreground uppercase text-[0.65rem] tracking-wider block">
                  Quick Permission Preset Templates
                </span>
                <div className="grid gap-2 sm:grid-cols-4 font-mono">
                  {(["Recruiter", "Senior Recruiter", "HR Manager", "Super Recruiter"] as const).map((tpl) => (
                    <Button
                      key={tpl}
                      type="button"
                      variant={selectedPermissionTemplate === tpl ? "default" : "outline"}
                      onClick={() => handleApplyPermissionTemplate(tpl)}
                      className={`h-9 text-[0.68rem] rounded-xl cursor-pointer ${selectedPermissionTemplate === tpl ? "bg-primary text-primary-foreground font-bold shadow-glow" : ""}`}
                    >
                      {tpl}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <span className="font-bold font-sans text-muted-foreground uppercase text-[0.65rem] tracking-wider block">
                  Fine-Grained Portal Feature Access
                </span>
                <div className="grid gap-2 sm:grid-cols-3 font-mono">
                  {PERMISSION_ITEMS.map((item) => {
                    const isChecked = selectedPermissions.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => togglePermission(item.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isChecked
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border/70 bg-card text-muted-foreground"
                        }`}
                      >
                        <span className="text-[0.68rem]">{item.label}</span>
                        <input type="checkbox" checked={isChecked} readOnly className="size-3.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setWizardStep(2)} className="rounded-xl">← Back</Button>
                <Button
                  onClick={() => setWizardStep(4)}
                  className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer"
                >
                  Next: Review & Create →
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 4 – REVIEW & CREATE ACCOUNT */}
          {wizardStep === 4 && (
            <div className="space-y-4 pt-2 text-xs font-mono">
              <div className="p-4 rounded-2xl border border-primary/40 bg-card space-y-3 backdrop-blur-xl">
                <span className="text-[0.68rem] font-bold text-primary font-sans uppercase tracking-wider block">Account Summary Verification</span>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>Recruiter Name: <strong className="text-foreground font-sans">{wName}</strong></div>
                  <div>Company: <strong className="text-foreground">{wCompany}</strong></div>
                  <div>Work Email: <strong className="text-muted-foreground">{wEmail}</strong></div>
                  <div>Assigned Username: <strong className="text-purple-600">{wUsername}</strong></div>
                  <div>Generated ID: <strong className="text-primary">{wRecruiterId}</strong></div>
                  <div>Permission Preset: <strong className="text-emerald-600">{selectedPermissionTemplate}</strong></div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setWizardStep(3)} className="rounded-xl">← Back</Button>
                <Button
                  onClick={handleCreateRecruiterAccount}
                  className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer h-10 px-5"
                >
                  Create Recruiter Account ✓
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* SUCCESS SCREEN (POST CREATION) */}
          {wizardStep === 5 && (
            <div className="space-y-4 pt-2 text-center text-xs font-mono">
              <div className="size-16 rounded-full bg-emerald-600 text-white grid place-items-center mx-auto shadow-glow font-extrabold text-2xl animate-bounce">
                ✓
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-extrabold text-foreground">
                  Recruiter Account Created Successfully!
                </h3>
                <p className="text-xs text-muted-foreground">
                  The recruiter profile and passkeys have been registered in the institutional ledger.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-left space-y-2 font-mono">
                <p>• Recruiter ID: <strong className="text-foreground">{wRecruiterId}</strong></p>
                <p>• Username: <strong className="text-purple-600">{wUsername}</strong></p>
                <p>• Temporary Passkey: <strong className="text-emerald-600">{wTempPassword}</strong></p>
                <p>• Official Email: <strong className="text-foreground">{wEmail}</strong></p>
                <p>• Company: <strong className="text-foreground">{wCompany}</strong></p>
                <p>• Account Status: <Badge className="bg-amber-600 text-white text-[0.6rem]">Pending First Login</Badge></p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 pt-2 font-sans">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`Recruiter ID: ${wRecruiterId}\nUsername: ${wUsername}\nPassword: ${wTempPassword}`);
                    toast.success("Copied credentials to clipboard");
                  }}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                >
                  <Copy className="size-3.5 mr-1" /> Copy Credentials
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Sent credentials email to recruiter")}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                >
                  <Send className="size-3.5 mr-1" /> Send Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Exported credentials slip PDF")}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                >
                  <FileDown className="size-3.5 mr-1" /> Download PDF
                </Button>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  onClick={() => setIsProvisionWizardOpen(false)}
                  className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer w-full"
                >
                  Close & View Directory
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* RECRUITER PROFILE DRAWER WITH NEW "ACCOUNT CREDENTIALS" TAB               */}
      {/* ========================================================================= */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto space-y-4">
          {selectedRecruiter && (
            <>
              <SheetHeader className="pb-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border border-border">
                    <AvatarImage src={selectedRecruiter.avatar} />
                    <AvatarFallback>{selectedRecruiter.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-base font-extrabold">{selectedRecruiter.name}</SheetTitle>
                    <SheetDescription className="text-xs font-semibold text-primary">
                      {selectedRecruiter.company} • {selectedRecruiter.designation}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* DRAWER TABS INCLUDING ACCOUNT CREDENTIALS */}
              <Tabs value={drawerTab} onValueChange={setDrawerTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl w-full grid grid-cols-4 text-[0.62rem] font-bold mb-4">
                  <TabsTrigger value="credentials" className="rounded-lg">Credentials</TabsTrigger>
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="company" className="rounded-lg">Company</TabsTrigger>
                  <TabsTrigger value="drives" className="rounded-lg">Drives</TabsTrigger>
                </TabsList>

                {/* ACCOUNT CREDENTIALS TAB */}
                <TabsContent value="credentials" className="space-y-4 text-xs font-mono mt-0">
                  <div className="p-4 bg-muted/30 rounded-2xl space-y-2.5 border border-border/50">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Recruiter ID:</span>
                      <strong className="text-primary">{selectedRecruiter.recruiterId}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Assigned Username:</span>
                      <strong className="text-purple-600">{selectedRecruiter.username}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Official Email:</span>
                      <strong className="text-foreground">{selectedRecruiter.email}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2 items-center">
                      <span className="text-muted-foreground font-sans">Temporary Password:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-emerald-600">
                          {showDrawerPassword ? selectedRecruiter.tempPasswordMasked : "••••••••••"}
                        </strong>
                        <button
                          type="button"
                          onClick={() => setShowDrawerPassword(!showDrawerPassword)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showDrawerPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Password Last Reset:</span>
                      <span>{selectedRecruiter.passwordLastReset}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Last Login Timestamp:</span>
                      <span>{selectedRecruiter.lastLogin}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground font-sans">Account Created By:</span>
                      <span>{selectedRecruiter.accountCreatedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Permission Template:</span>
                      <strong className="text-purple-600">{selectedRecruiter.permissionTemplate}</strong>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 pt-1 font-sans">
                    <Button size="sm" variant="outline" onClick={handleDrawerResetPassword} className="h-8 text-xs rounded-xl cursor-pointer">
                      <KeyRound className="size-3.5 mr-1" /> Reset Password
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedRecruiter.username);
                        toast.success("Copied username!");
                      }}
                      className="h-8 text-xs rounded-xl cursor-pointer"
                    >
                      <Copy className="size-3.5 mr-1" /> Copy Username
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedRecruiter.email);
                        toast.success("Copied email!");
                      }}
                      className="h-8 text-xs rounded-xl cursor-pointer"
                    >
                      <Mail className="size-3.5 mr-1" /> Copy Email
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleDrawerDeactivateAccount} className="h-8 text-xs text-rose-600 hover:bg-rose-500/10 rounded-xl cursor-pointer">
                      Deactivate Account
                    </Button>
                  </div>
                </TabsContent>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-3 text-xs mt-0">
                  <div className="p-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p><span className="font-semibold text-muted-foreground">Department:</span> {selectedRecruiter.department}</p>
                    <p><span className="font-semibold text-muted-foreground">Contact Phone:</span> {selectedRecruiter.phone}</p>
                    <p><span className="font-semibold text-muted-foreground">Office Location:</span> {selectedRecruiter.location}</p>
                    <p><span className="font-semibold text-muted-foreground">Account Status:</span> {selectedRecruiter.status}</p>
                  </div>
                </TabsContent>

                {/* COMPANY TAB */}
                <TabsContent value="company" className="space-y-3 text-xs mt-0">
                  <div className="p-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p><span className="font-semibold text-muted-foreground">Corporate Partner:</span> {selectedRecruiter.company}</p>
                    <p><span className="font-semibold text-muted-foreground">Industry Vertical:</span> {selectedRecruiter.industry}</p>
                    <p><span className="font-semibold text-muted-foreground">HR Designation:</span> {selectedRecruiter.designation}</p>
                  </div>
                </TabsContent>

                {/* DRIVES TAB */}
                <TabsContent value="drives" className="space-y-3 text-xs mt-0 font-mono">
                  <div className="p-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p>Active Drives Managed: {selectedRecruiter.drivesManaged}</p>
                    <p className="text-purple-600 font-bold">Tests Created: {selectedRecruiter.assessmentsCreated}</p>
                    <p className="text-blue-600 font-bold">Interviews Booked: {selectedRecruiter.interviewsScheduled}</p>
                    <p className="text-emerald-600 font-bold">Offers Released: {selectedRecruiter.offersReleased}</p>
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
