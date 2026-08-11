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
  CreditCard,
  Wallet,
  Bell,
  Settings,
  MessageSquare,
  ClipboardList,
  Send,
  Check,
  Receipt,
  CalendarDays,
  Phone,
  UserPlus,
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

import { useLocation } from "@tanstack/react-router";

export function HostelModuleView() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");

  const [blocks] = useState<HostelBlockInfo[]>(INITIAL_BLOCKS);
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS);
  const [residents, setResidents] = useState<EnhancedResidentStudent[]>(ENHANCED_RESIDENTS);
  const [passes, setPasses] = useState<GatePassRequest[]>(INITIAL_PASSES);
  const [activeTab, setActiveTab] = useState<"blocks" | "residents" | "compliance" | "analytics">("blocks");

  useEffect(() => {
    if (tabFromUrl === "rooms" || tabFromUrl === "blocks") setActiveTab("blocks");
    else if (tabFromUrl === "residents") setActiveTab("residents");
    else if (tabFromUrl === "compliance" || tabFromUrl === "passes") setActiveTab("compliance");
    else if (tabFromUrl === "analytics") setActiveTab("analytics");
  }, [tabFromUrl]);

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

  const loadData = async () => {
    setLoading(true);
    const [rm, res, ps] = await Promise.all([
      fetchHostelRooms(),
      fetchHostelResidents(),
      fetchGatePasses(),
    ]);
    setRooms(rm);
    setLoading(false);
    toast.success("Hostel Executive Governance console synced");
  };

  useEffect(() => {
    loadData();
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

  const handleAddRoomSubmit = async (roomForm: any) => {
    if (!roomForm.roomNo) {
      toast.error("Enter room number");
      return;
    }
    const created = await createHostelRoom(roomForm);
    setRooms((prev) => [created, ...prev]);
    setIsAddRoomOpen(false);
    toast.success(`Hostel room ${created.roomNo} created in ${created.block}!`);
  };

  const handleApprovePass = async (id: string, name: string) => {
    await updateGatePassStatus(id, "Approved");
    setPasses((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p)));
    toast.success(`Gate Pass ${id} approved for ${name}!`);
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

export function HostelAttendanceView() {
  const [residents, setResidents] = useState<ResidentStudent[]>(INITIAL_RESIDENTS);
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string>("All Blocks");
  const [selectedRoom, setSelectedRoom] = useState<string>("All Rooms");
  const [attendanceDate, setAttendanceDate] = useState<string>("2026-08-03");

  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent" | "On Leave">>({
    "1": "Present",
    "2": "Present",
  });

  const handleMarkAttendance = (id: string, status: "Present" | "Absent" | "On Leave", name: string) => {
    setAttendanceState((prev) => ({ ...prev, [id]: status }));
    toast.success(`Marked ${name} as ${status}`);
  };

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = selectedBlock === "All Blocks" || r.block === selectedBlock;
    const matchesRoom = selectedRoom === "All Rooms" || r.roomNo === selectedRoom;
    return matchesSearch && matchesBlock && matchesRoom;
  });

  const totalCount = filteredResidents.length;
  const presentCount = filteredResidents.filter((r) => (attendanceState[r.id] || "Present") === "Present").length;
  const absentCount = filteredResidents.filter((r) => attendanceState[r.id] === "Absent").length;
  const leaveCount = filteredResidents.filter((r) => attendanceState[r.id] === "On Leave").length;
  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span>Dashboard</span>
          <span>/</span>
          <span>Hostel</span>
          <span>/</span>
          <span className="font-bold text-foreground">Attendance</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-foreground">
          Hostel Daily Attendance
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Mark and monitor student presence in the hostel blocks.
        </p>
      </div>

      {/* 5 Summary KPI Cards - Exact Image 1 Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-foreground">{totalCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Total Residents</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-emerald-600">{presentCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Present Today</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-600">
            <XCircle className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-rose-600">{absentCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Absent Today</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-amber-600">{leaveCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">On Leave</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <RefreshCw className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-indigo-600">{rate}%</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-3 rounded-2xl bg-card border border-border/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="h-9 w-36 rounded-xl text-xs font-mono bg-background"
            />
          </div>

          <Select value={selectedBlock} onValueChange={setSelectedBlock}>
            <SelectTrigger className="h-9 w-40 rounded-xl text-xs bg-background">
              <Filter className="size-3.5 mr-1.5 opacity-60" />
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Blocks">All Blocks</SelectItem>
              <SelectItem value="Block A (Boys)">Block A (Boys)</SelectItem>
              <SelectItem value="Block B (Girls)">Block B (Girls)</SelectItem>
              <SelectItem value="Block C (PG Scholars)">Block C (PG Scholars)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="h-9 w-36 rounded-xl text-xs bg-background">
              <Filter className="size-3.5 mr-1.5 opacity-60" />
              <SelectValue placeholder="All Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Rooms">All Rooms</SelectItem>
              <SelectItem value="A-201">A-201</SelectItem>
              <SelectItem value="A-202">A-202</SelectItem>
              <SelectItem value="B-105">B-105</SelectItem>
              <SelectItem value="B-106">B-106</SelectItem>
              <SelectItem value="C-301">C-301</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-full pl-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* Main Content Register Table or Empty State (Exact Image 1) */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs min-h-[320px] flex flex-col justify-center">
        {filteredResidents.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="grid size-14 place-items-center rounded-full bg-muted/60 text-muted-foreground mx-auto">
              <Users className="size-7" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No residents found matching active filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Resident Student</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Block & Room</th>
                  <th className="py-3 px-3">Attendance Status</th>
                  <th className="py-3 px-3 text-right pr-4">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredResidents.map((res) => {
                  const currentStatus = attendanceState[res.id] || "Present";
                  return (
                    <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-foreground">{res.name}</div>
                        <div className="text-[0.68rem] text-muted-foreground font-mono">{res.emergencyContact}</div>
                      </td>
                      <td className="py-3.5 px-3">{res.department}</td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-primary">
                        {res.block} ({res.roomNo})
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          className={
                            currentStatus === "Present"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : currentStatus === "Absent"
                              ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                              : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          }
                        >
                          {currentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant={currentStatus === "Present" ? "default" : "outline"}
                            onClick={() => handleMarkAttendance(res.id, "Present", res.name)}
                            className={`h-7 px-2 text-[0.68rem] rounded-lg gap-1 ${
                              currentStatus === "Present" ? "bg-emerald-600 text-white" : ""
                            }`}
                          >
                            <UserCheck className="size-3" /> Present
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === "Absent" ? "destructive" : "outline"}
                            onClick={() => handleMarkAttendance(res.id, "Absent", res.name)}
                            className="h-7 px-2 text-[0.68rem] rounded-lg gap-1"
                          >
                            <UserX className="size-3" /> Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === "On Leave" ? "secondary" : "outline"}
                            onClick={() => handleMarkAttendance(res.id, "On Leave", res.name)}
                            className="h-7 px-2 text-[0.68rem] rounded-lg gap-1"
                          >
                            <Clock className="size-3" /> Leave
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 2. VISITORS VIEW                                                            */
/* ========================================================================== */
export function HostelVisitorsView() {
  const [visitors, setVisitors] = useState([
    { id: "VIS-901", visitorName: "Ramesh Sharma", studentName: "Rohan Sharma", rollNo: "22CS101", relation: "Father", roomNo: "A-201", block: "Block A", inTime: "10:15 AM", outTime: "--", status: "Active" },
    { id: "VIS-902", visitorName: "Sunita Verma", studentName: "Ananya Verma", rollNo: "22EC014", relation: "Mother", roomNo: "B-105", block: "Block B", inTime: "11:30 AM", outTime: "01:45 PM", status: "Checked Out" },
    { id: "VIS-903", visitorName: "Vikram Malhotra", studentName: "Kabir Malhotra", rollNo: "22ME088", relation: "Brother", roomNo: "A-202", block: "Block A", inTime: "09:00 AM", outTime: "--", status: "Overstay" },
  ]);

  const [search, setSearch] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [form, setForm] = useState({ visitorName: "", studentName: "", rollNo: "", relation: "Father", roomNo: "A-201" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.visitorName || !form.studentName) {
      toast.error("Please fill visitor & student name");
      return;
    }
    const newVis = {
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      visitorName: form.visitorName,
      studentName: form.studentName,
      rollNo: form.rollNo || "22CS101",
      relation: form.relation,
      roomNo: form.roomNo,
      block: form.roomNo.startsWith("B") ? "Block B" : "Block A",
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outTime: "--",
      status: "Active",
    };
    setVisitors([newVis, ...visitors]);
    setIsRegisterOpen(false);
    toast.success(`Registered visitor entry for ${form.visitorName}!`);
  };

  const handleCheckout = (id: string, name: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: "Checked Out", outTime: timeStr } : v));
    toast.success(`Checked out ${name} at ${timeStr}`);
  };

  const filtered = visitors.filter(v => v.visitorName.toLowerCase().includes(search.toLowerCase()) || v.studentName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Visitors</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Visitor Register</h1>
          <p className="text-xs text-muted-foreground">Track visitor check-ins, parent passes, and identity verification logs.</p>
        </div>
        <Button onClick={() => setIsRegisterOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <UserPlus className="size-4" /> Register Visitor
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Today</p>
          <p className="text-2xl font-bold font-mono text-foreground">{visitors.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Currently Inside</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">{visitors.filter(v => v.status === "Active").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Checked Out</p>
          <p className="text-2xl font-bold font-mono text-blue-600">{visitors.filter(v => v.status === "Checked Out").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Overstay Alerts</p>
          <p className="text-2xl font-bold font-mono text-rose-600">{visitors.filter(v => v.status === "Overstay").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-foreground">Visitor Log Ledger</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search visitor or student..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs rounded-full bg-background" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Pass ID</th>
                <th className="py-3 px-3">Visitor Name</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Relation</th>
                <th className="py-3 px-3">Room & Block</th>
                <th className="py-3 px-3">Check In</th>
                <th className="py-3 px-3">Check Out</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{v.id}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{v.visitorName}</td>
                  <td className="py-3 px-3 font-semibold text-primary">{v.studentName} ({v.rollNo})</td>
                  <td className="py-3 px-3">{v.relation}</td>
                  <td className="py-3 px-3 font-mono">{v.block} - {v.roomNo}</td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{v.inTime}</td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{v.outTime}</td>
                  <td className="py-3 px-3">
                    <Badge className={v.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : v.status === "Overstay" ? "bg-rose-500/10 text-rose-600" : "bg-muted text-muted-foreground"}>
                      {v.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {v.status !== "Checked Out" && (
                      <Button size="sm" onClick={() => handleCheckout(v.id, v.visitorName)} className="h-7 text-[0.68rem] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                        Check Out
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Register Visitor Check-In</DialogTitle></DialogHeader>
          <form onSubmit={handleRegister} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Visitor Name *</Label><Input required placeholder="e.g. Ramesh Sharma" value={form.visitorName} onChange={e => setForm({ ...form, visitorName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Hostel Inmate / Student Name *</Label><Input required placeholder="e.g. Rohan Sharma" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs font-semibold">Roll No</Label><Input placeholder="22CS101" value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} className="h-9 text-xs font-mono" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Room No</Label><Input placeholder="A-201" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })} className="h-9 text-xs font-mono" /></div>
            </div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Register Entry</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 3. COMPLAINTS VIEW                                                          */
/* ========================================================================== */
export function HostelComplaintsView() {
  const [complaints, setComplaints] = useState([
    { id: "TKT-401", studentName: "Meka Tarun", roomNo: "A-201", block: "Block A", category: "Plumbing", description: "Leaking tap in bathroom 201", priority: "High", date: "2026-08-02", status: "Open" },
    { id: "TKT-402", studentName: "Ananya Verma", roomNo: "B-105", block: "Block B", category: "Electrical", description: "Ceiling fan speed regulator broken", priority: "Medium", date: "2026-08-01", status: "In Progress" },
    { id: "TKT-403", studentName: "Siddharth Rao", roomNo: "C-301", block: "Block C", category: "Wi-Fi / Internet", description: "No signal in room C-301 corridor", priority: "Low", date: "2026-07-30", status: "Resolved" },
  ]);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [form, setForm] = useState({ studentName: "", roomNo: "A-201", category: "Plumbing", description: "", priority: "Medium" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description) {
      toast.error("Please enter complaint description");
      return;
    }
    const tkt = {
      id: `TKT-${Math.floor(400 + Math.random() * 500)}`,
      studentName: form.studentName || "Inmate Scholar",
      roomNo: form.roomNo,
      block: form.roomNo.startsWith("B") ? "Block B" : "Block A",
      category: form.category,
      description: form.description,
      priority: form.priority,
      date: new Date().toISOString().split("T")[0] || "",
      status: "Open",
    };
    setComplaints([tkt, ...complaints]);
    setIsNewOpen(false);
    toast.success(`Complaint ${tkt.id} submitted to maintenance desk!`);
  };

  const handleResolve = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
    toast.success(`Ticket ${id} marked as resolved!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Complaints</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Complaints & Maintenance Desk</h1>
          <p className="text-xs text-muted-foreground">Manage student maintenance tickets, plumbing/electrical requests, and grievance desk.</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <Plus className="size-4" /> Lodge Complaint
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Open Tickets</p>
          <p className="text-2xl font-bold font-mono text-rose-600">{complaints.filter(c => c.status === "Open").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">In Progress</p>
          <p className="text-2xl font-bold font-mono text-amber-600">{complaints.filter(c => c.status === "In Progress").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Resolved</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">{complaints.filter(c => c.status === "Resolved").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Avg Resolution Time</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">4.2 Hrs</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <h3 className="font-bold text-sm text-foreground">Maintenance Requests Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Room & Block</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Issue Description</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{c.id}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{c.studentName}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-primary">{c.block} ({c.roomNo})</td>
                  <td className="py-3 px-3 font-medium">{c.category}</td>
                  <td className="py-3 px-3 max-w-xs truncate text-muted-foreground">{c.description}</td>
                  <td className="py-3 px-3">
                    <Badge className={c.priority === "High" ? "bg-rose-500/10 text-rose-600" : c.priority === "Medium" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}>
                      {c.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={c.status === "Open" ? "bg-rose-500/10 text-rose-600" : c.status === "In Progress" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {c.status !== "Resolved" && (
                      <Button size="sm" onClick={() => handleResolve(c.id)} className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1">
                        <Check className="size-3" /> Mark Resolved
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Lodge Maintenance Complaint</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Meka Tarun" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs font-semibold">Room No</Label><Input placeholder="A-201" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })} className="h-9 text-xs font-mono" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Category</Label>
                <Select value={form.category} onValueChange={val => setForm({ ...form, category: val })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Wi-Fi / Internet">Wi-Fi / Internet</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Issue Description *</Label><Input required placeholder="Brief detail of issue..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsNewOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Submit Complaint</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 4. MESS MENUS VIEW                                                         */
/* ========================================================================== */
export function HostelMessMenusView() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const weeklyMenus: Record<string, { breakfast: string; lunch: string; snacks: string; dinner: string }> = {
    Monday: { breakfast: "Idli, Sambar, Coconut Chutney, Bread & Jam, Tea/Coffee", lunch: "Steamed Rice, Dal Tadka, Paneer Butter Masala, Chapati, Curd, Salad", snacks: "Vegetable Samosa, Mint Chutney, Tea/Coffee", dinner: "Veg Biryani, Mirchi Ka Salan, Phulka, Raitha, Gulab Jamun" },
    Tuesday: { breakfast: "Masala Dosa, Potato Masala, Sambar, Chutney, Tea/Coffee", lunch: "Jeera Rice, Chana Masala, Mixed Veg Curry, Roti, Butter Milk", snacks: "Banana Chips, Milk / Tea", dinner: "Kadai Paneer / Egg Curry, Steamed Rice, Chapati, Kheer" },
    Wednesday: { breakfast: "Puri Bhaji, Sprouted Moong Salad, Tea/Coffee", lunch: "Lemon Rice, Tomato Pappu, Aloo Gobi Fry, Curd Rice, Papad", snacks: "Pav Bhaji, Hot Tea", dinner: "Butter Naan, Malai Kofta / Chicken Curry, Jeera Rice, Ice Cream" },
    Thursday: { breakfast: "Upma, Kesari Bath, Peanut Chutney, Tea/Coffee", lunch: "Plain Rice, Palak Dal, Bhindi Fry, Sambar, Curd, Salad", snacks: "Corn Flakes / Biscuits, Tea", dinner: "Veg Pulao, Paneer Tikka Masala, Phulka, Moong Dal Halwa" },
    Friday: { breakfast: "Poha, Sev, Fried Green Chilies, Tea/Coffee", lunch: "Rajma Chawal, Chapati, Mix Veg Poriyal, Rasam, Curd", snacks: "Pakora, Green Chutney, Tea", dinner: "Special South Indian Thali / Chicken Biryani, Rasgulla" },
    Saturday: { breakfast: "Aloo Paratha, Curd, Pickle, Butter, Tea/Coffee", lunch: "Veg Fried Rice, Manchurian Gravy, Veg Noodles, Soup", snacks: "French Fries, Ketchup, Coffee", dinner: "Paneer Lababdar, Chapati, Steamed Rice, Dal Makhani, Jalebi" },
    Sunday: { breakfast: "Masala Utappam, Sambar, Coconut & Tomato Chutney", lunch: "Special Dum Biryani (Veg/Non-Veg), Raitha, Salan, Ice Cream", snacks: "Cake Slice, Hot Chocolate / Milk", dinner: "Phulka, Mushroom Masala, Curd Rice, Fruit Salad" },
  };

  const menu = (weeklyMenus[selectedDay] || weeklyMenus["Monday"])!;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Mess Menus</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Mess Timetable & Food Menus</h1>
          <p className="text-xs text-muted-foreground">Weekly nutrition schedule, meal timings, special diet requests, and food ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Daily Meals Served</p>
          <p className="text-2xl font-bold font-mono text-foreground">3,174</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Food Rating</p>
          <p className="text-2xl font-bold font-mono text-amber-500">4.8 ★</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Special Diets Active</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">14</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Veg / Non-Veg Ratio</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">70 / 30</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
          <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedDay === day ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-2">
              <Utensils className="size-4" /> Breakfast (07:30 AM - 09:00 AM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Veg</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.breakfast}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2">
              <Utensils className="size-4" /> Lunch (12:30 PM - 02:00 PM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Veg & Salad</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.lunch}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2">
              <Utensils className="size-4" /> Evening Snacks (05:00 PM - 06:00 PM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Tea/Coffee</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.snacks}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] font-mono uppercase text-purple-600 font-bold flex items-center gap-2">
              <Utensils className="size-4" /> Dinner (07:30 PM - 09:00 PM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Special Dessert</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.dinner}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 5. MESS FEES VIEW                                                          */
/* ========================================================================== */
export function HostelMessFeesView() {
  const [ledger, setLedger] = useState([
    { rollNo: "22CS101", studentName: "Meka Tarun", roomNo: "A-201", month: "August 2026", tariff: 3500, rebateDays: 4, rebateAmount: 466, netPayable: 3034, status: "Paid" },
    { rollNo: "22EC014", studentName: "Ananya Verma", roomNo: "B-105", month: "August 2026", tariff: 3500, rebateDays: 0, rebateAmount: 0, netPayable: 3500, status: "Pending" },
    { rollNo: "22ME088", studentName: "Kabir Malhotra", roomNo: "A-202", month: "August 2026", tariff: 3500, rebateDays: 2, rebateAmount: 233, netPayable: 3267, status: "Paid" },
  ]);

  const [isRebateOpen, setIsRebateOpen] = useState(false);
  const [rebateForm, setRebateForm] = useState({ rollNo: "22CS101", days: 3, reason: "Academic Outstation Duty" });

  const handleApplyRebate = (e: React.FormEvent) => {
    e.preventDefault();
    const rebateVal = Math.round((Number(rebateForm.days) * 3500) / 30);
    setLedger(prev => prev.map(item => item.rollNo === rebateForm.rollNo ? {
      ...item,
      rebateDays: item.rebateDays + Number(rebateForm.days),
      rebateAmount: item.rebateAmount + rebateVal,
      netPayable: Math.max(0, item.netPayable - rebateVal)
    } : item));
    setIsRebateOpen(false);
    toast.success(`Applied ${rebateForm.days} days mess rebate credit (₹${rebateVal})!`);
  };

  const handlePay = (rollNo: string, name: string) => {
    setLedger(prev => prev.map(l => l.rollNo === rollNo ? { ...l, status: "Paid" } : l));
    toast.success(`Collected mess fee payment for ${name}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Mess Fees</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Mess Fee Billing & Rebates</h1>
          <p className="text-xs text-muted-foreground">Monthly mess billing, absence rebate credits, and payment clearance ledger.</p>
        </div>
        <Button onClick={() => setIsRebateOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <Plus className="size-4" /> Apply Mess Rebate
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Monthly Tariff</p>
          <p className="text-2xl font-bold font-mono text-foreground">₹ 3,500</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Mess Dues</p>
          <p className="text-2xl font-bold font-mono text-rose-600">₹ 1.8L</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Approved Rebate Days</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">32 Days</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Cleared Inmates</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">982</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <h3 className="font-bold text-sm text-foreground">Monthly Mess Tariff Ledger (August 2026)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Monthly Tariff</th>
                <th className="py-3 px-3">Rebate Days</th>
                <th className="py-3 px-3">Rebate Credit</th>
                <th className="py-3 px-3">Net Payable</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ledger.map(l => (
                <tr key={l.rollNo} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{l.rollNo}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{l.studentName}</td>
                  <td className="py-3 px-3 font-mono text-primary font-semibold">{l.roomNo}</td>
                  <td className="py-3 px-3 font-mono">₹{l.tariff}</td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600">{l.rebateDays} Days</td>
                  <td className="py-3 px-3 font-mono text-emerald-600">- ₹{l.rebateAmount}</td>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">₹{l.netPayable}</td>
                  <td className="py-3 px-3">
                    <Badge className={l.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {l.status === "Pending" && (
                      <Button size="sm" onClick={() => handlePay(l.rollNo, l.studentName)} className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                        Collect Fee
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isRebateOpen} onOpenChange={setIsRebateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Apply Mess Absence Rebate</DialogTitle></DialogHeader>
          <form onSubmit={handleApplyRebate} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Select Student Roll No *</Label>
              <Select value={rebateForm.rollNo} onValueChange={val => setRebateForm({ ...rebateForm, rollNo: val })}>
                <SelectTrigger className="h-9 text-xs font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="22CS101">22CS101 (Meka Tarun)</SelectItem>
                  <SelectItem value="22EC014">22EC014 (Ananya Verma)</SelectItem>
                  <SelectItem value="22ME088">22ME088 (Kabir Malhotra)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Absence Days *</Label><Input type="number" min="1" max="15" value={rebateForm.days} onChange={e => setRebateForm({ ...rebateForm, days: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Rebate Reason *</Label><Input placeholder="Academic Outstation Duty / Medical Leave" value={rebateForm.reason} onChange={e => setRebateForm({ ...rebateForm, reason: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsRebateOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Apply Credit</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 6. RESIDENTS VIEW                                                          */
/* ========================================================================== */
export function HostelResidentsView() {
  const [residents, setResidents] = useState<ResidentStudent[]>(INITIAL_RESIDENTS);
  const [search, setSearch] = useState("");

  const filtered = residents.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Residents</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Resident Scholars Roster</h1>
          <p className="text-xs text-muted-foreground">Complete directory of active hostel scholars, room allotments, and emergency contacts.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Inmates</p>
          <p className="text-2xl font-bold font-mono text-foreground">850</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Boys Hostel</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">480</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Girls Hostel</p>
          <p className="text-2xl font-bold font-mono text-purple-600">320</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">PG Scholars</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">50</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-foreground">Active Resident Scholars</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or roll..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs rounded-full bg-background" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Resident Name</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Block & Room</th>
                <th className="py-3 px-3">Hostel Fee Status</th>
                <th className="py-3 px-3">Emergency Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                  <td className="py-3 px-3 font-semibold text-foreground">{res.name}</td>
                  <td className="py-3 px-3">{res.department}</td>
                  <td className="py-3 px-3 font-mono text-primary font-bold">{res.block} ({res.roomNo})</td>
                  <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{res.feeStatus}</Badge></td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{res.emergencyContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 7. FEES VIEW                                                               */
/* ========================================================================== */
export function HostelFeesView() {
  const [records, setRecords] = useState([
    { rollNo: "22CS101", studentName: "Meka Tarun", roomNo: "A-201", block: "Block A", totalFee: 95000, paid: 95000, balance: 0, status: "Fully Paid" },
    { rollNo: "22EC014", studentName: "Ananya Verma", roomNo: "B-105", block: "Block B", totalFee: 95000, paid: 50000, balance: 45000, status: "Partially Paid" },
    { rollNo: "22ME088", studentName: "Kabir Malhotra", roomNo: "A-202", block: "Block A", totalFee: 75000, paid: 75000, balance: 0, status: "Fully Paid" },
  ]);

  const handlePayBalance = (rollNo: string, name: string) => {
    setRecords(prev => prev.map(r => r.rollNo === rollNo ? { ...r, paid: r.totalFee, balance: 0, status: "Fully Paid" } : r));
    toast.success(`Recorded full fee clearance for ${name}!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Fees</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Annual Fee Collection Ledger</h1>
          <p className="text-xs text-muted-foreground">Annual room tariff collection, installment tracking, and balance dues ledger.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Collection</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">₹ 48.5L</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Pending Dues</p>
          <p className="text-2xl font-bold font-mono text-rose-600">₹ 6.2L</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Clearance Rate</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">88.6%</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Defaulters Count</p>
          <p className="text-2xl font-bold font-mono text-amber-600">14 Inmates</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <h3 className="font-bold text-sm text-foreground">Annual Fee Allocation Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Block & Room</th>
                <th className="py-3 px-3">Annual Tariff</th>
                <th className="py-3 px-3">Amount Paid</th>
                <th className="py-3 px-3">Balance Dues</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {records.map(r => (
                <tr key={r.rollNo} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{r.rollNo}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{r.studentName}</td>
                  <td className="py-3 px-3 font-mono text-primary font-semibold">{r.block} ({r.roomNo})</td>
                  <td className="py-3 px-3 font-mono font-bold">₹{r.totalFee.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 font-bold">₹{r.paid.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-rose-600 font-bold">₹{r.balance.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <Badge className={r.status === "Fully Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {r.balance > 0 && (
                      <Button size="sm" onClick={() => handlePayBalance(r.rollNo, r.studentName)} className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                        Record Payment
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 8. NOTIFICATIONS VIEW                                                     */
/* ========================================================================== */
export function HostelNotificationsView() {
  const [circulars, setCirculars] = useState([
    { id: "CIR-101", title: "Night Curfew Timing Strict Enforcement", audience: "All Hostel Inmates", date: "2026-08-01", priority: "High", content: "All resident scholars must check into their respective blocks by 09:30 PM sharp." },
    { id: "CIR-102", title: "Mess Special Sunday Dinner Schedule", audience: "All Hostel Inmates", date: "2026-07-28", priority: "Normal", content: "Special Dum Biryani will be served this Sunday between 07:30 PM to 09:30 PM." },
  ]);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [form, setForm] = useState({ title: "", audience: "All Hostel Inmates", content: "" });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Please enter notice title & content");
      return;
    }
    const cir = {
      id: `CIR-${Math.floor(100 + Math.random() * 900)}`,
      title: form.title,
      audience: form.audience,
      date: new Date().toISOString().split("T")[0] || "",
      priority: "Normal",
      content: form.content,
    };
    setCirculars([cir, ...circulars]);
    setIsPostOpen(false);
    toast.success("Broadcasted warden circular to all inmates!");
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Notifications</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Notices & Broadcast Center</h1>
          <p className="text-xs text-muted-foreground">Emergency alerts, warden circulars, and SMS broadcast logs.</p>
        </div>
        <Button onClick={() => setIsPostOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <Send className="size-4" /> Post Warden Notice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {circulars.map(c => (
          <div key={c.id} className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{c.id}</span>
              <Badge variant="outline" className="text-[0.65rem]">{c.date}</Badge>
            </div>
            <h3 className="font-bold text-base text-foreground">{c.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.content}</p>
            <div className="pt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground border-t border-border/40">
              <span>Audience: <b>{c.audience}</b></span>
              <Badge className="bg-purple-500/10 text-purple-600">Active Notice</Badge>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Post Warden Circular</DialogTitle></DialogHeader>
          <form onSubmit={handlePost} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Notice Title *</Label><Input required placeholder="e.g. Mess Maintenance Notice" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Audience</Label>
              <Select value={form.audience} onValueChange={val => setForm({ ...form, audience: val })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Hostel Inmates">All Hostel Inmates</SelectItem>
                  <SelectItem value="Block A (Boys)">Block A (Boys)</SelectItem>
                  <SelectItem value="Block B (Girls)">Block B (Girls)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Notice Content *</Label><Input required placeholder="Detailed message..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsPostOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Post Notice</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 9. SETTINGS VIEW                                                         */
/* ========================================================================== */
export function HostelSettingsView() {
  const [curfewTime, setCurfewTime] = useState("09:30 PM");

  const handleSave = () => {
    toast.success("Hostel curfew & operational settings saved!");
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel System Settings</h1>
          <p className="text-xs text-muted-foreground">Configure warden profiles, gate curfew rules, mess operational hours, and room policies.</p>
        </div>
        <Button onClick={handleSave} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Curfew & Gate Timings
          </h3>
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weekday Night Curfew</Label>
              <Input value={curfewTime} onChange={e => setCurfewTime(e.target.value)} className="h-9 text-xs font-mono" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weekend Night Curfew</Label>
              <Input defaultValue="10:30 PM" className="h-9 text-xs font-mono" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Utensils className="size-4 text-emerald-600" /> Mess Timings Configuration
          </h3>
          <div className="space-y-2 pt-1 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border/40"><span>Breakfast:</span><span className="font-mono font-bold text-foreground">07:30 AM - 09:00 AM</span></div>
            <div className="flex justify-between py-1 border-b border-border/40"><span>Lunch:</span><span className="font-mono font-bold text-foreground">12:30 PM - 02:00 PM</span></div>
            <div className="flex justify-between py-1 border-b border-border/40"><span>Evening Snacks:</span><span className="font-mono font-bold text-foreground">05:00 PM - 06:00 PM</span></div>
            <div className="flex justify-between py-1 border-b border-border/40"><span>Dinner:</span><span className="font-mono font-bold text-foreground">07:30 PM - 09:00 PM</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-route view aliases rendering the central HostelModuleView
export const HostelBlocksView = HostelModuleView;
export const HostelDeviceManagementView = HostelModuleView;
export const HostelGuestBillingView = HostelModuleView;
export const HostelLeavesSuspensionView = HostelModuleView;
export const HostelLogHistoryView = HostelModuleView;
export const HostelMaintenanceView = HostelModuleView;
export const HostelMessManagementView = HostelModuleView;
export const HostelOutingApprovalsView = HostelModuleView;
export const HostelOutingLogHistoryView = HostelModuleView;
export const HostelRoomsView = HostelModuleView;
export const HostelUserManagementView = HostelModuleView;
