import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
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
  TrendingDown,
  FileCode,
  DollarSign,
  History,
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

// ============================================================================
// MOCK DATA FOR COMPANY MANAGEMENT WORKSPACE
// ============================================================================

export interface Company {
  id: string;
  name: string;
  logoText: string;
  logoBg: string;
  industry: string;
  location: string;
  website: string;
  tier: "Tier 1 Super Dream" | "Tier 2 Dream" | "Core Specialty" | "Mass Recruiter";
  status: "Verified" | "Pending Verification" | "Hiring Active" | "Archived";
  recruitersCount: number;
  activeDrives: number;
  studentsHired: number;
  highestPackage: string;
  avgPackage: string;
  registrationDate: string;
  contactPerson: string;
  contactEmail: string;
  repeatPartnerYears: number;
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: "COMP-101",
    name: "Google Cloud India",
    logoText: "G",
    logoBg: "bg-blue-600",
    industry: "IT & Cloud Services",
    location: "Bengaluru, KA / Hyderabad, TS",
    website: "https://cloud.google.com",
    tier: "Tier 1 Super Dream",
    status: "Hiring Active",
    recruitersCount: 8,
    activeDrives: 4,
    studentsHired: 42,
    highestPackage: "₹44.5 LPA",
    avgPackage: "₹24.8 LPA",
    registrationDate: "2022-04-10",
    contactPerson: "David Miller (Staff Recruiter)",
    contactEmail: "david.miller@google.com",
    repeatPartnerYears: 4,
  },
  {
    id: "COMP-102",
    name: "Microsoft Corporation",
    logoText: "MS",
    logoBg: "bg-indigo-600",
    industry: "Enterprise Software & AI",
    location: "Hyderabad, TS / Bengaluru",
    website: "https://microsoft.com",
    tier: "Tier 1 Super Dream",
    status: "Hiring Active",
    recruitersCount: 5,
    activeDrives: 2,
    studentsHired: 36,
    highestPackage: "₹38.0 LPA",
    avgPackage: "₹22.5 LPA",
    registrationDate: "2021-08-15",
    contactPerson: "Ananya Sharma (University Lead)",
    contactEmail: "ananya.sharma@microsoft.com",
    repeatPartnerYears: 5,
  },
  {
    id: "COMP-103",
    name: "Tesla Motors Autonomous",
    logoText: "T",
    logoBg: "bg-purple-600",
    industry: "Automotive & Electric Systems",
    location: "Bengaluru R&D Center",
    website: "https://tesla.com",
    tier: "Core Specialty",
    status: "Pending Verification",
    recruitersCount: 2,
    activeDrives: 1,
    studentsHired: 8,
    highestPackage: "₹28.0 LPA",
    avgPackage: "₹18.5 LPA",
    registrationDate: "2026-07-28",
    contactPerson: "Marcus Vance (Talent Acquisition)",
    contactEmail: "marcus.vance@tesla.com",
    repeatPartnerYears: 1,
  },
  {
    id: "COMP-104",
    name: "Qualcomm Semiconductors",
    logoText: "Q",
    logoBg: "bg-rose-600",
    industry: "Semiconductors & Wireless",
    location: "Chennai, TN / Hyderabad",
    website: "https://qualcomm.com",
    tier: "Tier 1 Super Dream",
    status: "Verified",
    recruitersCount: 4,
    activeDrives: 2,
    studentsHired: 28,
    highestPackage: "₹26.5 LPA",
    avgPackage: "₹19.2 LPA",
    registrationDate: "2023-02-14",
    contactPerson: "Rajesh Kumar (Tech Hiring Lead)",
    contactEmail: "rajesh.k@qualcomm.com",
    repeatPartnerYears: 3,
  },
  {
    id: "COMP-105",
    name: "Amazon Web Services (AWS)",
    logoText: "AWS",
    logoBg: "bg-amber-600",
    industry: "Cloud Infrastructure",
    location: "Bengaluru, KA",
    website: "https://aws.amazon.com",
    tier: "Tier 1 Super Dream",
    status: "Hiring Active",
    recruitersCount: 6,
    activeDrives: 3,
    studentsHired: 54,
    highestPackage: "₹34.0 LPA",
    avgPackage: "₹20.4 LPA",
    registrationDate: "2020-09-01",
    contactPerson: "Samantha Wright (Talent Specialist)",
    contactEmail: "samantha.w@amazon.com",
    repeatPartnerYears: 6,
  },
  {
    id: "COMP-106",
    name: "Infosys Global Services",
    logoText: "INF",
    logoBg: "bg-emerald-600",
    industry: "IT Services & Consulting",
    location: "Mysuru / Bengaluru",
    website: "https://infosys.com",
    tier: "Mass Recruiter",
    status: "Verified",
    recruitersCount: 6,
    activeDrives: 2,
    studentsHired: 120,
    highestPackage: "₹11.5 LPA",
    avgPackage: "₹7.2 LPA",
    registrationDate: "2019-05-20",
    contactPerson: "Priya Nair (Global Campus Lead)",
    contactEmail: "priya.nair@infosys.com",
    repeatPartnerYears: 7,
  },
  {
    id: "COMP-107",
    name: "Goldman Sachs Technology",
    logoText: "GS",
    logoBg: "bg-cyan-600",
    industry: "Banking & Financial Services",
    location: "Bengaluru, KA",
    website: "https://goldmansachs.com",
    tier: "Tier 1 Super Dream",
    status: "Pending Verification",
    recruitersCount: 3,
    activeDrives: 1,
    studentsHired: 14,
    highestPackage: "₹36.0 LPA",
    avgPackage: "₹22.0 LPA",
    registrationDate: "2026-08-01",
    contactPerson: "Alexander Reed (VP Recruitment)",
    contactEmail: "alex.reed@gs.com",
    repeatPartnerYears: 2,
  },
];

const ACTIVE_DRIVES_HIGHLIGHTS = [
  { company: "Google Cloud", role: "Software Engineer I", CTC: "₹32.0 LPA", applications: 520, progress: 67, stage: "Technical Round 1", logoBg: "bg-blue-600", logoText: "G" },
  { company: "Microsoft India", role: "Software Development Engineer", CTC: "₹28.5 LPA", applications: 610, progress: 85, stage: "Interviews Active", logoBg: "bg-indigo-600", logoText: "MS" },
  { company: "Qualcomm India", role: "Hardware Systems Engineer", CTC: "₹22.0 LPA", applications: 430, progress: 40, stage: "Registrations Open", logoBg: "bg-rose-600", logoText: "Q" },
  { company: "Amazon Web Services", role: "Cloud Operations Specialist", CTC: "₹26.0 LPA", applications: 480, progress: 55, stage: "Shortlisting", logoBg: "bg-amber-600", logoText: "AWS" },
];

const RECENT_COMPANY_ACTIVITIES = [
  { id: 1, text: "Google Cloud registered a new Software Engineer hiring drive", time: "10 mins ago", icon: Building2 },
  { id: 2, text: "Microsoft HR Ananya Sharma uploaded 12 verified offer letters", time: "1 hour ago", icon: Award },
  { id: 3, text: "Tesla Motors submitted company registration & MoU documents for TPO review", time: "3 hours ago", icon: FileCheck2 },
  { id: 4, text: "Amazon Web Services published Cloud Aptitude assessment cutoff scores", time: "5 hours ago", icon: CheckCircle },
];

const INDUSTRY_DISTRIBUTION = [
  { name: "IT & Cloud", value: 38, color: "#3b82f6" },
  { name: "Semiconductors", value: 22, color: "#8b5cf6" },
  { name: "Automotive", value: 16, color: "#ec4899" },
  { name: "Banking & BFSI", value: 14, color: "#10b981" },
  { name: "Consulting", value: 10, color: "#f59e0b" },
];

export function CompanyManagementWorkspace() {
  // Local React State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  // Drawer State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("overview");

  // Modal States
  const [activeModal, setActiveModal] = useState<"none" | "register" | "import" | "edit" | "delete_confirm">("none");

  // Form States for Modals
  const [formName, setFormName] = useState("");
  const [formIndustry, setFormIndustry] = useState("IT & Cloud Services");
  const [formLocation, setFormLocation] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formTier, setFormTier] = useState<Company["tier"]>("Tier 1 Super Dream");
  const [formPerson, setFormPerson] = useState("");
  const [formEmail, setFormEmail] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Handlers for Pending Company Approvals
  const handleApproveCompany = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Verified" } : c))
    );
    toast.success(`Verified corporate partner ${id}`);
  };

  const handleRejectCompany = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Archived" } : c))
    );
    toast.error(`Archived corporate partner ${id}`);
  };

  // Register Company Form Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      toast.error("Please enter Company Legal Name");
      return;
    }

    const newComp: Company = {
      id: `COMP-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      logoText: formName.substring(0, 2).toUpperCase(),
      logoBg: "bg-purple-600",
      industry: formIndustry,
      location: formLocation || "Bengaluru, KA",
      website: formWebsite || "https://company.com",
      tier: formTier,
      status: "Hiring Active",
      recruitersCount: 2,
      activeDrives: 1,
      studentsHired: 0,
      highestPackage: "₹18.0 LPA",
      avgPackage: "₹12.0 LPA",
      registrationDate: new Date().toISOString().split("T")[0] || "2026-08-01",
      contactPerson: formPerson || "Corporate HR Manager",
      contactEmail: formEmail || "hr@company.com",
      repeatPartnerYears: 1,
    };

    setCompanies([newComp, ...companies]);
    setActiveModal("none");
    setFormName("");
    setFormLocation("");
    setFormWebsite("");
    setFormPerson("");
    setFormEmail("");
    toast.success(`Registered corporate partner "${formName}"!`);
  };

  // Filter Logic
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === "All" || c.industry.includes(industryFilter);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesTier = tierFilter === "All" || c.tier === tierFilter;

    if (activeTab === "pending") return matchesSearch && c.status === "Pending Verification";
    if (activeTab === "hiring") return matchesSearch && c.status === "Hiring Active";
    if (activeTab === "verified") return matchesSearch && c.status === "Verified";

    return matchesSearch && matchesIndustry && matchesStatus && matchesTier;
  });

  const pendingVerificationList = companies.filter((c) => c.status === "Pending Verification");

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                CORPORATE PARTNERSHIPS
              </Badge>
              <Badge variant="outline" className="font-mono text-[0.7rem] bg-background/80">
                84 Enterprise Companies
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Company Management Workspace
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage corporate partners, hiring organizations, campus drive history, and recruiter relationships.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setActiveModal("register")}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Building2 className="size-4" /> + Register Company
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveModal("import")}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Upload className="size-3.5" /> Import Companies
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const headers = ["ID", "Company", "Industry", "Location", "Tier", "Status", "Highest Package"];
                const rows = companies.map((c) => [c.id, c.name, c.industry, c.location, c.tier, c.status, c.highestPackage]);
                const csvContent = [headers.join(","), ...rows.map((e) => e.map((x) => `"${x}"`).join(","))].join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `companies_export_${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
                toast.success("Downloaded Corporate Partners CSV");
              }}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. KPI DASHBOARD (10 CARDS)                                          */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Corporate Partnership KPIs
          </h3>
          <Badge variant="outline" className="text-[0.65rem] font-mono">Live Institutional Metrics</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total Companies", val: `${companies.length + 77}`, trend: "+14 this year", desc: "Corporate directory", progress: 92 },
            { label: "Verified Companies", val: "76", trend: "MoU Verified", desc: "Active hiring partners", progress: 88 },
            { label: "Pending Verification", val: `${pendingVerificationList.length}`, trend: "Needs Review", desc: "Registration queue", progress: 25 },
            { label: "Active Recruiters", val: "142", trend: "+8 new", desc: "HR Contacts registered", progress: 85 },
            { label: "Active Drives", val: "12", trend: "Ongoing campus drives", desc: "Recruitment rounds", progress: 65 },
            { label: "Companies Hiring", val: "18", trend: "Active season", desc: "Conducting tests & interviews", progress: 75 },
            { label: "Offers Released", val: "620", trend: "+45 this month", desc: "Verified job offers", progress: 90 },
            { label: "Average Package", val: "₹12.4 LPA", trend: "+14.2% YoY", desc: "Institutional avg CTC", progress: 80 },
            { label: "Highest Package", val: "₹44.5 LPA", trend: "Google Cloud", desc: "Record CTC offered", progress: 98 },
            { label: "Repeat Recruiters", val: "84%", trend: "4+ years avg", desc: "Continuous hiring partners", progress: 84 },
          ].map((kpi) => (
            <div
              key={kpi.label}
              onClick={() => toast.info(`Viewing ${kpi.label} details`)}
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
      {/* 3. COMPANY VERIFICATION QUEUE (TOP PRIORITY)                        */}
      {/* ==================================================================== */}
      <Panel
        title="Company Verification Queue"
        description="Review new corporate partner registration requests and MoU documents awaiting TPO authorization."
        action={
          <Badge variant="outline" className="font-mono text-xs text-amber-600 bg-amber-500/10 border-amber-500/30">
            {pendingVerificationList.length} Pending Approvals
          </Badge>
        }
      >
        {pendingVerificationList.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
            <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-1" />
            <p className="font-bold text-foreground">All Corporate Verification Up to Date!</p>
            <p>No pending company registration requests in queue.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {pendingVerificationList.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className={`size-11 rounded-xl ${comp.logoBg} text-white grid place-items-center font-extrabold text-sm shadow-xs`}>
                    {comp.logoText}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm font-bold truncate">{comp.name}</h4>
                    <p className="text-xs text-muted-foreground font-semibold truncate">{comp.industry}</p>
                    <span className="text-[0.65rem] font-mono text-muted-foreground block">{comp.location}</span>
                  </div>
                </div>

                <div className="p-2 bg-background/80 rounded-xl text-[0.7rem] space-y-1 font-mono border border-border/50">
                  <p><span className="text-muted-foreground">Contact HR:</span> {comp.contactPerson}</p>
                  <p><span className="text-muted-foreground">Email:</span> {comp.contactEmail}</p>
                  <p><span className="text-muted-foreground">Registered:</span> {comp.registrationDate}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => handleApproveCompany(comp.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl cursor-pointer"
                  >
                    <Check className="size-3.5 mr-1" /> Verify Partner
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectCompany(comp.id)}
                    className="flex-1 border-rose-500/40 text-rose-600 hover:bg-rose-500/10 h-8 text-xs rounded-xl cursor-pointer"
                  >
                    <X className="size-3.5 mr-1" /> Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedCompany(comp);
                      setIsDrawerOpen(true);
                    }}
                    className="h-8 text-xs rounded-xl cursor-pointer"
                  >
                    <Eye className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* ==================================================================== */}
      {/* 8. ACTIVE COMPANY DRIVES SECTION                                     */}
      {/* ==================================================================== */}
      <Panel
        title="Active Corporate Campus Recruitment Drives"
        description="Live ongoing recruitment drives conducted by registered corporate partners."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {ACTIVE_DRIVES_HIGHLIGHTS.map((d) => (
            <div key={d.company} className="p-4 rounded-2xl border border-border/70 bg-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`size-9 rounded-xl ${d.logoBg} text-white grid place-items-center font-extrabold text-xs shadow-xs`}>
                    {d.logoText}
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold">{d.company}</h4>
                    <p className="text-[0.68rem] text-muted-foreground">{d.role}</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[0.65rem] font-bold text-primary">
                  {d.CTC}
                </Badge>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[0.7rem]">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-bold">{d.applications} Candidates</span>
                </div>
                <div className="flex justify-between text-[0.7rem]">
                  <span className="text-muted-foreground">Current Stage</span>
                  <span className="font-mono text-primary font-semibold">{d.stage}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${d.progress}%` }} />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info(`Viewing drive details for ${d.company}`)}
                className="w-full text-xs h-8 rounded-xl cursor-pointer"
              >
                View Drive Progress
              </Button>
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
              placeholder="Search companies by name, industry, or location..."
              className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Industries</option>
              <option value="IT & Cloud Services">IT & Cloud Services</option>
              <option value="Enterprise Software">Enterprise Software</option>
              <option value="Semiconductors">Semiconductors</option>
              <option value="Automotive">Automotive</option>
              <option value="Banking & Financial Services">Banking & Financial Services</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Hiring Active">Hiring Active</option>
              <option value="Verified">Verified</option>
              <option value="Pending Verification">Pending Verification</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="size-8 rounded-lg cursor-pointer"
                title="Grid View"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="size-8 rounded-lg cursor-pointer"
                title="List View"
              >
                <ListIcon className="size-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setIndustryFilter("All");
                setStatusFilter("All");
                setTierFilter("All");
                toast.info("Reset all company filters");
              }}
              className="h-10 text-xs rounded-xl cursor-pointer"
            >
              <RefreshCw className="size-3.5 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. COMPANY DIRECTORY (GRID & LIST VIEWS)                             */}
      {/* ==================================================================== */}
      <Panel
        title="Corporate Partners Directory"
        description="Comprehensive directory of verified enterprise recruiters and hiring organizations."
        action={
          <Badge variant="outline" className="font-mono text-xs">
            Showing {paginatedCompanies.length} of {filteredCompanies.length} Companies
          </Badge>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/40 p-1 rounded-xl mb-4">
            <TabsTrigger value="all" className="rounded-lg text-xs font-bold cursor-pointer">
              All Companies ({companies.length})
            </TabsTrigger>
            <TabsTrigger value="hiring" className="rounded-lg text-xs font-bold cursor-pointer">
              Hiring Active ({companies.filter((c) => c.status === "Hiring Active").length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-xs font-bold cursor-pointer">
              Pending Verification ({pendingVerificationList.length})
            </TabsTrigger>
            <TabsTrigger value="verified" className="rounded-lg text-xs font-bold cursor-pointer">
              Verified Partners ({companies.filter((c) => c.status === "Verified").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 space-y-4">
            {filteredCompanies.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <Building2 className="size-10 mx-auto text-muted-foreground/50" />
                <p className="font-bold text-foreground">No Corporate Partners Found</p>
                <p>Try resetting filters or adjusting search queries.</p>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedCompanies.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl border border-border/70 bg-card space-y-3 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`size-11 rounded-2xl ${c.logoBg} text-white grid place-items-center font-extrabold text-base shadow-xs`}>
                            {c.logoText}
                          </div>
                          <div>
                            <h4 className="font-display text-sm font-bold">{c.name}</h4>
                            <p className="text-xs text-muted-foreground">{c.industry}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            c.status === "Hiring Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : c.status === "Verified"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                        >
                          {c.status}
                        </Badge>
                      </div>

                      <div className="p-2.5 bg-muted/30 rounded-xl grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-[0.65rem] text-muted-foreground block font-sans">Recruiters</span>
                          <span className="font-bold">{c.recruitersCount} Active</span>
                        </div>
                        <div>
                          <span className="text-[0.65rem] text-muted-foreground block font-sans">Students Hired</span>
                          <span className="font-bold text-emerald-600">{c.studentsHired} Placed</span>
                        </div>
                        <div>
                          <span className="text-[0.65rem] text-muted-foreground block font-sans">Highest Package</span>
                          <span className="font-bold text-primary">{c.highestPackage}</span>
                        </div>
                        <div>
                          <span className="text-[0.65rem] text-muted-foreground block font-sans">Avg Package</span>
                          <span className="font-bold">{c.avgPackage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <Badge variant="outline" className="text-[0.62rem] font-mono">
                        {c.tier}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCompany(c);
                            setIsDrawerOpen(true);
                          }}
                          className="h-8 text-xs rounded-xl cursor-pointer"
                        >
                          <Eye className="size-3.5 mr-1" /> View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                      <th className="p-3">Company Name</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3 text-center">Recruiters</th>
                      <th className="p-3 text-center">Hired</th>
                      <th className="p-3 text-center">Highest Package</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 font-medium">
                    {paginatedCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-lg ${c.logoBg} text-white grid place-items-center font-bold text-xs`}>
                              {c.logoText}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-xs">{c.name}</p>
                              <span className="text-[0.65rem] font-mono text-muted-foreground">{c.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-muted-foreground">{c.industry}</td>
                        <td className="p-3 font-mono text-[0.68rem]">{c.tier}</td>
                        <td className="p-3 text-center font-mono font-bold">{c.recruitersCount}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-600">{c.studentsHired}</td>
                        <td className="p-3 text-center font-mono font-bold text-primary">{c.highestPackage}</td>
                        <td className="p-3">
                          <Badge variant="outline">{c.status}</Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCompany(c);
                              setIsDrawerOpen(true);
                            }}
                            className="h-8 text-xs rounded-xl cursor-pointer"
                          >
                            <Eye className="size-3.5 mr-1" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION FOOTER */}
            <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground border-t border-border">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="size-3.5 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                >
                  Next <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Panel>

      {/* ==================================================================== */}
      {/* 7. COMPANY ANALYTICS & ACTIVITIES ROW                               */}
      {/* ==================================================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* CHART (2 COLS) */}
        <div className="lg:col-span-2">
          <Panel title="Companies by Industry Vertical" description="Industry classification of institutional recruiting partners.">
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INDUSTRY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* AI INSIGHTS & ACTIVITIES (1 COL) */}
        <div className="space-y-6">
          <Panel
            title="AI Corporate Insights"
            description="Institutional recommendation alerts."
            action={<Sparkles className="size-4 text-purple-500" />}
          >
            <div className="space-y-3 pt-1">
              {[
                { title: "Continuous Hiring Partner", desc: "Google Cloud has hired continuously for 4 consecutive academic years.", tag: "Top Partner" },
                { title: "Highest Package Recruiter", desc: "Microsoft offered the highest average CTC (₹24.8 LPA) this season.", tag: "High CTC" },
                { title: "Pending Verification Alert", desc: "2 corporate partners require MoU document verification today.", tag: "Action Needed" },
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
      </div>

      {/* ==================================================================== */}
      {/* 5. COMPANY PROFILE DRAWER (RIGHT SIDE SLIDE-OVER SHEET)              */}
      {/* ==================================================================== */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto space-y-4">
          {selectedCompany && (
            <>
              <SheetHeader className="pb-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-2xl ${selectedCompany.logoBg} text-white grid place-items-center font-extrabold text-lg shadow-xs`}>
                    {selectedCompany.logoText}
                  </div>
                  <div>
                    <SheetTitle className="text-base font-extrabold">{selectedCompany.name}</SheetTitle>
                    <SheetDescription className="text-xs font-semibold text-primary">
                      {selectedCompany.industry} • {selectedCompany.tier}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* DRAWER TABS */}
              <Tabs value={drawerTab} onValueChange={setDrawerTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 rounded-xl w-full grid grid-cols-3 text-[0.65rem] font-bold mb-4">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg">Hiring History</TabsTrigger>
                  <TabsTrigger value="contacts" className="rounded-lg">Contacts</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-3 text-xs mt-0">
                  <div className="p-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p><span className="font-semibold text-muted-foreground">Company ID:</span> {selectedCompany.id}</p>
                    <p><span className="font-semibold text-muted-foreground">Headquarters:</span> {selectedCompany.location}</p>
                    <p><span className="font-semibold text-muted-foreground">Corporate Website:</span> <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-primary underline">{selectedCompany.website}</a></p>
                    <p><span className="font-semibold text-muted-foreground">Highest Package Offered:</span> {selectedCompany.highestPackage}</p>
                    <p><span className="font-semibold text-muted-foreground">Average Package Offered:</span> {selectedCompany.avgPackage}</p>
                    <p><span className="font-semibold text-muted-foreground">Total Students Placed:</span> {selectedCompany.studentsHired} Candidates</p>
                  </div>
                </TabsContent>

                {/* HISTORY TAB */}
                <TabsContent value="history" className="space-y-3 text-xs mt-0">
                  <div className="p-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p className="font-bold text-foreground">Institutional Hiring Partnership</p>
                    <p><span className="font-semibold text-muted-foreground">Repeat Hiring Partner:</span> {selectedCompany.repeatPartnerYears} Consecutive Years</p>
                    <p><span className="font-semibold text-muted-foreground">Active Campus Drives:</span> {selectedCompany.activeDrives} Drives</p>
                    <p><span className="font-semibold text-muted-foreground">Registered HR Recruiters:</span> {selectedCompany.recruitersCount} Recruiters</p>
                  </div>
                </TabsContent>

                {/* CONTACTS TAB */}
                <TabsContent value="contacts" className="space-y-3 text-xs mt-0">
                  <div className="p-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
                    <p><span className="font-semibold text-muted-foreground">Primary HR Contact:</span> {selectedCompany.contactPerson}</p>
                    <p><span className="font-semibold text-muted-foreground">Official Email:</span> {selectedCompany.contactEmail}</p>
                    <p><span className="font-semibold text-muted-foreground">Verification Date:</span> {selectedCompany.registrationDate}</p>
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

      {/* REGISTER COMPANY MODAL */}
      <Dialog open={activeModal === "register"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Register Corporate Partner (Company)</DialogTitle>
            <DialogDescription>Add new enterprise hiring organization to TPO portal.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Company Legal Name</label>
              <Input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Tesla Motors India"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Industry Sector</label>
                <select
                  value={formIndustry}
                  onChange={(e) => setFormIndustry(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold"
                >
                  <option value="IT & Cloud Services">IT & Cloud Services</option>
                  <option value="Enterprise Software">Enterprise Software</option>
                  <option value="Semiconductors">Semiconductors</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Banking & BFSI">Banking & BFSI</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tier Category</label>
                <select
                  value={formTier}
                  onChange={(e) => setFormTier(e.target.value as Company["tier"])}
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
              <label className="text-xs font-semibold">HQ Location</label>
              <Input
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Bengaluru, KA"
                className="h-10 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Corporate Website URL</label>
              <Input
                value={formWebsite}
                onChange={(e) => setFormWebsite(e.target.value)}
                placeholder="https://company.com"
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

      {/* IMPORT COMPANIES MODAL */}
      <Dialog open={activeModal === "import"} onOpenChange={(open) => !open && setActiveModal("none")}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Import Corporate Partners CSV</DialogTitle>
            <DialogDescription>Upload a CSV file containing company contacts & details.</DialogDescription>
          </DialogHeader>
          <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center space-y-2 bg-muted/20">
            <Upload className="size-8 text-muted-foreground mx-auto" />
            <p className="text-xs font-bold">Drag and drop companies.csv here</p>
            <p className="text-[0.68rem] text-muted-foreground">Supported format: CSV (Company Name, Industry, HR Contact)</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal("none")} className="rounded-xl">Cancel</Button>
            <Button
              onClick={() => {
                setActiveModal("none");
                toast.success("Successfully imported 14 corporate partner records");
              }}
              className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer"
            >
              Start Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
