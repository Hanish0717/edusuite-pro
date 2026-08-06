import React, { useEffect, useState } from "react";
import {
  Building,
  RefreshCw,
  Download,
  Users,
  Bed,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Calendar,
  Zap,
  Droplet,
  Wifi,
  Video,
  FileCheck,
  Clock,
  Sliders,
  CheckCircle2,
  FileText,
  PieChart,
  Wrench,
  BellRing,
  UserCheck,
  ShieldAlert,
  BarChart3,
  Filter,
  FileSpreadsheet,
  HeartPulse,
  Sparkles,
  Utensils,
  XCircle,
  FileDown,
  Search,
  Eye,
  Loader2,
  TrendingUp,
  PhoneCall,
  Flame,
  Lock,
  Printer,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getWardenMessSummary,
  exportMessReportCSV,
  exportMessReportPDF,
  getAllStoredConfirmations,
  MealType,
} from "@/components/student-hostel/meal-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  fetchHostelRooms,
  fetchHostelResidents,
  fetchGatePasses,
  INITIAL_BLOCKS,
  INITIAL_ROOMS,
  ENHANCED_RESIDENTS,
  INITIAL_PASSES,
  INITIAL_GATE_PASS_DETAILS,
  INITIAL_COMPLAINT_DETAILS,
  DEFAULT_SECURITY_METRICS,
  DEFAULT_COMPLAINT_COMPLIANCE,
  DEFAULT_ANALYTICS,
  DEFAULT_HOSTEL_CONFIG,
  DEFAULT_HOSTEL_HEALTH,
  DEFAULT_MAINTENANCE_SUMMARY,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  DEFAULT_STAFF_SUMMARY,
  DEFAULT_POLICY_COMPLIANCE,
  type HostelRoom,
  type HostelBlockInfo,
  type EnhancedResidentStudent,
  type GatePassRequest,
  type GatePassDetailItem,
  type HostelComplaintDetailItem,
  type GatePassSecurityMetrics,
  type ComplaintComplianceSummary,
  type ExecutiveHostelAnalyticsData,
  type HostelConfig,
  type HostelHealthStatus,
  type MaintenanceSummary,
  type HostelAlert,
  type HostelActivityLog,
  type HostelStaffSummary,
  type PolicyComplianceStatus,
} from "./HostelService";

export function HostelModuleView() {
  const [blocks] = useState<HostelBlockInfo[]>(INITIAL_BLOCKS);
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS);
  const [residents, setResidents] = useState<EnhancedResidentStudent[]>(ENHANCED_RESIDENTS);
  const [passes, setPasses] = useState<GatePassRequest[]>(INITIAL_PASSES);
  const [activeTab, setActiveTab] = useState<"blocks" | "residents" | "compliance" | "analytics" | "mess">("blocks");

  const todayStr = new Date().toISOString().split("T")[0];
  const [messSummary, setMessSummary] = useState(() => getWardenMessSummary(todayStr));

  const reloadMessSummary = () => {
    setMessSummary(getWardenMessSummary(todayStr));
  };

  useEffect(() => {
    reloadMessSummary();
    const handleUpdate = () => reloadMessSummary();
    if (typeof window !== "undefined") {
      window.addEventListener("meal-confirmations-updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("meal-confirmations-updated", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      }
    };
  }, [todayStr]);

  const [loading, setLoading] = useState(false);

  // Filters state for Resident Roster
  const [residentSearch, setResidentSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterBlock, setFilterBlock] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFee, setFilterFee] = useState("All");
  const [filterMedicalOnly, setFilterMedicalOnly] = useState(false);

  // Executive Dialogs State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<"fees" | "policies" | "timings" | "operations">("fees");
  const [configForm, setConfigForm] = useState<HostelConfig>(DEFAULT_HOSTEL_CONFIG);

  // Tab 3 Super Admin Compliance & Security State
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [viewDetailsTab, setViewDetailsTab] = useState<"gatepass" | "complaints">("gatepass");
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSecurityReportOpen, setIsSecurityReportOpen] = useState(false);
  const [isComplaintAnalyticsOpen, setIsComplaintAnalyticsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [auditForm, setAuditForm] = useState({
    auditDate: "2026-08-20",
    auditTime: "10:00",
    auditScope: "Fire Safety & Perimeter Security Inspection",
    inspector: "Super Admin Safety Audit Cell",
    remarks: "Quarterly comprehensive hostel building compliance inspection.",
  });

  // Governance Telemetry & Lists
  const [gatePassDetails] = useState<GatePassDetailItem[]>(INITIAL_GATE_PASS_DETAILS);
  const [complaintDetails] = useState<HostelComplaintDetailItem[]>(INITIAL_COMPLAINT_DETAILS);
  const [healthStatus] = useState<HostelHealthStatus>(DEFAULT_HOSTEL_HEALTH);
  const [maintenanceSummary] = useState<MaintenanceSummary>(DEFAULT_MAINTENANCE_SUMMARY);
  const [alerts, setAlerts] = useState<HostelAlert[]>(INITIAL_ALERTS);
  const [activities, setActivities] = useState<HostelActivityLog[]>(INITIAL_ACTIVITIES);
  const [staffSummary] = useState<HostelStaffSummary>(DEFAULT_STAFF_SUMMARY);
  const [compliance] = useState<PolicyComplianceStatus>(DEFAULT_POLICY_COMPLIANCE);
  const [securityMetrics] = useState<GatePassSecurityMetrics>(DEFAULT_SECURITY_METRICS);
  const [complaintCompliance] = useState<ComplaintComplianceSummary>(DEFAULT_COMPLAINT_COMPLIANCE);
  const [analytics] = useState<ExecutiveHostelAnalyticsData>(DEFAULT_ANALYTICS);

  const addActivityLog = (action: string, category: string) => {
    const newLog: HostelActivityLog = {
      id: `ACT-${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Super Admin (Executive)",
      action,
      category,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const [rm, res, ps] = await Promise.all([
      fetchHostelRooms(),
      fetchHostelResidents(),
      fetchGatePasses(),
    ]);
    setRooms(rm);
    setResidents(res);
    setPasses(ps);
    if (!isSilent) setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filtered residents logic
  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.roomNo.toLowerCase().includes(residentSearch.toLowerCase());
    const matchesDept = filterDept === "All" || r.department === filterDept;
    const matchesYear = filterYear === "All" || r.year === filterYear;
    const matchesBlock = filterBlock === "All" || r.block === filterBlock;
    const matchesStatus = filterStatus === "All" || r.residentStatus === filterStatus;
    const matchesFee = filterFee === "All" || r.feeStatus === filterFee;
    const matchesMedical = !filterMedicalOnly || (r.medicalAlerts && r.medicalAlerts !== "None");

    return matchesSearch && matchesDept && matchesYear && matchesBlock && matchesStatus && matchesFee && matchesMedical;
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigOpen(false);
    addActivityLog("Updated Hostel Policy Configuration", "Configuration");
    toast.success("Hostel Governance & Policy Configuration updated!");
  };

  const handleExportCSV = () => {
    const headers = ["Block ID", "Block Name", "Capacity", "Occupied Rooms", "Vacant Rooms", "Under Maintenance", "Occupancy %", "Annual Revenue (INR)", "Warden", "Health Status"];
    const rows = blocks.map((b) => [b.id, `"${b.name}"`, b.capacity, b.occupiedRooms, b.vacantRooms, b.underMaintenance, `${b.occupancyPercentage}%`, b.annualRevenue, `"${b.currentWarden}"`, b.healthStatus]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hostel_Block_Governance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addActivityLog("Exported Block Inventory Report to CSV", "Export");
    toast.success("Exported block inventory report to CSV!");
  };

  const handleExportPDF = () => {
    addActivityLog("Generated Executive Hostel Analytics PDF Report", "Reports");
    toast.success("Hostel Analytics Executive Report (PDF) compiled and downloaded.");
  };

  const handleExportExcel = () => {
    addActivityLog("Exported Hostel Master Ledger to Excel", "Reports");
    toast.success("Hostel Analytics Master Ledger (Excel) generated.");
  };

  const handleScheduleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditModalOpen(false);
    addActivityLog(`Scheduled Hostel Security Audit (${auditForm.auditScope}) for ${auditForm.auditDate}`, "Audit");
    
    const newAlert: HostelAlert = {
      id: `ALT-${Date.now()}`,
      severity: "medium",
      title: "Hostel Security Audit Scheduled",
      description: `Scheduled for ${auditForm.auditDate} at ${auditForm.auditTime}. Scope: ${auditForm.auditScope}`,
      timestamp: "Just now",
    };
    setAlerts((prev) => [newAlert, ...prev]);

    toast.success(`Hostel Security Audit scheduled for ${auditForm.auditDate}!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Building className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Hostel & Residential Infrastructure Governance
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Executive Console
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Super Admin monitoring console for block occupancy, resident rosters, compliance, security telemetry, and complaint analytics.
            </p>
          </div>
        </div>

        {/* Action Buttons - Executive Governance */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Blocks
          </Button>
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Sliders className="size-4" /> Hostel Configuration
          </Button>
        </div>
      </div>

      {/* TOP KPI SECTION - ROW 1: PRIMARY KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Capacity & Occupancy</span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">944 / 1,000</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">94.4% Overall Occupancy Rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Annual Revenue Realized</span>
            <Bed className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">₹8.78 Cr</p>
          <p className="text-[0.68rem] text-muted-foreground">98.2% Fee Realization Rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Active Outings & Passes</span>
            <KeyRound className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{securityMetrics.approved} Active Passes</p>
          <p className="text-[0.68rem] text-muted-foreground">{securityMetrics.requestsToday} total pass requests today</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Open Maintenance & Complaints</span>
            <Wrench className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{complaintCompliance.complaints.open + complaintCompliance.complaints.inProgress} Pending</p>
          <p className="text-[0.68rem] text-muted-foreground">Avg SLA: 24 Hours Resolution</p>
        </div>
      </div>

      {/* EXECUTIVE GOVERNANCE WIDGET: HEALTH STATUS TELEMETRY */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Activity className="size-4 text-emerald-500" /> Hostel Health & Infrastructure Telemetry
          </h3>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
            Health Score: {healthStatus.overallHealthScore} / 100
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Overall Residential Infrastructure & Utility Health Score</span>
            <span className="text-emerald-600 font-mono font-bold">{healthStatus.overallHealthScore}% Operational Uptime</span>
          </div>
          <Progress value={healthStatus.overallHealthScore} className="h-2 bg-muted" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" /> Occupancy
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.occupancyStatus}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" /> Grid Electricity
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.electricityStatus}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <Droplet className="size-3.5 text-blue-500" /> Water Supply
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.waterSupply}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <Wifi className="size-3.5 text-purple-500" /> Campus Wi-Fi
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.wifiStatus}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <Video className="size-3.5 text-emerald-500" /> CCTV Network
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.cctvStatus}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <FileCheck className="size-3.5 text-blue-600" /> Fire Safety
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.fireSafetyCompliance}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" /> Security Duty
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.securityStatus}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
            <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center gap-1.5">
              <Wrench className="size-3.5 text-amber-500" /> Maintenance
            </span>
            <p className="text-xs font-bold text-foreground">{healthStatus.maintenanceStatus}</p>
          </div>
        </div>
      </div>

      {/* EXECUTIVE VIEW TABS SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab("blocks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "blocks" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          1. Hostel Blocks Overview ({blocks.length} Blocks)
        </button>
        <button
          onClick={() => setActiveTab("residents")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "residents" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          2. Resident Roster & Directory ({residents.length})
        </button>
        <button
          onClick={() => setActiveTab("compliance")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "compliance" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          3. Compliance, Security & Gate Pass Monitoring
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "analytics" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          4. Hostel Analytics & Reports
        </button>
        <button onClick={() => setActiveTab("mess")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === "mess" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          <Utensils className="size-3.5 text-amber-500" /> 4. Mess Preparation Dashboard
        </button>
      </div>

      {/* TAB 1: HOSTEL BLOCKS OVERVIEW */}
      {activeTab === "blocks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blocks.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="font-mono text-[0.65rem] text-muted-foreground block">{b.id}</span>
                    <h3 className="font-bold text-base text-foreground">{b.name}</h3>
                  </div>
                  <Badge className={b.healthStatus === "Healthy" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                    {b.quickStatusBadge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Occupancy Capacity</span>
                    <span className="font-mono text-primary">{b.occupiedRooms} / {b.capacity} Students ({b.occupancyPercentage}%)</span>
                  </div>
                  <Progress value={b.occupancyPercentage} className="h-2 bg-muted" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">Vacant</span>
                    <span className="font-mono font-bold text-emerald-600">{b.vacantRooms}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">Maintenance</span>
                    <span className="font-mono font-bold text-amber-600">{b.underMaintenance}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">Revenue</span>
                    <span className="font-mono font-bold text-primary">₹{(b.annualRevenue / 100000).toFixed(1)}L</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs border-t border-border/60 pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chief Warden:</span>
                    <span className="font-semibold text-foreground">{b.currentWarden}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance Due:</span>
                    <span className="font-mono text-muted-foreground">{b.maintenanceDue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Inspected:</span>
                    <span className="font-mono text-muted-foreground">{b.inspectionDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ROOM TYPES OVERVIEW TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Bed className="size-4 text-primary" /> Room Categories & Fee Tier Overview
              </h3>
              <span className="text-xs text-muted-foreground">Governance Inventory View</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Room No</th>
                    <th className="py-3 px-3">Hostel Block</th>
                    <th className="py-3 px-3">Category Type</th>
                    <th className="py-3 px-3">Capacity</th>
                    <th className="py-3 px-3">Occupancy</th>
                    <th className="py-3 px-3">Annual Fee (INR)</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rooms.map((rm) => (
                    <tr key={rm.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{rm.roomNo}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{rm.block}</td>
                      <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{rm.type}</Badge></td>
                      <td className="py-3 px-3 font-mono">{rm.capacity} Beds</td>
                      <td className="py-3 px-3 font-mono font-semibold text-primary">{rm.occupancy} / {rm.capacity} Occupied</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">₹{rm.annualFee.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <Badge className={rm.status === "Available" ? "bg-emerald-500/10 text-emerald-600" : rm.status === "Full" ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"}>
                          {rm.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESIDENT ROSTER & DIRECTORY */}
      {activeTab === "residents" && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS ROW */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Filter className="size-4 text-primary" /> Filter Resident Student Directory
              </h3>
              <span className="text-xs font-mono text-muted-foreground">{filteredResidents.length} Residents Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
              <div className="relative col-span-1 sm:col-span-2">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search name, roll no, room..."
                  value={residentSearch}
                  onChange={(e) => setResidentSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBlock} onValueChange={setFilterBlock}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Block" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Blocks</SelectItem>
                  <SelectItem value="Block A (Boys)">Block A (Boys)</SelectItem>
                  <SelectItem value="Block B (Girls)">Block B (Girls)</SelectItem>
                  <SelectItem value="Block C (PG Scholars)">Block C (PG)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Weekend Outing">Weekend Outing</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterFee} onValueChange={setFilterFee}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Fee Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Fee Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={filterMedicalOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMedicalOnly(!filterMedicalOnly)}
                className="h-8 text-xs gap-1 font-semibold"
              >
                <HeartPulse className="size-3 text-destructive" /> Medical Cases
              </Button>
            </div>
          </div>

          {/* RESIDENT ROSTER TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Roll No</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Dept & Year</th>
                    <th className="py-3 px-3">Room & Block</th>
                    <th className="py-3 px-3">Check-in Date</th>
                    <th className="py-3 px-3">Fee Status</th>
                    <th className="py-3 px-3">Attendance</th>
                    <th className="py-3 px-3">Disciplinary</th>
                    <th className="py-3 px-3">Emergency Contact</th>
                    <th className="py-3 px-3">Medical Alert</th>
                    <th className="py-3 px-3">Resident Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredResidents.map((res) => (
                    <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{res.name}</td>
                      <td className="py-3 px-3">{res.department} ({res.year})</td>
                      <td className="py-3 px-3 font-mono text-primary font-bold">{res.roomNo} ({res.block})</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{res.checkInDate}</td>
                      <td className="py-3 px-3"><Badge className={res.feeStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>{res.feeStatus}</Badge></td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-600">{res.attendanceStatus}</td>
                      <td className="py-3 px-3 text-muted-foreground">{res.disciplinaryStatus}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{res.emergencyContact}</td>
                      <td className="py-3 px-3 text-muted-foreground font-medium">{res.medicalAlerts}</td>
                      <td className="py-3 px-3">
                        <Badge className={res.residentStatus === "Present" ? "bg-emerald-500/10 text-emerald-600" : res.residentStatus === "On Leave" ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"}>
                          {res.residentStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLIANCE, SECURITY & GATE PASS MONITORING */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Executive Summary & Security KPI Telemetry
              </h3>
              <Badge variant="outline" className="font-mono text-xs text-primary">Super Admin Monitoring</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Passes Today</span>
                <span className="text-lg font-bold font-mono text-primary">{securityMetrics.requestsToday}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-emerald-700 uppercase block truncate">Approved Passes</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{securityMetrics.approved}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-amber-700 uppercase block truncate">Pending Passes</span>
                <span className="text-lg font-bold font-mono text-amber-700">{securityMetrics.pending}</span>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-red-700 uppercase block truncate">Rejected Passes</span>
                <span className="text-lg font-bold font-mono text-red-700">{securityMetrics.rejected}</span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-purple-700 uppercase block truncate">Emergency Passes</span>
                <span className="text-lg font-bold font-mono text-purple-700">{securityMetrics.emergencyPasses || 3}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-amber-800 uppercase block truncate">Late Return Cases</span>
                <span className="text-lg font-bold font-mono text-amber-800">{securityMetrics.lateEntries}</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Total Complaints</span>
                <span className="text-lg font-bold font-mono text-foreground">{complaintCompliance.complaints.open + complaintCompliance.complaints.inProgress + complaintCompliance.complaints.resolved}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-amber-700 uppercase block truncate">Open Complaints</span>
                <span className="text-lg font-bold font-mono text-amber-700">{complaintCompliance.complaints.open}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <span className="text-[0.62rem] font-semibold text-emerald-700 uppercase block truncate">Resolved Complaints</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{complaintCompliance.complaints.resolved}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 & SECTION 3: GATE PASS & COMPLAINT ANALYTICS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* SECTION 2: GATE PASS ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" /> Gate Pass Analytics & Outing Statistics
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewDetailsTab("gatepass");
                    setIsViewDetailsOpen(true);
                  }}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  <Eye className="size-3.5 text-primary" /> View Details
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Trends grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50">
                    <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Daily Trend</span>
                    <span className="font-mono font-bold text-primary">18 Passes</span>
                    <span className="text-[0.62rem] text-emerald-600 block">+12% vs Yesterday</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50">
                    <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Weekly Trend</span>
                    <span className="font-mono font-bold text-foreground">112 Passes</span>
                    <span className="text-[0.62rem] text-emerald-600 block">Normal Outing Peak</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50">
                    <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Monthly Trend</span>
                    <span className="font-mono font-bold text-primary">428 Passes</span>
                    <span className="text-[0.62rem] text-muted-foreground block">Aug 2026 Total</span>
                  </div>
                </div>

                {/* Department-wise & Hostel split */}
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Boys Hostel vs Girls Hostel Requests</span>
                      <span className="font-mono text-primary">58% Boys | 42% Girls</span>
                    </div>
                    <Progress value={58} className="h-1.5 bg-muted" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Department Requests Breakdown (Top: CSE 38%, ECE 26%)</span>
                      <span className="font-mono text-emerald-600">38% CSE Share</span>
                    </div>
                    <Progress value={38} className="h-1.5 bg-muted" />
                  </div>
                </div>

                {/* Peak Hours & Weekend Stats */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">Peak Exit & Return Hours</span>
                    <p className="font-bold text-foreground text-xs">Exit: 4:30 - 6:30 PM</p>
                    <p className="font-bold text-foreground text-xs">Return: 7:30 - 9:00 PM</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">Weekend Outing Stats</span>
                    <p className="font-bold text-primary text-xs">148 Weekend Outings</p>
                    <p className="font-bold text-emerald-600 text-xs">96.4% On-Time Return</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: COMPLAINT ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Wrench className="size-4 text-amber-500" /> Resident Complaint Analytics & SLA Status
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewDetailsTab("complaints");
                    setIsViewDetailsOpen(true);
                  }}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  <Eye className="size-3.5 text-amber-600" /> View Details
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Category breakdown */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[0.62rem] font-semibold text-amber-700 uppercase block">Plumbing</span>
                    <span className="font-mono font-bold text-amber-800">35%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[0.62rem] font-semibold text-blue-700 uppercase block">Electrical</span>
                    <span className="font-mono font-bold text-blue-800">28%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <span className="text-[0.62rem] font-semibold text-purple-700 uppercase block">Wi-Fi / Net</span>
                    <span className="font-mono font-bold text-purple-800">22%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Furniture</span>
                    <span className="font-mono font-bold text-foreground">15%</span>
                  </div>
                </div>

                {/* Hostel breakdown */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Hostel-wise Complaints Share</span>
                    <span className="font-mono text-primary">Block A: 42% | Block B: 38% | Block C: 20%</span>
                  </div>
                  <Progress value={42} className="h-1.5 bg-muted" />
                </div>

                {/* SLA, High Priority & Repeated */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">Avg Resolution SLA</span>
                    <p className="font-bold text-emerald-600 text-xs">24 Hours SLA</p>
                    <p className="text-[0.68rem] text-muted-foreground">94.2% On SLA</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <span className="text-[0.65rem] text-red-700 font-semibold uppercase block">High Priority</span>
                    <p className="font-bold text-red-700 text-xs">1 Active Ticket</p>
                    <p className="text-[0.68rem] text-red-600">Leakage in C-304</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[0.65rem] text-amber-700 font-semibold uppercase block">Repeated Complaints</span>
                    <p className="font-bold text-amber-800 text-xs">2 Repeated</p>
                    <p className="text-[0.68rem] text-amber-700">Block B Wi-Fi 2F</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 & SECTION 5: SECURITY MONITORING & COMPLIANCE STATUS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* SECTION 4: SECURITY MONITORING */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Video className="size-4 text-emerald-500" /> Security & Infrastructure Monitoring
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">24/7 Security Active</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">Incidents Today</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">0 Critical</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">Visitors Logged Today</span>
                  <span className="font-mono font-bold text-primary text-sm">{securityMetrics.visitorRecords} Logged</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">Unauthorized Entry</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">0 Breach Attempts</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[0.65rem] text-muted-foreground font-semibold uppercase block">CCTV Health</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm">128/128 Active</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1 border-t border-border/60">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Fire Safety System Status:</span>
                  <span className="font-bold text-emerald-600">Smoke Detectors & Hydrants Certified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Emergency Contacts:</span>
                  <span className="font-mono font-semibold text-foreground">Chief Warden: +91 99000 11223 | Security: Ext. 101</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Hostel Inspection Status:</span>
                  <span className="font-bold text-emerald-600">Grade A+ (Passed Municipal Audit)</span>
                </div>
              </div>
            </div>

            {/* SECTION 5: COMPLIANCE STATUS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Institutional Compliance Status & Audit Schedule
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">100% Compliant</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Fire Safety Compliance</span>
                  <span className="font-bold text-emerald-600">{complaintCompliance.compliance.fireSafety}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Building Safety Compliance</span>
                  <span className="font-bold text-foreground">{compliance.buildingSafetyCertificate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Hostel Policy Compliance</span>
                  <span className="font-bold text-foreground">{complaintCompliance.compliance.hostelRules}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Visitor Register Compliance</span>
                  <span className="font-bold text-primary">{complaintCompliance.compliance.visitorRegister}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Security Audit Status</span>
                  <span className="font-bold text-emerald-600">{complaintCompliance.compliance.securityAudit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Last Inspection Date</span>
                  <span className="font-mono font-bold text-foreground">{compliance.lastAuditDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground font-medium">Next Inspection Due</span>
                  <span className="font-mono font-bold text-amber-600">2026-08-28 (23 Days)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 & SECTION 8: ALERTS & RECENT ACTIVITIES GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* SECTION 6: ALERTS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <BellRing className="size-4 text-amber-500" /> Active Security & Compliance Alerts
                </h3>
                <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">{alerts.length} Active</Badge>
              </div>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {alerts.map((alt) => (
                  <div key={alt.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        {alt.severity === "high" ? (
                          <span className="inline-block size-2 rounded-full bg-red-600 shrink-0" />
                        ) : alt.severity === "medium" ? (
                          <span className="inline-block size-2 rounded-full bg-amber-500 shrink-0" />
                        ) : (
                          <span className="inline-block size-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                        {alt.title}
                      </span>
                      <Badge className={alt.severity === "high" ? "bg-red-500/10 text-red-600 text-[0.6rem]" : alt.severity === "medium" ? "bg-amber-500/10 text-amber-600 text-[0.6rem]" : "bg-blue-500/10 text-blue-600 text-[0.6rem]"}>
                        {alt.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-[0.72rem] text-muted-foreground leading-snug">{alt.description}</p>
                    <span className="text-[0.62rem] text-muted-foreground font-mono block text-right">{alt.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: RECENT ACTIVITIES TIMELINE */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Clock className="size-4 text-primary" /> Security Audit Trail & Activity Timeline
                </h3>
                <Badge variant="outline" className="text-[0.65rem] font-mono">{activities.length} Logs</Badge>
              </div>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
                    <div className="flex justify-between text-[0.68rem] text-muted-foreground">
                      <span className="font-mono">{act.date}</span>
                      <Badge variant="secondary" className="text-[0.6rem] px-1.5 py-0">{act.category}</Badge>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{act.action}</p>
                    <p className="text-[0.68rem] text-muted-foreground">By: {act.user}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 9: EXECUTIVE QUICK ACTIONS */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Zap className="size-4 text-primary" /> Executive Governance Quick Actions
              </h3>
              <span className="text-xs text-muted-foreground">Read-Only Super Admin Monitoring Console</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <Button
                variant="outline"
                onClick={() => setIsSecurityReportOpen(true)}
                className="justify-start gap-2 h-10 text-xs font-semibold"
              >
                <Video className="size-4 text-primary shrink-0" /> View Security Report
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setActionLoading("comp-report");
                  setTimeout(() => {
                    const text = `INSTITUTIONAL HOSTEL COMPLIANCE REPORT\nDate: ${new Date().toISOString().split("T")[0]}\nFire Safety: Certified\nBuilding Safety: Certified\nSecurity Audit: Grade A+ Passed`;
                    const blob = new Blob([text], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `Hostel_Compliance_Report_${new Date().toISOString().split("T")[0]}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    setActionLoading(null);
                    addActivityLog("Generated Institutional Hostel Compliance Report", "Compliance");
                    toast.success("Hostel Compliance Report generated & downloaded!");
                  }, 400);
                }}
                disabled={actionLoading === "comp-report"}
                className="justify-start gap-2 h-10 text-xs font-semibold text-emerald-700 border-emerald-500/30"
              >
                {actionLoading === "comp-report" ? <Loader2 className="size-4 animate-spin shrink-0" /> : <FileCheck className="size-4 text-emerald-600 shrink-0" />}
                Generate Compliance Report
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setActionLoading("gate-analytics");
                  setTimeout(() => {
                    const csv = `GATE PASS ANALYTICS REPORT\nDate,Requests,Approved,Rejected,Pending,Late\n2026-08-05,18,14,2,2,4\n`;
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `Gate_Pass_Analytics_${new Date().toISOString().split("T")[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    setActionLoading(null);
                    addActivityLog("Downloaded Gate Pass Analytics & Trend Ledger", "Analytics");
                    toast.success("Gate Pass Analytics CSV exported successfully!");
                  }, 400);
                }}
                disabled={actionLoading === "gate-analytics"}
                className="justify-start gap-2 h-10 text-xs font-semibold"
              >
                {actionLoading === "gate-analytics" ? <Loader2 className="size-4 animate-spin shrink-0" /> : <Download className="size-4 text-blue-600 shrink-0" />}
                Download Gate Pass Analytics
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsAuditModalOpen(true)}
                className="justify-start gap-2 h-10 text-xs font-semibold"
              >
                <ShieldCheck className="size-4 text-purple-600 shrink-0" /> Schedule Security Audit
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsComplaintAnalyticsOpen(true)}
                className="justify-start gap-2 h-10 text-xs font-semibold"
              >
                <Wrench className="size-4 text-amber-600 shrink-0" /> View Complaint Analytics
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setActionLoading("export-comp");
                  setTimeout(() => {
                    const csv = `INSTITUTIONAL HOSTEL COMPLIANCE LEDGER\nFire Safety: Certified\nBuilding Safety: Certified\nVisitor Register: Biometric Logged\n`;
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `Hostel_Compliance_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    setActionLoading(null);
                    addActivityLog("Exported Institutional Compliance Report to CSV", "Export");
                    toast.success("Compliance Report exported to CSV!");
                  }, 400);
                }}
                disabled={actionLoading === "export-comp"}
                className="justify-start gap-2 h-10 text-xs font-semibold"
              >
                {actionLoading === "export-comp" ? <Loader2 className="size-4 animate-spin shrink-0" /> : <FileSpreadsheet className="size-4 text-emerald-600 shrink-0" />}
                Export Compliance Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOSTEL ANALYTICS & REPORTS */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" /> Executive Hostel Analytics & Institutional Reports
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Comprehensive analytics on occupancy trends, revenue, maintenance costs, and mess utilization.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleExportPDF} className="h-9 gap-1.5 text-xs font-semibold">
                <FileText className="size-3.5 text-destructive" /> Export PDF
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-9 gap-1.5 text-xs font-semibold">
                <FileSpreadsheet className="size-3.5 text-emerald-600" /> Export Excel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Hostel Revenue</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{analytics.hostelRevenue}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Maintenance Cost</span>
              <span className="text-lg font-bold font-mono text-amber-600">{analytics.maintenanceCost}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Mess Utilization</span>
              <span className="text-lg font-bold font-mono text-primary">{analytics.messUtilization}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Satisfaction Score</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{analytics.studentSatisfaction}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Complaint Trend</span>
              <span className="text-lg font-bold font-mono text-blue-600">{analytics.complaintTrend}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Inspection Status</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{analytics.inspectionReports}</span>
            </div>
          </div>

          {/* MONTHLY OCCUPANCY TREND BARS */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Monthly Occupancy Trend (2026)</h4>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
              {analytics.monthlyOccupancyTrend.map((m) => (
                <div key={m.month} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                  <span className="text-xs font-bold font-mono text-foreground block">{m.month}</span>
                  <span className="text-sm font-bold font-mono text-primary">{m.occupancyPct}%</span>
                  <Progress value={m.occupancyPct} className="h-1.5 bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MESS PREPARATION DASHBOARD */}
      {activeTab === "mess" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-6 shadow-sm">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Utensils className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-foreground">
                    Warden Mess Preparation & Food Forecasting Dashboard
                  </h3>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-mono">
                    LIVE SYNC
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time food counts automatically calculated from student meal confirmations.
                </p>
              </div>
            </div>

            {/* Export Reports Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportCSV(todayStr, "daily")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <Download className="size-3.5 text-emerald-600" /> Daily CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportPDF(todayStr, "daily")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <FileDown className="size-3.5 text-red-500" /> Daily PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportPDF(todayStr, "weekly")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <FileDown className="size-3.5 text-blue-500" /> Weekly Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportPDF(todayStr, "monthly")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <FileDown className="size-3.5 text-purple-500" /> Monthly Report
              </Button>
            </div>
          </div>

          {/* Meal Forecasting Cards (Breakfast, Lunch, Snacks, Dinner) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["Breakfast", "Lunch", "Snacks", "Dinner"] as MealType[]).map((meal) => {
              const stat = messSummary.mealStats[meal];
              return (
                <div
                  key={meal}
                  className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                      {meal}
                    </span>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                      {stat.percentage}% Opted
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Hostel Students:</span>
                      <strong className="text-foreground font-mono">{messSummary.totalStudents}</strong>
                    </div>

                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Will Eat:
                      </span>
                      <span className="font-mono">{stat.willEat}</span>
                    </div>

                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                      <span className="flex items-center gap-1">
                        <XCircle className="size-3.5" /> Will Skip:
                      </span>
                      <span className="font-mono">{stat.willSkip}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Expected Food Prep:</span>
                    <span className="text-base font-extrabold text-primary font-mono">
                      {stat.expected} Meals
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Submissions Audit Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Utensils className="size-4 text-emerald-600" /> Today's Student Submission Logs
              </h4>
              <Badge variant="outline" className="text-[10px] font-mono">
                {getAllStoredConfirmations().filter((r) => r.date === todayStr).length} Submissions Today
              </Badge>
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Block / Room</th>
                    <th className="py-2.5 px-3">Meal Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Selection</th>
                    <th className="py-2.5 px-3 text-right pr-4">Submission Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {getAllStoredConfirmations()
                    .filter((r) => r.date === todayStr)
                    .map((log, idx) => (
                      <tr key={`${log.studentId}-${log.mealType}-${idx}`} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-bold text-foreground">{log.studentName}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{log.studentId}</td>
                        <td className="py-2.5 px-3 font-mono">{log.block || "Block A"} - {log.roomNo || "A-302"}</td>
                        <td className="py-2.5 px-3 font-bold text-primary">{log.mealType}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{log.date}</td>
                        <td className="py-2.5 px-3">
                          <Badge className={log.status === "Will Eat" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold" : "bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold"}>
                            {log.status === "Will Eat" ? "✅ Will Eat" : "❌ Will Skip"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right pr-4 font-mono text-muted-foreground">{log.submittedAt}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: VIEW DETAILS READ-ONLY MODAL */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="size-5 text-primary" /> Institutional Hostel Records Detail Ledger
            </DialogTitle>
            <DialogDescription className="text-xs">
              Super Admin Executive Read-Only View (Daily operations like approval/rejection & ticket resolution are managed by Hostel Wardens).
            </DialogDescription>
          </DialogHeader>

          {/* Modal Tabs: Gate Passes / Complaints */}
          <div className="flex items-center gap-2 border-b border-border pb-2 pt-1">
            <button
              type="button"
              onClick={() => setViewDetailsTab("gatepass")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewDetailsTab === "gatepass"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Gate Passes Ledger ({gatePassDetails.length})
            </button>
            <button
              type="button"
              onClick={() => setViewDetailsTab("complaints")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewDetailsTab === "complaints"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Resident Complaints Ledger ({complaintDetails.length})
            </button>
          </div>

          {/* GATE PASSES READ-ONLY TABLE */}
          {viewDetailsTab === "gatepass" && (
            <div className="space-y-3 pt-2">
              <div className="overflow-x-auto border border-border/80 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase text-[0.65rem]">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Roll Number</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Hostel Block</th>
                      <th className="py-2.5 px-3">Pass Type</th>
                      <th className="py-2.5 px-3">Exit Time</th>
                      <th className="py-2.5 px-3">Expected Return</th>
                      <th className="py-2.5 px-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {gatePassDetails.map((pass) => (
                      <tr key={pass.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-semibold text-foreground">{pass.studentName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-foreground">{pass.rollNo}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{pass.department}</td>
                        <td className="py-2.5 px-3 font-mono text-primary font-bold">{pass.hostelBlock}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="font-mono text-xs">{pass.passType}</Badge>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{pass.exitTime}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{pass.expectedReturn}</td>
                        <td className="py-2.5 px-3">
                          <Badge className={pass.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : pass.status === "Pending" ? "bg-amber-500/10 text-amber-600" : pass.status === "Late Return" ? "bg-purple-500/10 text-purple-600" : "bg-red-500/10 text-red-600"}>
                            {pass.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[0.68rem] text-muted-foreground text-center">
                * Note: Super Admin monitoring view. Gate pass approval/rejection operations are conducted at Warden Desk.
              </p>
            </div>
          )}

          {/* COMPLAINTS READ-ONLY TABLE */}
          {viewDetailsTab === "complaints" && (
            <div className="space-y-3 pt-2">
              <div className="overflow-x-auto border border-border/80 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase text-[0.65rem]">
                    <tr>
                      <th className="py-2.5 px-3">Complaint ID</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Hostel Block</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Assigned Warden</th>
                      <th className="py-2.5 px-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {complaintDetails.map((cmp) => (
                      <tr key={cmp.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-foreground">{cmp.complaintId}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{cmp.studentName}</td>
                        <td className="py-2.5 px-3 font-mono text-primary font-bold">{cmp.hostelBlock}</td>
                        <td className="py-2.5 px-3"><Badge variant="outline" className="font-mono text-xs">{cmp.category}</Badge></td>
                        <td className="py-2.5 px-3">
                          <Badge className={cmp.priority === "High" ? "bg-red-500/10 text-red-600" : cmp.priority === "Medium" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}>
                            {cmp.priority}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-foreground">{cmp.assignedWarden}</td>
                        <td className="py-2.5 px-3">
                          <Badge className={cmp.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600" : cmp.status === "In Progress" ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"}>
                            {cmp.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[0.68rem] text-muted-foreground text-center">
                * Note: Super Admin monitoring view. Complaint resolution and warden assignments are performed at Warden Desk.
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)} className="text-xs">
              Close Ledger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK ACTION MODAL A: SECURITY REPORT MODAL */}
      <Dialog open={isSecurityReportOpen} onOpenChange={setIsSecurityReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Video className="size-4 text-emerald-500" /> Executive Security & Infrastructure Telemetry
            </DialogTitle>
            <DialogDescription className="text-xs">
              Daily perimeter security, CCTV status, and unauthorized access telemetry summary.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">CCTV Cameras Operational:</span>
                <span className="font-mono font-bold text-emerald-600">128 / 128 (100%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Biometric RFID Smart Gates:</span>
                <span className="font-mono font-bold text-emerald-600">Operational</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Perimeter Intrusion Attempts:</span>
                <span className="font-mono font-bold text-emerald-600">0 Incidents Logged</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Visitors Registered Today:</span>
                <span className="font-mono font-bold text-primary">24 Logged</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Security Personnel Manned:</span>
                <span className="font-mono font-bold text-foreground">18 Guards / 24 Hours</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsSecurityReportOpen(false)} className="text-xs">
              Close Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK ACTION MODAL B: SCHEDULE SECURITY AUDIT */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-purple-600" /> Schedule Hostel Security Audit
            </DialogTitle>
            <DialogDescription className="text-xs">
              Schedule an institutional security inspection or compliance audit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleAuditSubmit} className="space-y-3 pt-1 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Audit Date</Label>
                <Input
                  type="date"
                  value={auditForm.auditDate}
                  onChange={(e) => setAuditForm({ ...auditForm, auditDate: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Audit Time</Label>
                <Input
                  type="time"
                  value={auditForm.auditTime}
                  onChange={(e) => setAuditForm({ ...auditForm, auditTime: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Audit Scope</Label>
              <Input
                value={auditForm.auditScope}
                onChange={(e) => setAuditForm({ ...auditForm, auditScope: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Inspector / Committee Lead</Label>
              <Input
                value={auditForm.inspector}
                onChange={(e) => setAuditForm({ ...auditForm, inspector: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Remarks & Instructions</Label>
              <Textarea
                rows={2}
                value={auditForm.remarks}
                onChange={(e) => setAuditForm({ ...auditForm, remarks: e.target.value })}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAuditModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 text-white text-xs font-semibold gap-1">
                <ShieldCheck className="size-3.5" /> Schedule Audit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QUICK ACTION MODAL C: COMPLAINT ANALYTICS BREAKDOWN */}
      <Dialog open={isComplaintAnalyticsOpen} onOpenChange={setIsComplaintAnalyticsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wrench className="size-4 text-amber-500" /> Resident Complaint SLA & Breakdown
            </DialogTitle>
            <DialogDescription className="text-xs">
              Category-wise resolution metrics and Warden SLA tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 text-xs pt-1">
            <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Plumbing Tickets:</span>
                <span className="font-mono font-bold text-amber-700">35% (18 Tickets)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Electrical Tickets:</span>
                <span className="font-mono font-bold text-blue-700">28% (15 Tickets)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Wi-Fi Network Tickets:</span>
                <span className="font-mono font-bold text-purple-700">22% (12 Tickets)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Furniture & Carpentry:</span>
                <span className="font-mono font-bold text-foreground">15% (8 Tickets)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Resolution SLA Compliance:</span>
                <span className="font-bold text-emerald-600">94.2% within 24 Hours</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsComplaintAnalyticsOpen(false)} className="text-xs">
              Close Breakdown
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: HOSTEL CONFIGURATION & POLICY GOVERNANCE */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="size-5 text-primary" /> Hostel Governance & Policy Configuration
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure hostel rules, fee structures, policies, timings, fine rules, and emergency escalations.
            </DialogDescription>
          </DialogHeader>

          {/* Dialog Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2 pt-1">
            <button
              type="button"
              onClick={() => setConfigTab("fees")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "fees" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              1. Fee & Categories
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("policies")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "policies" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              2. Hostel Policies
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("timings")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "timings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              3. Timings & Fines
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("operations")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "operations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              4. Maintenance & Alerts
            </button>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
            {/* TAB 1: FEES & CATEGORIES */}
            {configTab === "fees" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Hostel Fee Structure & Room Categories</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Single AC Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.singleAc}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, singleAc: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">2-Sharing AC Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.doubleAc}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, doubleAc: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">2-Sharing Non-AC Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.doubleNonAc}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, doubleNonAc: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">3-Sharing Non-AC Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.tripleNonAc}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, tripleNonAc: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: POLICIES */}
            {configTab === "policies" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Hostel Governance Policies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Check-in Policy</Label>
                    <Textarea rows={2} value={configForm.checkInPolicy} onChange={(e) => setConfigForm({ ...configForm, checkInPolicy: e.target.value })} className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Gate Pass Policy</Label>
                    <Textarea rows={2} value={configForm.gatePassPolicy} onChange={(e) => setConfigForm({ ...configForm, gatePassPolicy: e.target.value })} className="text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TIMINGS */}
            {configTab === "timings" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Timings, Mess Rules & Fines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Curfew & Quiet Hours</Label>
                    <Input value={configForm.hostelTimings} onChange={(e) => setConfigForm({ ...configForm, hostelTimings: e.target.value })} className="h-9 text-xs" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Mess Operating Timings</Label>
                    <Input value={configForm.messTimings} onChange={(e) => setConfigForm({ ...configForm, messTimings: e.target.value })} className="h-9 text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OPERATIONS */}
            {configTab === "operations" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Maintenance Schedule & Escalations</h4>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Emergency Contacts & Escalation Matrix</Label>
                  <Input value={configForm.emergencyContacts} onChange={(e) => setConfigForm({ ...configForm, emergencyContacts: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsConfigOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold gap-1.5">
                <CheckCircle2 className="size-3.5" /> Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
