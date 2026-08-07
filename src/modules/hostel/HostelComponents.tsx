import React, { useEffect, useState } from "react";
import {
  Building,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Users,
  Bed,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
  Calendar,
  Sparkles,
  Settings,
  Activity,
  Zap,
  Clock,
  Wrench,
  ShieldAlert,
  SlidersHorizontal,
  Globe,
  Award,
  UserCheck,
  Utensils,
  Bell,
  AlertTriangle,
  Flame,
  FileCheck,
  BarChart3,
  PieChart,
  TrendingUp,
  HeartPulse,
  FileSpreadsheet,
  UserX,
  CheckSquare,
  XCircle,
  Info,
  Shield,
  Printer,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  fetchHostelRooms,
  fetchHostelResidents,
  fetchGatePasses,
  INITIAL_ROOMS,
  INITIAL_RESIDENTS,
  INITIAL_PASSES,
  type HostelRoom,
  type ResidentStudent,
  type GatePassRequest,
} from "./HostelService";

const BLOCKS = ["All Blocks", "Block A (Boys)", "Block B (Girls)", "Block C (PG Scholars)"] as const;
const DEPARTMENTS = ["All Departments", "CSE", "ECE", "Mechanical", "Civil", "EEE"] as const;
const YEARS = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year", "PG Scholar"] as const;
const RESIDENT_STATUSES = ["All Statuses", "Present", "On Leave", "Weekend Outing", "Suspended"] as const;
const FEE_STATUSES = ["All Fee Statuses", "Paid", "Pending", "Exemption"] as const;
const MEDICAL_FLAGS = ["All Flags", "Normal", "Medical Alert"] as const;

export function HostelModuleView() {
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS);
  const [residents, setResidents] = useState<ResidentStudent[]>(INITIAL_RESIDENTS);
  const [passes, setPasses] = useState<GatePassRequest[]>(INITIAL_PASSES);
  
  // Tabs: governance, rooms, residents, passes, analytics, staff
  const [activeTab, setActiveTab] = useState<"governance" | "rooms" | "residents" | "passes" | "analytics" | "staff">("governance");

  // Filters for Resident Roster
  const [residentSearch, setResidentSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [blockFilter, setBlockFilter] = useState("All Blocks");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [feeFilter, setFeeFilter] = useState("All Fee Statuses");
  const [medicalFilter, setMedicalFilter] = useState("All Flags");

  // Room Search & Filter
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string>("All Blocks");
  const [loading, setLoading] = useState(false);

  // Executive Dialog States
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);

  // Policy Config Form State
  const [configForm, setConfigForm] = useState({
    feeStructure: "₹85,000 - ₹1,20,000 per academic year (includes mess & utilities)",
    roomCategories: "Single AC, 2-Sharing AC, 2-Sharing Non-AC, 3-Sharing Standard",
    occupancyRules: "Mandatory 85% minimum academic attendance for hostel continuation",
    checkInPolicy: "First-come-first-serve via online ERP allocation portal",
    checkOutPolicy: "No-dues clearance certificate required from Warden & Library",
    visitorPolicy: "Visitors allowed in reception lounge 04:00 PM - 07:00 PM with ID proof",
    gatePassPolicy: "ERP e-GatePass required for outstation or late entry > 08:30 PM",
    lateEntryPolicy: "Maximum 3 late entries per month; fine of ₹200 per entry thereafter",
    hostelTimings: "Main Gate Close: 09:00 PM (Summer) / 08:30 PM (Winter)",
    messTimings: "Breakfast: 07:30-09:00 AM | Lunch: 12:30-02:00 PM | Dinner: 07:30-09:00 PM",
    fineRules: "Late entry: ₹200 | Room Damage: Actual Cost + 15% Overhead | Noise Violation: ₹500",
    maintenanceSchedule: "Weekly preventive maintenance check on all blocks every Saturday",
    emergencyContacts: "Chief Warden: +91 98765 43210 | Security Control: Ext 108",
    notificationRules: "Automated SMS to parents upon gate pass approval and late entry scan",
  });

  const loadData = async () => {
    setLoading(true);
    const [rm, res, ps] = await Promise.all([
      fetchHostelRooms(),
      fetchHostelResidents(),
      fetchGatePasses(),
    ]);
    setRooms(rm);
    setResidents(res);
    setPasses(ps);
    setLoading(false);
    toast.success("Hostel governance metrics updated with live campus data!");
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNo.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = selectedBlock === "All Blocks" || r.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  // Filtered Residents List
  const filteredResidents = residents.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(residentSearch.toLowerCase()) ||
      res.rollNo.toLowerCase().includes(residentSearch.toLowerCase()) ||
      res.roomNo.toLowerCase().includes(residentSearch.toLowerCase());

    const matchesDept = deptFilter === "All Departments" || res.department === deptFilter;
    const matchesBlock = blockFilter === "All Blocks" || res.block === blockFilter;
    const matchesStatus = statusFilter === "All Statuses" || (res.status || "Present") === statusFilter;
    const matchesFee = feeFilter === "All Fee Statuses" || res.feeStatus === feeFilter;

    return matchesSearch && matchesDept && matchesBlock && matchesStatus && matchesFee;
  });

  const handleExportCSV = () => {
    const headers = ["Room ID", "Room No", "Block", "Type", "Capacity", "Occupancy", "Annual Fee (INR)", "Status"];
    const rows = filteredRooms.map((r) => [r.id, r.roomNo, `"${r.block}"`, `"${r.type}"`, r.capacity, r.occupancy, r.annualFee, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hostel_Occupancy_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported hostel occupancy ledger to CSV!");
  };

  const handleExportAnalyticsExcel = () => {
    toast.success("Exported Hostel Governance Analytics to Excel workbook!");
  };

  const handleExportAnalyticsPDF = () => {
    toast.success("Generated Hostel Executive Analytics PDF Report!");
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hostel institutional configuration & policies updated!");
    setIsConfigOpen(false);
  };

  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hostel safety & hygiene inspection scheduled!");
    setIsInspectionOpen(false);
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
                Hostel Governance & Resident Welfare Cockpit
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Oversight Console
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Executive occupancy monitoring, infrastructure health, staff governance, policy compliance, and safety audits.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner (EXECUTIVE ACTIONS ONLY - NO OPERATIONAL BUTTONS) */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent">
            <Download className="size-3.5" /> Download Occupancy Report
          </Button>

          <Button size="sm" onClick={() => setIsReportsOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold hover:bg-primary/10">
            <FileText className="size-4" /> View Hostel Reports
          </Button>

          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow hover:opacity-95">
            <Settings className="size-4" /> Hostel Configuration
          </Button>
        </div>
      </div>

      {/* TOP KPI SECTION - ROW 1 & ROW 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Rooms</span>
            <Building className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{rooms.length} Rooms</p>
          <p className="text-[0.68rem] text-muted-foreground">Blocks A, B & C</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Resident Students</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">850 Residents</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Active hostel scholars</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Available Slots</span>
            <Bed className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">45 Vacant Beds</p>
          <p className="text-[0.68rem] text-muted-foreground">Ready for allocation</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Pending Gate Passes</span>
            <KeyRound className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{passes.filter((p) => p.status === "Pending").length} Passes</p>
          <p className="text-[0.68rem] text-muted-foreground font-medium">Under warden review</p>
        </div>
      </div>

      {/* ADDITIONAL KPI METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Occupied Beds</span>
          <span className="font-mono font-bold text-foreground text-sm block">850 Beds</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Vacant Beds</span>
          <span className="font-mono font-bold text-emerald-600 text-sm block">45 Beds</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Occupancy %</span>
          <span className="font-mono font-bold text-primary text-sm block">95.0%</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Hostel Blocks</span>
          <span className="font-mono font-bold text-foreground text-sm block">3 Blocks</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Maintenance Req</span>
          <span className="font-mono font-bold text-amber-600 text-sm block">4 Pending</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Gate Passes</span>
          <span className="font-mono font-bold text-blue-600 text-sm block">12 Active</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Mess Capacity</span>
          <span className="font-mono font-bold text-purple-600 text-sm block">1,200 / session</span>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
          <span className="text-muted-foreground block text-[0.65rem] uppercase font-medium">Hostel Revenue</span>
          <span className="font-mono font-bold text-emerald-600 text-sm block">₹8.07 Cr / yr</span>
        </div>
      </div>

      {/* EXECUTIVE TABS SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button onClick={() => setActiveTab("governance")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "governance" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Executive Cockpit
        </button>
        <button onClick={() => setActiveTab("rooms")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "rooms" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Room Inventory & Block Overview ({rooms.length})
        </button>
        <button onClick={() => setActiveTab("residents")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "residents" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Resident Roster ({residents.length})
        </button>
        <button onClick={() => setActiveTab("passes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "passes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          4. Compliance, Security & Gate Passes ({passes.length})
        </button>
        <button onClick={() => setActiveTab("analytics")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "analytics" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          5. Hostel Analytics & Reports
        </button>
        <button onClick={() => setActiveTab("staff")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "staff" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          6. Warden & Staff Summary
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: EXECUTIVE COCKPIT (HEALTH, ALERTS, QUICK ACTIONS, COMPLIANCE) */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === "governance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* HOSTEL HEALTH CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Activity className="size-5 text-emerald-500" /> Infrastructure & Health Score
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
                  Overall Health: 95 / 100 (Optimal)
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Occupancy Rate</span>
                    <span className="text-emerald-600 font-mono">95.0%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">850 / 895 Beds Occupied</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Electricity Grid</span>
                    <span className="text-emerald-600 font-mono">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">Dual 500kVA DG Backup Active</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Water Supply</span>
                    <span className="text-emerald-600 font-mono">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">24x7 RO Hydro System Active</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Campus Wi-Fi</span>
                    <span className="text-blue-600 font-mono">98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                  <p className="text-[0.65rem] text-muted-foreground mt-1">1 Gbps Fiber Core Active</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/60 text-xs">
                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">CCTV Cameras:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">64 / 64 Online</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Fire Safety:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Certified Active</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Security Guarding:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">24x7 Guarded</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Maintenance SLA:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Normal SLA</Badge>
                </div>
              </div>
            </div>

            {/* COMPACT HOSTEL ALERTS CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <AlertCircle className="size-5 text-amber-500" /> Executive Hostel Alerts
                </h3>
                <Badge variant="secondary" className="font-mono text-xs">6 Active Alerts</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-red-600">
                    <span>Block A at 98% Occupancy</span>
                    <Badge className="bg-red-500/20 text-red-700 text-[0.65rem]">Critical</Badge>
                  </div>
                  <p className="text-muted-foreground text-[0.7rem]">Boys Hostel nearing max capacity. Reserve remaining beds.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-amber-600">
                    <span>Fire Safety Inspection Due</span>
                    <Badge className="bg-amber-500/20 text-amber-700 text-[0.65rem]">Compliance</Badge>
                  </div>
                  <p className="text-muted-foreground text-[0.7rem]">Annual Fire Audit by Municipal Authority due in 15 days.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-yellow-700 dark:text-yellow-300">
                    <span>Water Maintenance Scheduled</span>
                    <Badge className="bg-yellow-500/20 text-yellow-800 text-[0.65rem]">Maintenance</Badge>
                  </div>
                  <p className="text-muted-foreground text-[0.7rem]">Overhead Tank 2 cleaning scheduled Sunday 06:00 AM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: ROOM INVENTORY & BLOCK OVERVIEW */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === "rooms" && (
        <div className="space-y-6">
          {/* SUMMARY CARDS FOR TAB 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.65rem] uppercase font-medium">Total Blocks</span>
              <p className="text-xl font-bold font-mono text-foreground">3 Blocks</p>
              <p className="text-[0.65rem] text-muted-foreground">A, B & C</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.65rem] uppercase font-medium">Total Rooms</span>
              <p className="text-xl font-bold font-mono text-primary">380 Rooms</p>
              <p className="text-[0.65rem] text-muted-foreground">895 Capacity</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.65rem] uppercase font-medium">Occupied Rooms</span>
              <p className="text-xl font-bold font-mono text-emerald-600">360 Rooms</p>
              <p className="text-[0.65rem] text-emerald-600 font-medium">850 Residents</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.65rem] uppercase font-medium">Vacant Rooms</span>
              <p className="text-xl font-bold font-mono text-blue-600">18 Rooms</p>
              <p className="text-[0.65rem] text-muted-foreground">45 Vacant Beds</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.65rem] uppercase font-medium">Under Maintenance</span>
              <p className="text-xl font-bold font-mono text-amber-600">2 Rooms</p>
              <p className="text-[0.65rem] text-amber-600 font-medium">Repair in progress</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.65rem] uppercase font-medium">Overall Occupancy</span>
              <p className="text-xl font-bold font-mono text-emerald-600">95.0%</p>
              <p className="text-[0.65rem] text-emerald-600 font-medium">Optimal Level</p>
            </div>
          </div>

          {/* BLOCK MONITORING GRID / TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Building className="size-5 text-primary" /> Block-wise Infrastructure & Capacity Ledger
              </h3>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search room, type..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
                </div>

                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                  <SelectTrigger className="h-9 w-[180px] text-xs">
                    <SelectValue placeholder="Block Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCKS.map((b) => (
                      <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* BLOCK OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { block: "Block A (Boys)", warden: "Mr. K. Ramesh", cap: 468, occ: 450, vac: 18, maint: 1, occPct: 96.2, rev: "₹4.27 Cr", status: "Healthy", date: "Aug 15, 2026", maintDue: "Sat 10:00 AM" },
                { block: "Block B (Girls)", warden: "Mrs. P. Shanthi", cap: 338, occ: 320, vac: 18, maint: 1, occPct: 94.8, rev: "₹3.04 Cr", status: "Healthy", date: "Aug 18, 2026", maintDue: "Sat 02:00 PM" },
                { block: "Block C (PG Scholars)", warden: "Dr. S. R. Varma", cap: 86, occ: 80, vac: 6, maint: 0, occPct: 93.0, rev: "₹0.76 Cr", status: "Warning", date: "Aug 22, 2026", maintDue: "Sun 11:00 AM" },
              ].map((blk, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="font-bold text-sm text-foreground">{blk.block}</span>
                    <Badge className={blk.status === "Healthy" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                      {blk.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between"><span>Current Warden:</span><strong className="text-foreground font-sans">{blk.warden}</strong></div>
                    <div className="flex justify-between"><span>Block Capacity:</span><strong>{blk.cap} Beds ({blk.occ} Occupied)</strong></div>
                    <div className="flex justify-between"><span>Vacant / Maint:</span><strong className="text-blue-600">{blk.vac} Vacant / {blk.maint} Repair</strong></div>
                    <div className="flex justify-between"><span>Occupancy Rate:</span><strong className="text-emerald-600">{blk.occPct}%</strong></div>
                    <div className="flex justify-between"><span>Annual Revenue:</span><strong className="text-primary">{blk.rev}</strong></div>
                    <div className="flex justify-between"><span>Next Inspection:</span><span className="text-muted-foreground">{blk.date}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* ROOM TABLE */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Room No</th>
                    <th className="py-3 px-3">Block</th>
                    <th className="py-3 px-3">Room Type</th>
                    <th className="py-3 px-3">Capacity / Occupancy</th>
                    <th className="py-3 px-3">Annual Fee</th>
                    <th className="py-3 px-3">Occupancy Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono">
                  {filteredRooms.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors font-sans">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{r.roomNo}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{r.block}</td>
                      <td className="py-3 px-3">{r.type}</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary">{r.occupancy} / {r.capacity} Occupied</td>
                      <td className="py-3 px-3 font-mono font-bold text-foreground">₹{r.annualFee.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <Badge className={r.status === "Available" ? "bg-emerald-500/10 text-emerald-600" : r.status === "Full" ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLOCK INFRASTRUCTURE HEALTH SECTION */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Activity className="size-5 text-emerald-500" /> Block Infrastructure & Utility Health Breakdown
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
                Overall Score: 95 / 100
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Electricity Grid</span>
                <span className="font-mono font-bold text-emerald-600 text-sm block">100% Active</span>
                <span className="text-[0.65rem] text-muted-foreground">Dual DG Backup</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Water Supply</span>
                <span className="font-mono font-bold text-emerald-600 text-sm block">100% Purified</span>
                <span className="text-[0.65rem] text-muted-foreground">24x7 Hydro RO</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Internet Wi-Fi</span>
                <span className="font-mono font-bold text-blue-600 text-sm block">98.5% Active</span>
                <span className="text-[0.65rem] text-muted-foreground">1 Gbps Fiber</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">CCTV Cameras</span>
                <span className="font-mono font-bold text-emerald-600 text-sm block">64 / 64 Online</span>
                <span className="text-[0.65rem] text-muted-foreground">24x7 Record</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Fire Safety</span>
                <span className="font-mono font-bold text-emerald-600 text-sm block">Certified</span>
                <span className="text-[0.65rem] text-muted-foreground">Valid Jul 2027</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Housekeeping</span>
                <span className="font-mono font-bold text-emerald-600 text-sm block">95.0% Pass</span>
                <span className="text-[0.65rem] text-muted-foreground">Daily Audit</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1 col-span-2 sm:col-span-1">
                <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Overall Score</span>
                <span className="font-mono font-bold text-primary text-sm block">95 / 100</span>
                <span className="text-[0.65rem] text-emerald-600 font-medium">Grade A+</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: RESIDENT ROSTER */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === "residents" && (
        <div className="space-y-6">
          {/* RESIDENT ANALYTICS CARDS */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Total Scholars</span>
              <span className="font-mono font-bold text-foreground text-sm block">850</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Boys Hostel</span>
              <span className="font-mono font-bold text-primary text-sm block">450</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Girls Hostel</span>
              <span className="font-mono font-bold text-purple-600 text-sm block">320</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">PG Scholars</span>
              <span className="font-mono font-bold text-indigo-600 text-sm block">80</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">International</span>
              <span className="font-mono font-bold text-blue-600 text-sm block">15</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Scholarship</span>
              <span className="font-mono font-bold text-emerald-600 text-sm block">120</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Pending Fees</span>
              <span className="font-mono font-bold text-amber-600 text-sm block">18</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">On Leave</span>
              <span className="font-mono font-bold text-blue-600 text-sm block">12</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center space-y-0.5">
              <span className="text-muted-foreground text-[0.65rem] uppercase block font-medium">Medical Cases</span>
              <span className="font-mono font-bold text-red-600 text-sm block">4</span>
            </div>
          </div>

          {/* QUICK FILTERS BAR */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="size-4 text-primary" /> Filter Resident Roster
              </span>
              <Badge variant="outline" className="font-mono text-xs">{filteredResidents.length} Results</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search name, roll no..." value={residentSearch} onChange={(e) => setResidentSearch(e.target.value)} className="pl-9 h-9 text-xs" />
              </div>

              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map((d) => (<SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>))}</SelectContent>
              </Select>

              <Select value={blockFilter} onValueChange={setBlockFilter}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Hostel Block" /></SelectTrigger>
                <SelectContent>{BLOCKS.map((b) => (<SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>))}</SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Resident Status" /></SelectTrigger>
                <SelectContent>{RESIDENT_STATUSES.map((s) => (<SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>))}</SelectContent>
              </Select>

              <Select value={feeFilter} onValueChange={setFeeFilter}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Fee Status" /></SelectTrigger>
                <SelectContent>{FEE_STATUSES.map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}</SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => { setResidentSearch(""); setDeptFilter("All Departments"); setBlockFilter("All Blocks"); setStatusFilter("All Statuses"); setFeeFilter("All Fee Statuses"); }} className="h-9 text-xs">
                Reset Filters
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
                    <th className="py-3 px-3">Resident Name</th>
                    <th className="py-3 px-3">Department & Year</th>
                    <th className="py-3 px-3">Room & Block</th>
                    <th className="py-3 px-3">Check-in Date</th>
                    <th className="py-3 px-3">Fee Status</th>
                    <th className="py-3 px-3">Attendance</th>
                    <th className="py-3 px-3">Disciplinary</th>
                    <th className="py-3 px-3">Emergency Contact</th>
                    <th className="py-3 px-3">Resident Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono">
                  {filteredResidents.map((res) => (
                    <tr key={res.id} className="hover:bg-muted/20 transition-colors font-sans">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{res.name}</td>
                      <td className="py-3 px-3">{res.department} (3rd Year)</td>
                      <td className="py-3 px-3 font-mono text-primary font-bold">{res.roomNo} ({res.block})</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">Jul 15, 2025</td>
                      <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{res.feeStatus}</Badge></td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">94.2%</td>
                      <td className="py-3 px-3"><Badge variant="outline" className="text-[0.65rem] text-emerald-600 border-emerald-500/30">Clean Record</Badge></td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{res.emergencyContact}</td>
                      <td className="py-3 px-3">
                        <Badge className="bg-emerald-500/10 text-emerald-600">
                          {res.status || "Present"}
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

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: COMPLIANCE, SECURITY & GATE PASS MONITORING */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === "passes" && (
        <div className="space-y-6">
          {/* COMPLIANCE & GATE PASS TELEMETRY SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.68rem] uppercase font-semibold block">Gate Pass Requests Today</span>
              <p className="text-2xl font-bold font-mono text-primary">28 Total Passes</p>
              <p className="text-[0.68rem] text-emerald-600 font-medium">14 Approved &middot; 12 Pending &middot; 2 Rejected</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.68rem] uppercase font-semibold block">Security Incidents</span>
              <p className="text-2xl font-bold font-mono text-emerald-600">0 Incidents</p>
              <p className="text-[0.68rem] text-muted-foreground">24x7 Guard & CCTV Patrol Active</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.68rem] uppercase font-semibold block">Late Entries Today</span>
              <p className="text-2xl font-bold font-mono text-amber-600">4 Scanned</p>
              <p className="text-[0.68rem] text-muted-foreground">Automated Parent SMS Dispatched</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-muted-foreground text-[0.68rem] uppercase font-semibold block">Visitor Records Logged</span>
              <p className="text-2xl font-bold font-mono text-purple-600">28 Visitors</p>
              <p className="text-[0.68rem] text-muted-foreground">Reception ID Verification Passed</p>
            </div>
          </div>

          {/* COMPLAINT & STATUTORY COMPLIANCE CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* COMPLAINT SUMMARY CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Wrench className="size-5 text-amber-500" /> Resident Complaint & Repair Resolution Status
                </h3>
                <Badge variant="secondary" className="font-mono text-xs">44 Complaints This Month</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                  <span className="text-muted-foreground text-[0.65rem] uppercase block">Open</span>
                  <span className="font-mono font-bold text-amber-600 text-lg block">2</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-0.5">
                  <span className="text-muted-foreground text-[0.65rem] uppercase block">In Progress</span>
                  <span className="font-mono font-bold text-blue-600 text-lg block">4</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
                  <span className="text-muted-foreground text-[0.65rem] uppercase block">Resolved</span>
                  <span className="font-mono font-bold text-emerald-600 text-lg block">38</span>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-0.5">
                  <span className="text-muted-foreground text-[0.65rem] uppercase block">Escalated</span>
                  <span className="font-mono font-bold text-purple-600 text-lg block">0</span>
                </div>
              </div>
            </div>

            {/* STATUTORY COMPLIANCE SUMMARY CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-indigo-500" /> Statutory & Regulatory Compliance Audit
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
                  100% Compliant
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex justify-between items-center">
                  <span className="text-muted-foreground font-sans">Fire Safety:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Certified (Jul 2027)</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex justify-between items-center">
                  <span className="text-muted-foreground font-sans">Hostel Rules:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Strict Enforcement</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex justify-between items-center">
                  <span className="text-muted-foreground font-sans">Visitor Register:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Digitized & Verified</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex justify-between items-center">
                  <span className="text-muted-foreground font-sans">Security Audit:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Passed Aug 2026</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex justify-between items-center">
                  <span className="text-muted-foreground font-sans">Hygiene Inspection:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Grade A+ Passed</Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex justify-between items-center">
                  <span className="text-muted-foreground font-sans">UGC Compliance:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">100% Compliant</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* GATE PASS AUDIT TABLE (READ ONLY OVERVIEW) */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <KeyRound className="size-5 text-amber-500" /> Outstation Gate Pass & Outing Audit Ledger
              </h3>
              <Badge variant="secondary" className="font-mono text-xs">{passes.length} Records</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Pass ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Room</th>
                    <th className="py-3 px-3">Pass Type & Reason</th>
                    <th className="py-3 px-3">Approved Dates</th>
                    <th className="py-3 px-3">Pass Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono">
                  {passes.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors font-sans">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{p.id}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{p.studentName} ({p.rollNo})</td>
                      <td className="py-3 px-3 font-mono">{p.roomNo}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-primary">{p.passType}</div>
                        <div className="text-[0.68rem] text-muted-foreground">{p.reason}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{p.fromDate} to {p.toDate}</td>
                      <td className="py-3 px-3">
                        <Badge className={p.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                          {p.status}
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

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: HOSTEL ANALYTICS & REPORTS (NEW TAB) */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* HEADER & EXPORT ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" /> Executive Hostel Analytics & Performance Matrix
              </h3>
              <p className="text-xs text-muted-foreground">Comprehensive institutional telemetry for occupancy, revenue, maintenance costs, and mess utilization.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportAnalyticsPDF} className="h-8 text-xs gap-1.5">
                <FileText className="size-3.5 text-red-500" /> Export PDF
              </Button>
              <Button size="sm" onClick={handleExportAnalyticsExcel} className="h-8 bg-brand-gradient text-white text-xs gap-1.5 font-semibold">
                <FileSpreadsheet className="size-3.5" /> Export Excel
              </Button>
            </div>
          </div>

          {/* ANALYTICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" /> Monthly Occupancy Trend
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>June 2026:</span><strong className="text-muted-foreground">92.4%</strong></div>
                <div className="flex justify-between"><span>July 2026:</span><strong className="text-primary">94.1%</strong></div>
                <div className="flex justify-between"><span>August 2026 (Current):</span><strong className="text-emerald-600">95.0% Peak</strong></div>
                <Progress value={95} className="h-2 mt-2" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <PieChart className="size-4 text-blue-500" /> Hostel Financials & Revenue
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Annual Fee Realized:</span><strong className="text-emerald-600">₹8.07 Cr (96.4%)</strong></div>
                <div className="flex justify-between"><span>Maintenance Budget:</span><strong className="text-amber-600">₹14.2 Lakhs / yr</strong></div>
                <div className="flex justify-between"><span>Fee Recovery Rate:</span><strong className="text-primary">96.4% On Time</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Utensils className="size-4 text-purple-500" /> Mess Utilization & Satisfaction
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Daily Meals Served:</span><strong className="text-purple-600">2,550 Meals/day</strong></div>
                <div className="flex justify-between"><span>Student Satisfaction:</span><strong className="text-emerald-600">4.8 / 5.0 Rating</strong></div>
                <div className="flex justify-between"><span>Hygiene Grade:</span><strong className="text-emerald-600">Grade A+ (Certified)</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building className="size-4 text-primary" /> Block Occupancy Comparison
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Most Occupied Hostel:</span><strong className="text-emerald-600">Block A Boys (96.2%)</strong></div>
                <div className="flex justify-between"><span>Girls Hostel:</span><strong className="text-primary">Block B Girls (94.8%)</strong></div>
                <div className="flex justify-between"><span>Least Occupied Hostel:</span><strong className="text-amber-600">Block C PG (92.5%)</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <KeyRound className="size-4 text-amber-500" /> Gate Pass Telemetry Stats
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Monthly Passes Issued:</span><strong className="text-primary">340 Gate Passes</strong></div>
                <div className="flex justify-between"><span>Avg Approval Time:</span><strong className="text-emerald-600">18 Minutes</strong></div>
                <div className="flex justify-between"><span>Late Entries Logged:</span><strong className="text-amber-600">14 Scans / mo</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Wrench className="size-4 text-indigo-500" /> Maintenance & Repair SLA
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Monthly Repairs Closed:</span><strong className="text-emerald-600">28 Repairs</strong></div>
                <div className="flex justify-between"><span>Avg Resolution Time:</span><strong className="text-primary">&lt; 24h SLA</strong></div>
                <div className="flex justify-between"><span>Complaint SLA Rate:</span><strong className="text-emerald-600">94.8% SLA Pass</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: WARDEN & STAFF SUMMARY */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <UserCheck className="size-5 text-purple-500" /> Hostel Warden & Staff Administration Summary
            </h3>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
              100% Staff On Duty
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-500/10 text-purple-600 font-mono text-xs">Chief Warden</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">On Duty</Badge>
              </div>
              <h4 className="font-bold text-base text-foreground">Dr. S. R. Varma</h4>
              <p className="text-[0.68rem] text-muted-foreground font-mono">Overall Hostel Administration Head</p>
              <div className="pt-2 border-t border-border/60 space-y-1 font-mono text-[0.68rem]">
                <div className="flex justify-between"><span>Contact:</span><strong>+91 98765 43210</strong></div>
                <div className="flex justify-between"><span>Audit Rating:</span><strong className="text-emerald-600">Grade A+</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <Badge className="bg-blue-500/10 text-blue-600 font-mono text-xs">Assistant Wardens</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">2 / 2 On Duty</Badge>
              </div>
              <h4 className="font-bold text-sm text-foreground">Mr. K. Ramesh (Block A)</h4>
              <h4 className="font-bold text-sm text-foreground">Mrs. P. Shanthi (Block B)</h4>
              <div className="pt-2 border-t border-border/60 space-y-1 font-mono text-[0.68rem]">
                <div className="flex justify-between"><span>Pending Leaves:</span><strong className="text-emerald-600">0 Requests</strong></div>
                <div className="flex justify-between"><span>Gate Pass SLA:</span><strong className="text-primary">100% On Time</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-xs">Security Staff</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">12 / 12 Guards</Badge>
              </div>
              <h4 className="font-bold text-sm text-foreground">3 Shift Teams (24x7)</h4>
              <p className="text-[0.68rem] text-muted-foreground">Gate 1, Gate 2 & Block Perimeter Guards</p>
              <div className="pt-2 border-t border-border/60 space-y-1 font-mono text-[0.68rem]">
                <div className="flex justify-between"><span>Shift Supervisor:</span><strong>Capt. V. Singh</strong></div>
                <div className="flex justify-between"><span>CCTV Monitor:</span><strong className="text-emerald-600">Active</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <Badge className="bg-amber-500/10 text-amber-600 font-mono text-xs">Maintenance & Mess</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">All Staff Active</Badge>
              </div>
              <h4 className="font-bold text-sm text-foreground">Mr. T. Srinivas (Mess Head)</h4>
              <p className="text-[0.68rem] text-muted-foreground">4 Technicians (Plumber, Electrician, Carpenter)</p>
              <div className="pt-2 border-t border-border/60 space-y-1 font-mono text-[0.68rem]">
                <div className="flex justify-between"><span>Mess Hygiene:</span><strong className="text-emerald-600">A+ Certified</strong></div>
                <div className="flex justify-between"><span>Repair SLA:</span><strong className="text-primary font-sans">&lt; 24h Average</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* EXECUTIVE MODAL DIALOGS */}
      {/* --------------------------------------------------------------------- */}

      {/* DIALOG 1: HOSTEL CONFIGURATION MODAL */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Settings className="size-5 text-primary" /> Institutional Hostel Policy & Configuration
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure room fee structures, occupancy rules, mess timings, gate pass policies, and late entry rules.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveConfig} className="space-y-3.5 pt-2 text-xs max-h-[65vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Annual Fee Structure</Label>
                <Input value={configForm.feeStructure} onChange={(e) => setConfigForm({ ...configForm, feeStructure: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Room Categories</Label>
                <Input value={configForm.roomCategories} onChange={(e) => setConfigForm({ ...configForm, roomCategories: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Hostel Main Gate Timings</Label>
                <Input value={configForm.hostelTimings} onChange={(e) => setConfigForm({ ...configForm, hostelTimings: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Mess Meal Timings</Label>
                <Input value={configForm.messTimings} onChange={(e) => setConfigForm({ ...configForm, messTimings: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Gate Pass Policy</Label>
                <Input value={configForm.gatePassPolicy} onChange={(e) => setConfigForm({ ...configForm, gatePassPolicy: e.target.value })} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Late Entry Policy & Fines</Label>
                <Input value={configForm.lateEntryPolicy} onChange={(e) => setConfigForm({ ...configForm, lateEntryPolicy: e.target.value })} className="h-9 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Academic Occupancy Continuation Rules</Label>
              <Input value={configForm.occupancyRules} onChange={(e) => setConfigForm({ ...configForm, occupancyRules: e.target.value })} className="h-9 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Visitor & Parent Access Policy</Label>
              <Input value={configForm.visitorPolicy} onChange={(e) => setConfigForm({ ...configForm, visitorPolicy: e.target.value })} className="h-9 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Preventive Maintenance Schedule</Label>
              <Input value={configForm.maintenanceSchedule} onChange={(e) => setConfigForm({ ...configForm, maintenanceSchedule: e.target.value })} className="h-9 text-xs" />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsConfigOpen(false)} className="text-xs">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Save Hostel Configuration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: HOSTEL REPORTS MODAL */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" /> Executive Hostel Reports & Audits
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Generate and download occupancy ledgers, maintenance reports, and gate pass audits.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: "Monthly Occupancy Ledger", desc: "Detailed room occupancy & block-wise bed utilization.", icon: Building },
                { title: "Hostel Fee Collection Audit", desc: "Fee recovery breakdown across Blocks A, B & C.", icon: FileCheck },
                { title: "Maintenance & Repair Summary", desc: "Completed repairs and pending maintenance SLA.", icon: Wrench },
                { title: "Gate Pass & Late Entry Log", desc: "ERP outstation passes & late entry scan audit.", icon: KeyRound },
                { title: "Mess Hygiene & Quality Audit", desc: "Food safety, meal count & hygiene inspection report.", icon: Utensils },
                { title: "Statutory Safety Certificate", desc: "Fire safety, building stability & insurance audit.", icon: ShieldCheck },
              ].map((rep, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/80 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-foreground flex items-center gap-1.5"><rep.icon className="size-4 text-primary" /> {rep.title}</span>
                    <p className="text-[0.68rem] text-muted-foreground mt-0.5">{rep.desc}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Exporting ${rep.title}...`)} className="h-7 text-xs w-full gap-1">
                    <Download className="size-3" /> Download PDF
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setIsReportsOpen(false)} className="w-full text-xs">Close Reports Center</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
