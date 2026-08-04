import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Building2,
  Briefcase,
  CheckCircle2,
  Calendar,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  PieChart as PieChartIcon,
  Layers,
  GraduationCap,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Medal,
  Percent,
  CheckSquare,
  Code2,
  Database,
  Clock,
  ShieldCheck,
  FileText,
  Printer,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Activity,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
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

// ============================================================================
// MOCK DATA TYPES & SETUP FOR PLACEMENT ANALYTICS & EXECUTIVE INTELLIGENCE
// ============================================================================

const MONTHLY_PLACEMENT_TREND = [
  { month: "Aug 2025", placed: 120, avgPackage: 10.2 },
  { month: "Sep 2025", placed: 240, avgPackage: 11.5 },
  { month: "Oct 2025", placed: 380, avgPackage: 11.8 },
  { month: "Nov 2025", placed: 510, avgPackage: 12.1 },
  { month: "Dec 2025", placed: 720, avgPackage: 11.9 },
  { month: "Jan 2026", placed: 890, avgPackage: 11.7 },
  { month: "Feb 2026", placed: 1080, avgPackage: 11.8 },
];

const DEPT_PLACEMENT_ANALYTICS = [
  { dept: "CSE", eligible: 350, placed: 336, percentage: 96.0, avgSalary: 14.8, maxSalary: 44.5 },
  { dept: "AI & ML", eligible: 200, placed: 188, percentage: 94.0, avgSalary: 13.5, maxSalary: 38.0 },
  { dept: "ECE", eligible: 280, placed: 240, percentage: 85.7, avgSalary: 10.2, maxSalary: 32.0 },
  { dept: "EEE", eligible: 180, placed: 150, percentage: 83.3, avgSalary: 9.4, maxSalary: 24.0 },
  { dept: "ME", eligible: 140, placed: 100, percentage: 71.4, avgSalary: 7.8, maxSalary: 18.0 },
  { dept: "Civil", eligible: 100, placed: 66, percentage: 66.0, avgSalary: 6.8, maxSalary: 14.0 },
];

const PACKAGE_HISTOGRAM_DATA = [
  { range: "0–5 LPA", count: 180, fill: "#10b981" },
  { range: "5–10 LPA", count: 450, fill: "#3b82f6" },
  { range: "10–20 LPA", count: 310, fill: "#8b5cf6" },
  { range: "20–30 LPA", count: 95, fill: "#ec4899" },
  { range: "30+ LPA", count: 45, fill: "#f59e0b" },
];

const OFFER_TIER_PIE_DATA = [
  { name: "Regular (<₹10 LPA)", value: 630, color: "#3b82f6" },
  { name: "Dream (₹10–20 LPA)", value: 355, color: "#8b5cf6" },
  { name: "Super Dream (≥₹20 LPA)", value: 95, color: "#ec4899" },
];

const COMPANY_ANALYTICS_CARDS = [
  { name: "Google Cloud", hires: 18, avg: "₹32.0 LPA", max: "₹44.5 LPA", trend: "+15% YoY", repeat: "Yes (Tier 1)", rating: 4.9, logoBg: "bg-blue-600" },
  { name: "Microsoft", hires: 24, avg: "₹34.0 LPA", max: "₹44.5 LPA", trend: "+20% YoY", repeat: "Yes (Tier 1)", rating: 4.9, logoBg: "bg-emerald-600" },
  { name: "Amazon AWS", hires: 32, avg: "₹29.5 LPA", max: "₹36.0 LPA", trend: "+12% YoY", repeat: "Yes (Tier 1)", rating: 4.8, logoBg: "bg-amber-600" },
  { name: "Qualcomm", hires: 15, avg: "₹20.0 LPA", max: "₹24.0 LPA", trend: "+8% YoY", repeat: "Yes (Tier 2)", rating: 4.7, logoBg: "bg-purple-600" },
  { name: "Infosys Ltd", hires: 145, avg: "₹8.5 LPA", max: "₹12.0 LPA", trend: "+5% YoY", repeat: "Mass Recruiter", rating: 4.5, logoBg: "bg-indigo-600" },
  { name: "TCS Digital", hires: 180, avg: "₹7.5 LPA", max: "₹11.0 LPA", trend: "+10% YoY", repeat: "Mass Recruiter", rating: 4.4, logoBg: "bg-cyan-600" },
  { name: "Accenture", hires: 110, avg: "₹8.2 LPA", max: "₹12.5 LPA", trend: "+6% YoY", repeat: "Mass Recruiter", rating: 4.5, logoBg: "bg-slate-700" },
];

const FUNNEL_STAGES_PIPELINE = [
  { stage: "Eligible", label: "Eligible", count: 1250 },
  { stage: "Applied", label: "Applied", count: 1180 },
  { stage: "Assessment", label: "Test Taken", count: 980 },
  { stage: "Qualified", label: "Qualified", count: 420 },
  { stage: "Interview", label: "Interviewed", count: 360 },
  { stage: "Selected", label: "Selected", count: 290 },
  { stage: "Offer Released", label: "Offer Released", count: 280 },
  { stage: "Accepted", label: "Accepted", count: 250 },
  { stage: "Joined", label: "Joined", count: 240 },
  { stage: "Alumni Ready", label: "Alumni Ready", count: 230 },
];

const DOWNLOADABLE_REPORTS_LIST = [
  { title: "Institutional Placement Annual Report 2025–26", category: "Annual Summary", desc: "Comprehensive 48-page institutional report covering company participation, package CTC distribution, and branch statistics." },
  { title: "NAAC Accreditation Criterion 5.2 Placement Report", desc: "Official NAAC audit document with student placement records, higher education details, and employer verification." },
  { title: "NBA Accreditation Branch-wise Outcome Report", desc: "Outcome-based education placement report mapping CSE, ECE, and EEE student career trajectories." },
  { title: "NIRF Data Submission Placement Metrics 2026", desc: "Audited NIRF ranking format details detailing median salary package and total placed graduates." },
  { title: "Company-wise Corporate Hiring Analytics Report", desc: "Recruiter hiring performance, CTC benchmarking, and repeat recruiter engagement statistics." },
  { title: "Assessment & Proctored Test Operations Audit Report", desc: "Evaluation logs, proctoring alerts, section pass rates, and malpractice incident logs." },
];

export function PlacementAnalyticsWorkspace() {
  const [activeTab, setActiveTab] = useState("overview");

  // Global Filter State
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2025-2026");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedOfferType, setSelectedOfferType] = useState("All");
  const [selectedPackageRange, setSelectedPackageRange] = useState("All");
  const [selectedFunnelStage, setSelectedFunnelStage] = useState("All");

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedAcademicYear("2025-2026");
    setSelectedDept("All");
    setSelectedCompany("All");
    setSelectedOfferType("All");
    setSelectedPackageRange("All");
    setSelectedFunnelStage("All");
    toast.info("Reset all global placement analytics filters");
  };

  // Header Actions
  const handleExportDashboard = () => {
    toast.success("Exported Executive Placement Analytics Dashboard (PDF & PNG)");
  };

  const handleShareReport = () => {
    toast.info("Generated shareable executive dashboard link for Vice Chancellor & Deans");
  };

  const handleGenerateAIReport = () => {
    toast.success("Generated AI Strategic Institutional Placement Insight Report (2026)");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* EXECUTIVE FULL-PAGE HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <BarChart3 className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-mono text-[0.7rem]">
                  ● Live Executive Intelligence Active
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem] bg-primary/5 text-primary">
                  Power BI / SAP Analytics Style
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Placement Analytics & Executive Intelligence
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Institution-wide placement performance, hiring funnels, recruiter insights, and strategic analytics.
              </p>
            </div>
          </div>

          {/* HEADER ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleGenerateAIReport}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Sparkles className="size-4 text-amber-300" /> Generate AI Report
            </Button>
            <Button
              onClick={handleExportDashboard}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Download className="size-4" /> Export Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={handleShareReport}
              className="text-xs rounded-xl h-10 px-3 cursor-pointer gap-1.5"
            >
              <Share2 className="size-3.5" /> Share Report
            </Button>
          </div>
        </div>
      </div>

      {/* GLOBAL ENTERPRISE FILTER BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="size-4 text-primary" /> Global Placement Filter Engine
          </span>
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-7 text-xs text-primary font-bold cursor-pointer">
            <RefreshCw className="size-3 mr-1" /> Reset All Filters
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground">Academic Year</label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="2025-2026">2025 – 2026 (Current)</option>
              <option value="2024-2025">2024 – 2025</option>
              <option value="2023-2024">2023 – 2024</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="AI & ML">AI & ML</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Companies</option>
              <option value="Google">Google Cloud</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon AWS</option>
              <option value="Qualcomm">Qualcomm</option>
              <option value="Infosys">Infosys</option>
              <option value="TCS">TCS Digital</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground">Offer Tier</label>
            <select
              value={selectedOfferType}
              onChange={(e) => setSelectedOfferType(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All Offer Tiers</option>
              <option value="Super Dream">Super Dream (≥₹20 LPA)</option>
              <option value="Dream">Dream (₹10–20 LPA)</option>
              <option value="Regular">Regular (&lt;₹10 LPA)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground">Package Range</label>
            <select
              value={selectedPackageRange}
              onChange={(e) => setSelectedPackageRange(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="All">All CTC Ranges</option>
              <option value="30+">₹30+ LPA</option>
              <option value="20-30">₹20–30 LPA</option>
              <option value="10-20">₹10–20 LPA</option>
              <option value="5-10">₹5–10 LPA</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground">Campus Location</label>
            <select className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer">
              <option>Main University Campus</option>
              <option>North Extension Campus</option>
            </select>
          </div>
        </div>
      </div>

      {/* 15 EXECUTIVE KPI DASHBOARD CARDS */}
      <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-15">
        {[
          { label: "Eligible Students", val: "1,250", desc: "Final Year Batch", color: "text-blue-600 bg-blue-500/10" },
          { label: "Placed Students", val: "1,080", desc: "Confirmed Jobs", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Placement Rate", val: "86.4%", desc: "+4.2% YoY", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Highest Package", val: "₹44.5", desc: "Microsoft SDE", color: "text-purple-600 bg-purple-500/10" },
          { label: "Average Package", val: "₹11.8", desc: "+11% YoY", color: "text-blue-600 bg-blue-500/10" },
          { label: "Median Package", val: "₹9.2", desc: "Institutional Avg", color: "text-indigo-600 bg-indigo-500/10" },
          { label: "Dream Offers", val: "240", desc: "₹10–20 LPA", color: "text-blue-600 bg-blue-500/10" },
          { label: "Super Dream", val: "95", desc: "≥₹20 LPA", color: "text-purple-600 bg-purple-500/10" },
          { label: "Companies Visited", val: "142", desc: "Recruiter Corporate", color: "text-teal-600 bg-teal-500/10" },
          { label: "Companies Hiring", val: "128", desc: "Active Rolled Offers", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Active Drives", val: "8", desc: "In Progress", color: "text-amber-600 bg-amber-500/10" },
          { label: "Completed Drives", val: "45", desc: "Closed & Audited", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Offer Acceptance", val: "89.2%", desc: "Student Signed", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Joining Confirm %", val: "94.5%", desc: "HR Verified", color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Recruiter Rating", val: "4.8", desc: "Out of 5.0", color: "text-amber-500 bg-amber-500/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-3 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs">
            <span className="text-[0.6rem] font-semibold text-muted-foreground block truncate">{kpi.label}</span>
            <p className="font-display text-lg font-extrabold truncate">{kpi.val}</p>
            <span className={`text-[0.58rem] font-mono px-1 py-0.5 rounded-md block truncate ${kpi.color}`}>
              {kpi.desc}
            </span>
          </div>
        ))}
      </div>

      {/* 10-STAGE INTERACTIVE PLACEMENT FUNNEL */}
      <Panel
        title="Institution-Wide Hiring Pipeline & Drop-off Funnel"
        description="Sequential candidate conversion across the entire institutional recruitment lifecycle."
        action={<Badge variant="outline" className="font-mono text-xs">Stage: {selectedFunnelStage}</Badge>}
      >
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10 pt-1">
          {FUNNEL_STAGES_PIPELINE.map((s, idx) => (
            <div
              key={s.stage}
              onClick={() => {
                setSelectedFunnelStage(s.stage);
                toast.info(`Filtered analytics for funnel stage: ${s.label}`);
              }}
              className={`p-3 rounded-xl border ${
                selectedFunnelStage === s.stage
                  ? "border-primary bg-primary/10 shadow-glow ring-2 ring-primary/20"
                  : "border-border/60 bg-muted/20"
              } space-y-1 cursor-pointer hover:border-primary/50 transition-all text-center`}
            >
              <span className="text-[0.62rem] font-mono text-muted-foreground block font-bold">
                0{idx + 1}
              </span>
              <p className="text-[0.7rem] font-bold truncate leading-tight">{s.label}</p>
              <p className="font-display text-base font-extrabold">{s.count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* OPERATIONAL ANALYTICS WORKSPACE TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/40 p-1.5 rounded-2xl w-full flex flex-wrap gap-1 text-xs font-bold mb-6 overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-xl px-4 py-2">Overview & Funnel</TabsTrigger>
          <TabsTrigger value="companies" className="rounded-xl px-4 py-2">Company Analytics</TabsTrigger>
          <TabsTrigger value="departments" className="rounded-xl px-4 py-2">Department Analytics</TabsTrigger>
          <TabsTrigger value="packages" className="rounded-xl px-4 py-2">Package Distribution</TabsTrigger>
          <TabsTrigger value="assessments" className="rounded-xl px-4 py-2">Assessment & Interview</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-xl px-4 py-2">Download & Reports Center</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & FUNNEL ANALYTICS */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* MONTHLY PLACEMENT TREND CHART */}
            <Panel title="Monthly Placement Progression Trend (2025–26)" description="Cumulative placed student count and average salary package growth over time.">
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_PLACEMENT_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="placed" stroke="#3b82f6" strokeWidth={3} name="Total Placed Students" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            {/* DEPARTMENT PLACEMENT PERCENTAGE */}
            <Panel title="Department Placement Rate (%) Benchmark" description="Placement success rate across all engineering branches.">
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEPT_PLACEMENT_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                    <Bar dataKey="percentage" fill="#10b981" name="Placement Rate (%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* AI EXECUTIVE STRATEGIC INSIGHTS */}
          <Panel title="AI Executive Strategic Placement Intelligence" description="Automated strategic observations generated for TPO decision making." action={<Sparkles className="size-4 text-amber-500" />}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-1">
              {[
                { title: "Placement Rate +4.2% YoY", desc: "Overall institution placement rate reached 86.4%, driven by strong CSE & ECE hiring.", tag: "YoY Growth" },
                { title: "CSE Crosses 96% Benchmark", desc: "336 out of 350 CSE graduates placed across Product & Cloud companies.", tag: "Department Lead" },
                { title: "Average Package Up 11%", desc: "Average CTC increased to ₹11.8 LPA (compared to ₹10.6 LPA in 2024–25).", tag: "Compensation" },
                { title: "Super Dream Offers +25%", desc: "95 candidates secured packages ≥₹20 LPA, with Microsoft offering highest ₹44.5 LPA.", tag: "Tier Upgrade" },
              ].map((ai) => (
                <div key={ai.title} className="p-4 rounded-2xl border border-border/70 bg-card space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-500" /> {ai.title}
                    </span>
                    <Badge variant="outline" className="text-[0.62rem] font-mono">{ai.tag}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{ai.desc}</p>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 2: COMPANY ANALYTICS */}
        <TabsContent value="companies" className="space-y-6 mt-0">
          <Panel title="Corporate Recruiter Hiring Intelligence Directory" description="Performance, hiring volume, and package statistics of key hiring partners.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-1">
              {COMPANY_ANALYTICS_CARDS.map((comp) => (
                <div key={comp.name} className="p-4 rounded-2xl border border-border/70 bg-card space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl ${comp.logoBg} text-white grid place-items-center font-bold text-sm shadow-xs`}>
                        {comp.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-extrabold">{comp.name}</h4>
                        <span className="text-[0.65rem] font-mono text-muted-foreground">{comp.repeat}</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white font-mono text-[0.65rem]">
                      ⭐ {comp.rating} / 5.0
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-xl space-y-1.5 text-xs font-mono border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Students Hired:</span>
                      <span className="font-bold text-foreground">{comp.hires} Students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Highest CTC Offered:</span>
                      <span className="font-bold text-purple-600">{comp.max}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Average Package:</span>
                      <span className="font-bold text-blue-600">{comp.avg}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Hiring Growth: <span className="text-emerald-600 font-bold">{comp.trend}</span></span>
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewed complete hiring dossier for ${comp.name}`)} className="h-7 text-xs rounded-lg cursor-pointer">
                      Dossier <ChevronRight className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 3: DEPARTMENT ANALYTICS */}
        <TabsContent value="departments" className="space-y-6 mt-0">
          <Panel title="Academic Department Placement Dossier" description="Detailed placement coverage, average salary, and top package by branch.">
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                    <th className="p-3">Department Branch</th>
                    <th className="p-3 text-center">Eligible Students</th>
                    <th className="p-3 text-center">Placed Students</th>
                    <th className="p-3 text-center">Placement Rate (%)</th>
                    <th className="p-3 text-right">Average Package</th>
                    <th className="p-3 text-right">Highest Package</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-medium">
                  {DEPT_PLACEMENT_ANALYTICS.map((d) => (
                    <tr key={d.dept} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-bold text-foreground text-sm">{d.dept} Department</td>
                      <td className="p-3 text-center font-mono">{d.eligible}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-600">{d.placed}</td>
                      <td className="p-3 text-center font-mono font-extrabold text-blue-600">{d.percentage}%</td>
                      <td className="p-3 text-right font-mono font-bold">₹{d.avgSalary} LPA</td>
                      <td className="p-3 text-right font-mono font-extrabold text-purple-600">₹{d.maxSalary} LPA</td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => toast.info(`Downloaded Department Report for ${d.dept}`)} className="h-7 text-xs rounded-xl cursor-pointer">
                          Branch Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 4: PACKAGE ANALYTICS */}
        <TabsContent value="packages" className="space-y-6 mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Salary Package Distribution Histogram" description="Distribution of placed candidates across LPA mark brackets.">
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PACKAGE_HISTOGRAM_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                    <Bar dataKey="count" fill="#8b5cf6" name="Students Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Offer Category Distribution (Tier Ratio)" description="Breakdown of Super Dream, Dream, and Regular job offers.">
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={OFFER_TIER_PIE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {OFFER_TIER_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* TAB 5: ASSESSMENT & INTERVIEW ANALYTICS */}
        <TabsContent value="assessments" className="space-y-6 mt-0">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: "MCQ Section Accuracy", val: "82.4%", desc: "Aptitude & CS Fundamentals", icon: CheckSquare, color: "text-blue-600 bg-blue-500/10" },
              { title: "Coding Success Rate", val: "68.2%", desc: "Algorithmic Challenges", icon: Code2, color: "text-purple-600 bg-purple-500/10" },
              { title: "SQL Query Success", val: "74.1%", desc: "Complex Database Joins", icon: Database, color: "text-emerald-600 bg-emerald-500/10" },
              { title: "Technical Interview Pass %", val: "72.0%", desc: "Cleared Round 1", icon: ShieldCheck, color: "text-amber-600 bg-amber-500/10" },
            ].map((stat) => (
              <div key={stat.title} className="p-4 rounded-2xl border border-border/70 bg-card space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{stat.title}</span>
                  <stat.icon className="size-4 text-primary" />
                </div>
                <p className="font-display text-2xl font-extrabold">{stat.val}</p>
                <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-md block truncate ${stat.color}`}>
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 6: DOWNLOAD & REPORTS CENTER */}
        <TabsContent value="reports" className="space-y-6 mt-0">
          <Panel title="Institutional Report Download Center" description="Generate NIRF, NAAC, NBA, and institutional placement audit reports.">
            <div className="grid gap-4 sm:grid-cols-2 pt-1">
              {DOWNLOADABLE_REPORTS_LIST.map((rep) => (
                <div key={rep.title} className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-extrabold flex items-center gap-1.5">
                      <FileText className="size-4 text-primary" /> {rep.title}
                    </h4>
                    <Badge variant="outline" className="text-[0.62rem] font-mono">PDF Format</Badge>
                  </div>
                  <p className="text-[0.725rem] text-muted-foreground font-mono">{rep.desc}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.info(`Previewing ${rep.title}`)} className="h-8 text-xs rounded-xl cursor-pointer">
                      <Eye className="size-3 mr-1" /> Preview Report
                    </Button>
                    <Button size="sm" onClick={() => toast.success(`Generated and downloaded ${rep.title}`)} className="h-8 text-xs bg-emerald-600 text-white rounded-xl cursor-pointer">
                      <Download className="size-3 mr-1" /> Download Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
