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
  Search,
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
  const [activeTab, setActiveTab] = useState<"blocks" | "residents" | "compliance" | "analytics">("blocks");

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

  // Governance Telemetry
  const [healthStatus] = useState<HostelHealthStatus>(DEFAULT_HOSTEL_HEALTH);
  const [maintenanceSummary] = useState<MaintenanceSummary>(DEFAULT_MAINTENANCE_SUMMARY);
  const [alerts] = useState<HostelAlert[]>(INITIAL_ALERTS);
  const [activities] = useState<HostelActivityLog[]>(INITIAL_ACTIVITIES);
  const [staffSummary] = useState<HostelStaffSummary>(DEFAULT_STAFF_SUMMARY);
  const [compliance] = useState<PolicyComplianceStatus>(DEFAULT_POLICY_COMPLIANCE);
  const [securityMetrics] = useState<GatePassSecurityMetrics>(DEFAULT_SECURITY_METRICS);
  const [complaintCompliance] = useState<ComplaintComplianceSummary>(DEFAULT_COMPLAINT_COMPLIANCE);
  const [analytics] = useState<ExecutiveHostelAnalyticsData>(DEFAULT_ANALYTICS);

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
    toast.success("Exported block inventory report to CSV!");
  };

  const handleExportPDF = () => {
    toast.success("Hostel Analytics Executive Report (PDF) compiled and downloaded.");
  };

  const handleExportExcel = () => {
    toast.success("Hostel Analytics Master Ledger (Excel) generated.");
  };

  const handleScheduleAudit = () => {
    toast.info("Hostel Audit inspection scheduled for Monday 10:00 AM.");
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
                Hostel & Resident Welfare Governance
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Executive Console
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Executive monitoring of occupancy, infrastructure health, compliance, resident roster, and analytics.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Ledger
          </Button>
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Sliders className="size-4" /> Hostel Configuration
          </Button>
        </div>
      </div>

      {/* TOP KPI CARDS - PRIMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Hostel Capacity</span>
            <Building className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">1,000 Beds</p>
          <p className="text-[0.68rem] text-muted-foreground">Blocks A (Boys), B (Girls) & C (PG)</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Active Residents</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">944 Occupied</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">94.4% Overall Occupancy Rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Available Vacancies</span>
            <Bed className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">56 Vacant Beds</p>
          <p className="text-[0.68rem] text-muted-foreground">Ready for admission allotment</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Annual Revenue</span>
            <PieChart className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">₹8.78 Cr</p>
          <p className="text-[0.68rem] text-muted-foreground">98.2% Fee Collection Realized</p>
        </div>
      </div>

      {/* EXECUTIVE TABS SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button onClick={() => setActiveTab("blocks")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "blocks" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Room Inventory & Block Overview ({blocks.length} Blocks)
        </button>
        <button onClick={() => setActiveTab("residents")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "residents" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Resident Roster ({residents.length})
        </button>
        <button onClick={() => setActiveTab("compliance")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "compliance" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Compliance, Security & Gate Pass Monitoring
        </button>
        <button onClick={() => setActiveTab("analytics")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "analytics" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          4. Hostel Analytics & Reports
        </button>
      </div>

      {/* TAB 1: ROOM INVENTORY & BLOCK OVERVIEW */}
      {activeTab === "blocks" && (
        <div className="space-y-4">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Hostel Blocks</span>
              <span className="text-lg font-bold font-mono text-foreground">3 Blocks</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Total Capacity</span>
              <span className="text-lg font-bold font-mono text-primary">1,000 Beds</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Occupied Rooms</span>
              <span className="text-lg font-bold font-mono text-emerald-600">944 Beds</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Vacant Rooms</span>
              <span className="text-lg font-bold font-mono text-blue-600">56 Beds</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Under Repair</span>
              <span className="text-lg font-bold font-mono text-amber-600">1 Room (C-304)</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Overall Occupancy</span>
              <span className="text-lg font-bold font-mono text-primary">94.4%</span>
            </div>
          </div>

          {/* BLOCK HEALTH SECTION */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Activity className="size-4 text-emerald-500" /> Block Facilities Infrastructure & Health Status
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-xs">
                Overall Score: {healthStatus.overallHealthScore} / 100
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <Zap className="size-3 text-amber-500" /> Electricity
                </span>
                <p className="text-xs font-bold text-foreground">100% Operational</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <Droplet className="size-3 text-blue-500" /> Water Supply
                </span>
                <p className="text-xs font-bold text-foreground">98% Tank Normal</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <Wifi className="size-3 text-primary" /> Internet Wi-Fi
                </span>
                <p className="text-xs font-bold text-foreground">1 Gbps Active</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <Video className="size-3 text-purple-500" /> CCTV Surveillance
                </span>
                <p className="text-xs font-bold text-foreground">128/128 Active</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-500" /> Fire Safety
                </span>
                <p className="text-xs font-bold text-emerald-600">Compliant</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <Wrench className="size-3 text-orange-500" /> Housekeeping
                </span>
                <p className="text-xs font-bold text-foreground">Grade A Clean</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-[0.68rem] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <HeartPulse className="size-3 text-primary" /> Health Score
                </span>
                <p className="text-xs font-bold text-primary font-mono">96% Optimal</p>
              </div>
            </div>
          </div>

          {/* ROOM INVENTORY & BLOCK OVERVIEW TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Building className="size-4 text-primary" /> Hostel Block Inventory Overview
              </h3>
              <span className="text-xs text-muted-foreground">Executive Monitoring View</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Hostel Block</th>
                    <th className="py-3 px-3">Capacity</th>
                    <th className="py-3 px-3">Occupied</th>
                    <th className="py-3 px-3">Vacant</th>
                    <th className="py-3 px-3">Under Repair</th>
                    <th className="py-3 px-3">Occupancy %</th>
                    <th className="py-3 px-3">Annual Revenue</th>
                    <th className="py-3 px-3">Current Warden</th>
                    <th className="py-3 px-3">Maintenance Due</th>
                    <th className="py-3 px-3">Inspection Date</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {blocks.map((blk) => (
                    <tr key={blk.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{blk.name}</td>
                      <td className="py-3 px-3 font-mono font-bold">{blk.capacity} Beds</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{blk.occupiedRooms}</td>
                      <td className="py-3 px-3 font-mono text-blue-600 font-bold">{blk.vacantRooms}</td>
                      <td className="py-3 px-3 font-mono text-amber-600 font-bold">{blk.underMaintenance}</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary">{blk.occupancyPercentage}%</td>
                      <td className="py-3 px-3 font-mono font-bold text-foreground">₹{(blk.annualRevenue / 10000000).toFixed(2)} Cr</td>
                      <td className="py-3 px-3 font-medium text-foreground">{blk.currentWarden}</td>
                      <td className="py-3 px-3 text-muted-foreground">{blk.maintenanceDue}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{blk.inspectionDate}</td>
                      <td className="py-3 px-3">
                        <Badge className={blk.quickStatusBadge === "Healthy" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                          {blk.quickStatusBadge}
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

      {/* TAB 2: RESIDENT ROSTER */}
      {activeTab === "residents" && (
        <div className="space-y-4">
          {/* RESIDENT ANALYTICS SUMMARY CARDS */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Total Residents</span>
              <span className="text-base font-bold font-mono text-primary">850</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Boys Hostel</span>
              <span className="text-base font-bold font-mono text-blue-600">433</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Girls Hostel</span>
              <span className="text-base font-bold font-mono text-emerald-600">379</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">PG Scholars</span>
              <span className="text-base font-bold font-mono text-purple-600">38</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">International</span>
              <span className="text-base font-bold font-mono text-indigo-600">12</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Scholarship</span>
              <span className="text-base font-bold font-mono text-emerald-600">420</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Pending Fees</span>
              <span className="text-base font-bold font-mono text-amber-600">18</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">On Leave</span>
              <span className="text-base font-bold font-mono text-primary">14</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block">Medical Cases</span>
              <span className="text-base font-bold font-mono text-destructive">3</span>
            </div>
          </div>

          {/* QUICK FILTERS BAR */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Filter className="size-3.5 text-primary" /> Resident Roster Quick Filters & Telemetry Search
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResidentSearch("");
                  setFilterDept("All");
                  setFilterYear("All");
                  setFilterBlock("All");
                  setFilterStatus("All");
                  setFilterFee("All");
                  setFilterMedicalOnly(false);
                }}
                className="h-7 text-[0.68rem] text-muted-foreground"
              >
                Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search resident..."
                  value={residentSearch}
                  onChange={(e) => setResidentSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
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

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
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
        <div className="space-y-4">
          {/* GATE PASS & SECURITY KPI STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Passes Today</span>
              <span className="text-lg font-bold font-mono text-primary">{securityMetrics.requestsToday}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Approved</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{securityMetrics.approved}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Rejected</span>
              <span className="text-lg font-bold font-mono text-destructive">{securityMetrics.rejected}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Pending</span>
              <span className="text-lg font-bold font-mono text-amber-600">{securityMetrics.pending}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Avg Approval Time</span>
              <span className="text-lg font-bold font-mono text-foreground">{securityMetrics.avgApprovalTime}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Incidents</span>
              <span className="text-lg font-bold font-mono text-emerald-600">{securityMetrics.securityIncidents}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Late Curfew Entries</span>
              <span className="text-lg font-bold font-mono text-amber-600">{securityMetrics.lateEntries}</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Visitors Logged</span>
              <span className="text-lg font-bold font-mono text-primary">{securityMetrics.visitorRecords}</span>
            </div>
          </div>

          {/* COMPLAINTS & COMPLIANCE SUMMARY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* COMPLAINT SUMMARY */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Wrench className="size-4 text-amber-500" /> Resident Complaints Summary
                </h3>
                <Badge variant="outline" className="text-[0.65rem] font-mono">Facilities Desk</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[0.65rem] font-semibold text-amber-700 uppercase block">Open</span>
                  <span className="text-xl font-bold font-mono text-amber-700">{complaintCompliance.complaints.open}</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[0.65rem] font-semibold text-blue-700 uppercase block">In Progress</span>
                  <span className="text-xl font-bold font-mono text-blue-700">{complaintCompliance.complaints.inProgress}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[0.65rem] font-semibold text-emerald-700 uppercase block">Resolved</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">{complaintCompliance.complaints.resolved}</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Escalated</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">{complaintCompliance.complaints.escalated}</span>
                </div>
              </div>
            </div>

            {/* COMPLIANCE SUMMARY */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Institutional Compliance Summary
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">100% Certified</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Fire Safety Certification</span>
                  <span className="font-bold text-emerald-600">{complaintCompliance.compliance.fireSafety}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Hostel Code of Conduct</span>
                  <span className="font-bold text-foreground">{complaintCompliance.compliance.hostelRules}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Visitor Register System</span>
                  <span className="font-bold text-primary">{complaintCompliance.compliance.visitorRegister}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Annual Security Audit</span>
                  <span className="font-bold text-emerald-600">{complaintCompliance.compliance.securityAudit}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground font-medium">Municipal Inspection</span>
                  <span className="font-bold text-emerald-600">{complaintCompliance.compliance.inspectionStatus}</span>
                </div>
              </div>
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

      {/* HOSTEL ALERTS, STAFF SUMMARY & QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* HOSTEL ALERTS */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BellRing className="size-4 text-amber-500" /> Compact Hostel Alerts
            </h3>
            <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">{alerts.length} Active</Badge>
          </div>

          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {alt.severity === "high" ? (
                      <ShieldAlert className="size-3.5 text-destructive shrink-0" />
                    ) : (
                      <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                    )}
                    {alt.title}
                  </span>
                  <span className="text-[0.62rem] text-muted-foreground font-mono">{alt.timestamp}</span>
                </div>
                <p className="text-[0.72rem] text-muted-foreground leading-snug">{alt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOSTEL STAFF SUMMARY */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <UserCheck className="size-4 text-purple-600" /> Hostel Staff Overview
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Chief Warden:</span>
              <span className="font-bold text-foreground">{staffSummary.chiefWarden}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Assistant Wardens:</span>
              <span className="font-bold font-mono text-primary">{staffSummary.assistantWardensCount} Officers</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Security Staff:</span>
              <span className="font-bold font-mono text-foreground">{staffSummary.securityStaffCount} Guards</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Maintenance Staff:</span>
              <span className="font-bold font-mono text-foreground">{staffSummary.maintenanceStaffCount} Techs</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Mess Supervisor:</span>
              <span className="font-bold text-foreground">{staffSummary.messSupervisor}</span>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Staff Availability:</span>
              <span className="font-bold text-emerald-600">{staffSummary.staffAvailability}</span>
            </div>
          </div>
        </div>

        {/* EXECUTIVE QUICK ACTIONS */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Executive Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" onClick={() => setIsConfigOpen(true)} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <Sliders className="size-3.5 text-primary" /> Hostel Policy & Governance Configuration
            </Button>

            <Button variant="outline" onClick={handleExportPDF} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <FileText className="size-3.5 text-emerald-600" /> Download Occupancy Report
            </Button>

            <Button variant="outline" onClick={handleScheduleAudit} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <ShieldCheck className="size-3.5 text-blue-600" /> Schedule Hostel Audit
            </Button>

            <Button variant="outline" onClick={() => setActiveTab("compliance")} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <Wrench className="size-3.5 text-amber-600" /> View Maintenance & Compliance Report
            </Button>

            <Button variant="outline" onClick={() => setActiveTab("analytics")} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <BarChart3 className="size-3.5 text-purple-600" /> Infrastructure & Analytics Summary
            </Button>
          </div>
        </div>
      </div>

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
