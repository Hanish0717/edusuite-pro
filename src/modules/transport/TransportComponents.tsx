import React, { useEffect, useState } from "react";
import {
  Bus,
  RefreshCw,
  Download,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Navigation,
  Sliders,
  BarChart3,
  Activity,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  Zap,
  BellRing,
  PieChart,
  ShieldAlert,
  Search,
  Filter,
  FileSpreadsheet,
  FileCheck,
  Gauge,
  Fuel,
  Wrench,
  Eye,
  Loader2,
  TrendingUp,
  PhoneCall,
  Flame,
  Lock,
  Printer,
  X,
  History,
  Sparkles,
  Award,
  TrendingDown,
  BrainCircuit,
  CheckSquare,
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
  fetchBusRoutes,
  fetchTransportPasses,
  INITIAL_ENHANCED_ROUTES,
  INITIAL_ENHANCED_PASSES,
  DEFAULT_TRANSPORT_CONFIG,
  INITIAL_VEHICLE_COMPLIANCE,
  DEFAULT_FLEET_HEALTH,
  DEFAULT_ANALYTICS,
  DEFAULT_POLICY_GOVERNANCE,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  DEFAULT_STAFF_SUMMARY,
  type EnhancedBusRoute,
  type EnhancedTransportPass,
  type TransportConfig,
  type VehicleComplianceItem,
  type FleetHealthCompliance,
  type ExecutiveTransportAnalyticsData,
  type PolicyGovernanceData,
  type TransportAlert,
  type TransportActivityLog,
  type TransportStaffSummary,
} from "./TransportService";

import { useLocation } from "@tanstack/react-router";

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");

  const [routes, setRoutes] = useState<EnhancedBusRoute[]>(INITIAL_ENHANCED_ROUTES);
  const [passes, setPasses] = useState<EnhancedTransportPass[]>(INITIAL_ENHANCED_PASSES);
  const [activeTab, setActiveTab] = useState<"routes" | "passes" | "health" | "analytics" | "governance">("routes");

  useEffect(() => {
    if (tabFromUrl === "routes") setActiveTab("routes");
    else if (tabFromUrl === "passes") setActiveTab("passes");
    else if (tabFromUrl === "health") setActiveTab("health");
    else if (tabFromUrl === "analytics") setActiveTab("analytics");
    else if (tabFromUrl === "governance") setActiveTab("governance");
  }, [tabFromUrl]);

  const [loading, setLoading] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [reportExporting, setReportExporting] = useState<string | null>(null);

  // Tab 1 Filters
  const [routeSearch, setRouteSearch] = useState("");
  const [routeCategoryFilter, setRouteCategoryFilter] = useState("All");
  const [routeStatusFilter, setRouteStatusFilter] = useState("All");

  // Tab 2 Filters
  const [passSearch, setPassSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterUserType, setFilterUserType] = useState("All");
  const [filterRoute, setFilterRoute] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAcademicYear, setFilterAcademicYear] = useState("All");

  // Tab 3 Filters
  const [complianceList] = useState<VehicleComplianceItem[]>(INITIAL_VEHICLE_COMPLIANCE);
  const [complianceFilterVehicle, setComplianceFilterVehicle] = useState("All");
  const [complianceFilterStatus, setComplianceFilterStatus] = useState("All");
  const [complianceFilterExpiry, setComplianceFilterExpiry] = useState("All");

  // Modals for "View Details"
  const [selectedRoute, setSelectedRoute] = useState<EnhancedBusRoute | null>(null);
  const [selectedPass, setSelectedPass] = useState<EnhancedTransportPass | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleComplianceItem | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; category: string; docNo: string; expiry: string; status: string } | null>(null);

  // Quick Action Dialogs State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configSubTab, setConfigSubTab] = useState<"general" | "fees" | "vehicles" | "drivers" | "students" | "gps" | "notifications">("general");
  const [configForm, setConfigForm] = useState<TransportConfig>(DEFAULT_TRANSPORT_CONFIG);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>("Monthly Fleet Report");
  const [reportVehicleFilter, setReportVehicleFilter] = useState("All");
  const [reportRouteFilter, setReportRouteFilter] = useState("All");
  const [reportDriverFilter, setReportDriverFilter] = useState("All");
  const [reportDeptFilter, setReportDeptFilter] = useState("All");
  const [reportDateRange, setReportDateRange] = useState("August 2026");

  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditForm, setAuditForm] = useState({
    auditTitle: "Q3 RTO Fitness & Safety Fleet Inspection",
    auditDate: "2026-08-25",
    auditTime: "09:30",
    auditType: "RTO Fitness & Safety Audit",
    auditor: "State RTO Inspection Cell & Campus Fleet Committee",
    vehicleCategory: "All Fleet",
    priority: "High",
    remarks: "Comprehensive bi-annual RTO compliance, emission, and GPS telematics audit.",
  });

  const [isComplianceOpen, setIsComplianceOpen] = useState(false);

  // Telemetry & Governance State
  const [fleetHealth] = useState<FleetHealthCompliance>(DEFAULT_FLEET_HEALTH);
  const [analytics] = useState<ExecutiveTransportAnalyticsData>(DEFAULT_ANALYTICS);
  const [policyGovernance] = useState<PolicyGovernanceData>(DEFAULT_POLICY_GOVERNANCE);
  const [alerts, setAlerts] = useState<TransportAlert[]>(INITIAL_ALERTS);
  const [activities, setActivities] = useState<TransportActivityLog[]>(INITIAL_ACTIVITIES);

  const addActivityLog = (action: string, category: string) => {
    const newLog: TransportActivityLog = {
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
    const [rt, ps] = await Promise.all([fetchBusRoutes(), fetchTransportPasses()]);
    setRoutes(rt as EnhancedBusRoute[]);
    setLoading(false);
    toast.success("Super Admin Transport Governance console refreshed");
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Lists
  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      r.routeNo.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.routeName.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.busRegNo.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.driverName.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.routeCode.toLowerCase().includes(routeSearch.toLowerCase());
    const matchesCategory = routeCategoryFilter === "All" || r.routeCategory === routeCategoryFilter;
    const matchesStatus = routeStatusFilter === "All" || r.status === routeStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredPasses = passes.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(passSearch.toLowerCase()) ||
      p.rollNo.toLowerCase().includes(passSearch.toLowerCase()) ||
      p.passId.toLowerCase().includes(passSearch.toLowerCase());
    const matchesDept = filterDept === "All" || p.department === filterDept;
    const matchesUser = filterUserType === "All" || p.userType === filterUserType;
    const matchesRoute = filterRoute === "All" || p.routeNo === filterRoute;
    const matchesStatus = filterStatus === "All" || p.passStatus === filterStatus;
    const matchesYear = filterAcademicYear === "All" || p.academicYear === filterAcademicYear;

    return matchesSearch && matchesDept && matchesUser && matchesRoute && matchesStatus && matchesYear;
  });

  const filteredCompliance = complianceList.filter((item) => {
    const matchesVehicle = complianceFilterVehicle === "All" || item.vehicleNo === complianceFilterVehicle;
    const matchesStatus =
      complianceFilterStatus === "All" ||
      item.vehicleHealth === complianceFilterStatus ||
      item.insuranceStatus === complianceFilterStatus;
    const matchesExpiry =
      complianceFilterExpiry === "All" ||
      (complianceFilterExpiry === "Expiring Soon" && (item.insuranceStatus === "Expiring Soon" || item.permitStatus === "Expiring Soon")) ||
      (complianceFilterExpiry === "Expired" && (item.pollutionCertificate === "Expired" || item.fitnessCertificate === "Expired"));

    return matchesVehicle && matchesStatus && matchesExpiry;
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigOpen(false);
    addActivityLog("Updated Transport Policy & Governance Configuration", "Configuration");
    toast.success("Transport Policy & Governance Configuration updated!");
  };

  const handleResetConfig = () => {
    setConfigForm(DEFAULT_TRANSPORT_CONFIG);
    toast.info("Transport Configuration reset to default policy values.");
  };

  const handleExportRoutesCSV = () => {
    const headers = ["Route Code", "Route No", "Route Name", "Category", "Bus Reg No", "Driver", "Capacity", "Pass Holders", "Students", "Faculty", "Waiting List", "Occupancy %", "Distance (km)", "Travel Time", "On-Time %", "GPS Status", "Vehicle Health", "Status"];
    const rows = filteredRoutes.map((r) => [r.routeCode, r.routeNo, `"${r.routeName}"`, `"${r.routeCategory}"`, r.busRegNo, `"${r.driverName}"`, r.capacity, r.passHoldersCount, r.studentCount, r.facultyCount, r.waitingList, `${r.occupancyPercentage}%`, r.distanceKm, `"${r.estimatedTravelTime}"`, `${r.onTimePerformancePct}%`, `"${r.gpsStatus}"`, r.vehicleHealth, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Route_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addActivityLog("Exported Route Directory to CSV", "Export");
    toast.success("Exported route directory to CSV!");
  };

  const handleExportPassesCSV = () => {
    const headers = ["Pass ID", "Name", "Roll / Employee ID", "User Type", "Department", "Year", "Route", "Pickup Stop", "Drop Point", "Pass Type", "Annual Fee", "Payment Status", "Expiry Date", "Renewal Status", "Status"];
    const rows = filteredPasses.map((p) => [p.passId, `"${p.studentName}"`, p.rollNo, p.userType, p.department, `"${p.year}"`, p.routeNo, `"${p.pickupStop}"`, `"${p.dropPoint}"`, `"${p.passType}"`, p.annualFee, p.paymentStatus, p.expiryDate, `"${p.renewalStatus}"`, p.passStatus]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Transport_Pass_Directory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addActivityLog("Exported Pass Holders Directory to CSV", "Export");
    toast.success("Exported pass holders directory to CSV!");
  };

  const handleDownloadTransportReport = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      const textContent = `INSTITUTIONAL TRANSPORT GOVERNANCE REPORT\nGenerated: ${new Date().toISOString()}\n\n1. FLEET SUMMARY\nTotal Active Routes: ${routes.length}\nFleet Occupancy: ${analytics.averageOccupancyPct}%\nActive Buses: 24 Buses (100% Operational)\nTotal Transport Revenue: ${analytics.transportRevenue}\nMonthly Fuel Cost: ${analytics.monthlyFuelCost}\nMonthly Maintenance Cost: ${analytics.monthlyMaintenanceCost}\n\n2. VEHICLE HEALTH & COMPLIANCE SUMMARY\nOverall Fleet Health Score: ${fleetHealth.vehicleHealthScore}/100\nInsurance Expiry Status: ${fleetHealth.insuranceExpiry}\nPermit Status: ${fleetHealth.permitStatus}\nPollution Certificate: ${fleetHealth.pollutionCertificate}\nFitness Clearance: ${fleetHealth.fitnessCertificate}\nGPS Tracking: ${fleetHealth.gpsStatus}\n\n3. ROUTE UTILIZATION LEDGER\n${routes.map(r => `${r.routeCode} (${r.routeNo}): ${r.routeName} | Bus: ${r.busRegNo} | Driver: ${r.driverName} | Occupancy: ${r.occupancyPercentage}%`).join("\n")}\n`;

      const blob = new Blob([textContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Institutional_Transport_Governance_Report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingReport(false);
      addActivityLog("Downloaded Institutional Transport Governance Report", "Reports");
      toast.success("Institutional Transport Governance Report compiled & downloaded!");
    }, 500);
  };

  const handleScheduleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditOpen(false);
    addActivityLog(`Scheduled Fleet Audit: ${auditForm.auditTitle} for ${auditForm.auditDate}`, "Audit");

    const newAlert: TransportAlert = {
      id: `ALT-${Date.now()}`,
      severity: "medium",
      title: `Fleet Audit Scheduled: ${auditForm.auditTitle}`,
      description: `Scheduled for ${auditForm.auditDate} at ${auditForm.auditTime}. Auditor: ${auditForm.auditor}`,
      timestamp: "Just now",
    };
    setAlerts((prev) => [newAlert, ...prev]);

    toast.success(`Fleet Audit scheduled successfully for ${auditForm.auditDate}!`);
  };

  const handleExportReport = (format: "PDF" | "Excel" | "CSV") => {
    setReportExporting(format);
    setTimeout(() => {
      const mime = format === "PDF" ? "application/pdf" : format === "Excel" ? "application/vnd.ms-excel" : "text/csv";
      const ext = format.toLowerCase();
      const content = `FLEET REPORT - ${selectedReportType.toUpperCase()}\nDate: ${new Date().toISOString()}\nFilters: Vehicle=${reportVehicleFilter}, Route=${reportRouteFilter}, Driver=${reportDriverFilter}, Dept=${reportDeptFilter}, DateRange=${reportDateRange}\n\nReport Summary Data:\nTotal Fleet Occupancy: 92.4%\nTotal Fuel Cost: ₹4.25 Lakhs\nTotal Maintenance Cost: ₹1.15 Lakhs\nDriver Safety Score: 98/100\n`;

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Fleet_${selectedReportType.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setReportExporting(null);
      addActivityLog(`Exported ${selectedReportType} (${format})`, "Reports");
      toast.success(`${selectedReportType} exported to ${format} successfully!`);
    }, 400);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Bus className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Super Admin Transport & Fleet Governance Console
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Institutional Monitoring & Compliance
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Institutional governance console for fleet telemetry, route optimization, driver compliance, passenger rosters, and financial transport reports.
            </p>
          </div>
        </div>

        {/* Executive Action Bar */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadTransportReport} disabled={downloadingReport} className="h-9 gap-2 text-xs font-medium">
            {downloadingReport ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />} Export Governance Report
          </Button>
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Sliders className="size-4" /> Policy Configuration
          </Button>
        </div>
      </div>

      {/* EXECUTIVE TABS SWITCHER (5 TABS) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab("routes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "routes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          1. Fleet Overview & Route Analytics ({routes.length})
        </button>
        <button
          onClick={() => setActiveTab("passes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "passes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          2. Transport Pass Holders Directory ({passes.length})
        </button>
        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "health" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          3. Fleet Health & Vehicle Compliance
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "analytics" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          4. Transport Executive Analytics
        </button>
        <button
          onClick={() => setActiveTab("governance")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "governance" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          }`}
        >
          5. Transport Policy & Governance
        </button>
      </div>

      {/* TAB 1: FLEET OVERVIEW & ROUTE ANALYTICS */}
      {activeTab === "routes" && (
        <div className="space-y-4">
          {/* TAB 1 SUMMARY CARDS (8 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Total Routes</span>
              <span className="text-lg font-bold font-mono text-primary">18 Routes</span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Fleet Size</span>
              <span className="text-lg font-bold font-mono text-foreground">24 Buses</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-emerald-700 uppercase block truncate">Active Routes</span>
              <span className="text-lg font-bold font-mono text-emerald-700">18 Active</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Inactive Routes</span>
              <span className="text-lg font-bold font-mono text-muted-foreground">0 Inactive</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-blue-700 uppercase block truncate">In Service</span>
              <span className="text-lg font-bold font-mono text-blue-700">22 Buses</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-purple-700 uppercase block truncate">Avg Occupancy</span>
              <span className="text-lg font-bold font-mono text-purple-700">{analytics.averageOccupancyPct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-emerald-700 uppercase block truncate">GPS Online</span>
              <span className="text-lg font-bold font-mono text-emerald-700">24 / 24</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-amber-700 uppercase block truncate">Route Utilization</span>
              <span className="text-lg font-bold font-mono text-amber-700">{analytics.routeUtilization}%</span>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Search className="size-4 text-primary" /> Filter Route Directory Telemetry
              </h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleExportRoutesCSV} className="h-8 text-xs gap-1.5 font-semibold">
                  <Download className="size-3.5" /> Export Routes CSV
                </Button>
                <span className="text-xs font-mono text-muted-foreground">{filteredRoutes.length} Routes Displayed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="relative col-span-1 sm:col-span-1">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search code, route name, bus reg, driver..."
                  value={routeSearch}
                  onChange={(e) => setRouteSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <Select value={routeCategoryFilter} onValueChange={setRouteCategoryFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="City Express">City Express</SelectItem>
                  <SelectItem value="Suburban Feeder">Suburban Feeder</SelectItem>
                  <SelectItem value="Metro Link">Metro Link</SelectItem>
                </SelectContent>
              </Select>

              <Select value={routeStatusFilter} onValueChange={setRouteStatusFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Route Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ROUTE CARDS GRID WITH COMPLETE TELEMETRY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRoutes.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-primary">{r.routeCode}</span>
                      <Badge variant="outline" className="text-[0.6rem] font-mono">{r.routeCategory}</Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground leading-snug mt-0.5">{r.routeName}</h3>
                  </div>
                  <Badge className={r.status === "Active" ? "bg-emerald-500/10 text-emerald-600 shrink-0" : "bg-amber-500/10 text-amber-600 shrink-0"}>
                    {r.status}
                  </Badge>
                </div>

                {/* Progress bar for occupancy */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Occupancy & Pass Distribution</span>
                    <span className="font-mono text-primary">{r.passHoldersCount} / {r.capacity} ({r.occupancyPercentage}%)</span>
                  </div>
                  <Progress value={r.occupancyPercentage} className="h-2 bg-muted" />
                  <div className="flex justify-between text-[0.68rem] text-muted-foreground">
                    <span>Students: {r.studentCount} | Staff: {r.facultyCount}</span>
                    <span className={r.waitingList > 0 ? "text-amber-600 font-bold" : ""}>Waitlist: {r.waitingList}</span>
                  </div>
                </div>

                {/* Grid metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">Distance</span>
                    <span className="font-mono font-bold text-foreground">{r.distanceKm} km</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">Travel Time</span>
                    <span className="font-mono font-bold text-foreground">{r.estimatedTravelTime}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[0.65rem] text-muted-foreground uppercase block font-semibold">On-Time %</span>
                    <span className="font-mono font-bold text-emerald-600">{r.onTimePerformancePct}%</span>
                  </div>
                </div>

                {/* Detailed Telemetry */}
                <div className="space-y-1.5 text-xs border-t border-border/60 pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Vehicle:</span>
                    <span className="font-mono font-bold text-foreground">{r.busRegNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver:</span>
                    <span className="font-semibold text-foreground">{r.driverName} ({r.driverPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Mileage / Trips:</span>
                    <span className="font-mono text-emerald-600 font-semibold">{r.fuelEfficiencyKmpl} Kmpl ({r.dailyTrips} Trips/day)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GPS Uptime / Health:</span>
                    <span className="font-mono text-emerald-600 font-semibold">{r.gpsStatus} ({r.vehicleHealth})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Safety Rating:</span>
                    <span className="font-bold text-primary">{r.safetyRating} ({r.complaintCount} Complaints)</span>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-border/40">
                    <span className="text-[0.65rem] text-muted-foreground font-mono">Next Maint: {r.nextMaintenanceDue}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRoute(r)}
                      className="h-7 text-[0.7rem] font-semibold gap-1"
                    >
                      <Eye className="size-3 text-primary" /> View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSPORT PASS HOLDERS DIRECTORY */}
      {activeTab === "passes" && (
        <div className="space-y-4">
          {/* SUMMARY CARDS (8 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Active Passes</span>
              <span className="text-lg font-bold font-mono text-primary">1,120</span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Student Passes</span>
              <span className="text-lg font-bold font-mono text-foreground">1,040</span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Faculty Passes</span>
              <span className="text-lg font-bold font-mono text-foreground">80</span>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-red-700 uppercase block truncate">Expired Passes</span>
              <span className="text-lg font-bold font-mono text-red-700">12</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-amber-700 uppercase block truncate">Renewal Due</span>
              <span className="text-lg font-bold font-mono text-amber-700">4</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-muted-foreground uppercase block truncate">Blocked Passes</span>
              <span className="text-lg font-bold font-mono text-muted-foreground">0</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-blue-700 uppercase block truncate">Pending Apps</span>
              <span className="text-lg font-bold font-mono text-blue-700">18</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[0.62rem] font-semibold text-emerald-700 uppercase block truncate">Revenue Gen.</span>
              <span className="text-lg font-bold font-mono text-emerald-700">₹3.58 Cr</span>
            </div>
          </div>

          {/* ADVANCED FILTERS BAR */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Filter className="size-4 text-primary" /> Advanced Filters - Transport Pass Holders Roster
              </h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleExportPassesCSV} className="h-8 text-xs gap-1.5 font-semibold">
                  <Download className="size-3.5" /> Export Directory CSV
                </Button>
                <span className="text-xs font-mono text-muted-foreground">{filteredPasses.length} Pass Holders Found</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5">
              <div className="relative col-span-1 sm:col-span-2">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search student/faculty name, roll no, pass ID..."
                  value={passSearch}
                  onChange={(e) => setPassSearch(e.target.value)}
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

              <Select value={filterUserType} onValueChange={setFilterUserType}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="User Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All User Types</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRoute} onValueChange={setFilterRoute}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Route" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Routes</SelectItem>
                  <SelectItem value="Route 1">Route 1</SelectItem>
                  <SelectItem value="Route 2">Route 2</SelectItem>
                  <SelectItem value="Route 3">Route 3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Pass Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Renewal Due">Renewal Due</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PASS DIRECTORY TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Pass Number</th>
                    <th className="py-3 px-3">Student / Faculty Name</th>
                    <th className="py-3 px-3">Roll / Employee ID</th>
                    <th className="py-3 px-3">User Type & Dept</th>
                    <th className="py-3 px-3">Assigned Route</th>
                    <th className="py-3 px-3">Pickup / Drop Point</th>
                    <th className="py-3 px-3">Pass Type & Fee</th>
                    <th className="py-3 px-3">Validity & Renewal</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPasses.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{p.passId}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{p.studentName}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{p.rollNo}</td>
                      <td className="py-3 px-3">{p.userType} ({p.department})</td>
                      <td className="py-3 px-3 font-mono text-primary font-bold">{p.routeNo}</td>
                      <td className="py-3 px-3 text-muted-foreground font-medium">{p.pickupStop} ──&gt; {p.dropPoint}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{p.passType}</span>
                        <span className="font-mono text-emerald-600 font-bold">₹{p.annualFee.toLocaleString()} ({p.paymentStatus})</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        <span>{p.expiryDate}</span>
                        <span className="block text-[0.65rem] text-primary">{p.renewalStatus}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={p.passStatus === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>{p.passStatus}</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPass(p)} className="h-7 text-[0.7rem] font-semibold gap-1">
                          <Eye className="size-3 text-primary" /> View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLEET HEALTH & VEHICLE COMPLIANCE */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-500" /> Vehicle Compliance & Maintenance Audit Roster
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Comprehensive institutional audit of insurance, fitness, permits, pollution, tyre health, and emergency equipment.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsComplianceOpen(true)} className="h-8 text-xs font-semibold gap-1.5">
                  <Eye className="size-3.5 text-primary" /> Compliance Console
                </Button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <Label className="text-[0.65rem] font-semibold uppercase text-muted-foreground">Filter Vehicle</Label>
                <Select value={complianceFilterVehicle} onValueChange={setComplianceFilterVehicle}>
                  <SelectTrigger className="h-8 text-xs bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Vehicles</SelectItem>
                    {complianceList.map((v) => (
                      <SelectItem key={v.id} value={v.vehicleNo}>{v.vehicleNo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[0.65rem] font-semibold uppercase text-muted-foreground">Filter Vehicle Health</Label>
                <Select value={complianceFilterStatus} onValueChange={setComplianceFilterStatus}>
                  <SelectTrigger className="h-8 text-xs bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Health Statuses</SelectItem>
                    <SelectItem value="Healthy">Healthy (Green)</SelectItem>
                    <SelectItem value="Warning">Warning (Amber)</SelectItem>
                    <SelectItem value="Critical">Critical (Red)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[0.65rem] font-semibold uppercase text-muted-foreground">Filter Compliance Expiry</Label>
                <Select value={complianceFilterExpiry} onValueChange={setComplianceFilterExpiry}>
                  <SelectTrigger className="h-8 text-xs bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Expiry Dates</SelectItem>
                    <SelectItem value="Expiring Soon">Expiring Soon (30 Days)</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* VEHICLES COMPLIANCE LEDGER */}
            <div className="overflow-x-auto border border-border/80 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Vehicle Info</th>
                    <th className="py-3 px-3">Type & Driver</th>
                    <th className="py-3 px-3">Insurance & Permit</th>
                    <th className="py-3 px-3">Fitness & Pollution</th>
                    <th className="py-3 px-3">GPS & CCTV Uptime</th>
                    <th className="py-3 px-3">Safety & Service</th>
                    <th className="py-3 px-3">Health & Score</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCompliance.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">
                        {c.vehicleNo}
                        <span className="text-[0.62rem] text-muted-foreground block font-normal">{c.manufacturer} {c.model} ({c.purchaseYear})</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block text-foreground">{c.vehicleType}</span>
                        <span className="text-[0.65rem] text-muted-foreground block">Driver: {c.assignedDriver}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={c.insuranceStatus === "Compliant" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>Insurance: {c.insuranceStatus}</Badge>
                        <span className="text-[0.62rem] text-muted-foreground block font-mono">Permit: {c.permitStatus}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={c.fitnessCertificate === "Compliant" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>Fitness: {c.fitnessCertificate}</Badge>
                        <span className="text-[0.62rem] text-muted-foreground block font-mono">Pollution: {c.pollutionCertificate}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">
                        <span>{c.gpsStatus}</span>
                        <span className="text-[0.62rem] text-muted-foreground block">CCTV: {c.cctvStatus}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">Last Serviced: {c.lastServiceDate}</span>
                        <span className="text-[0.65rem] text-muted-foreground font-mono block">Cost: {c.maintenanceCost}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={c.vehicleHealth === "Healthy" ? "bg-emerald-500/10 text-emerald-600" : c.vehicleHealth === "Warning" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"}>
                          {c.vehicleHealth} ({c.overallComplianceScore}%)
                        </Badge>
                        <span className="text-[0.65rem] font-mono text-primary block">Safety: {c.safetyScore}%</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedVehicle(c)} className="h-7 text-[0.7rem] font-semibold gap-1">
                          <Eye className="size-3 text-primary" /> View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSPORT EXECUTIVE ANALYTICS SUMMARY */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" /> Transport Executive Analytics & AI Intelligence
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time operational, financial, passenger, driver, safety, and AI predictive insights.</p>
            </div>
            <Button size="sm" onClick={handleDownloadTransportReport} disabled={downloadingReport} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
              {downloadingReport ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />} Export Executive Report
            </Button>
          </div>

          {/* AI INSIGHTS WIDGET */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                <BrainCircuit className="size-4 text-primary" /> Institutional AI Transport Intelligence & Recommendations
              </h4>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[0.65rem]">5 Active Insights</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-xs">
              {analytics.aiInsights.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-card border border-border/80 space-y-1 shadow-2xs">
                  <span className="text-[0.62rem] font-bold font-mono text-primary block uppercase">AI Alert #{idx + 1}</span>
                  <p className="text-xs text-foreground font-medium leading-snug">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6 ANALYTICS SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* SECTION 1: OPERATIONAL ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <Gauge className="size-4 text-primary" /> Operational Telemetry Analytics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Daily Trips Executed:</span>
                  <span className="font-mono font-bold text-foreground">{analytics.dailyTrips} Trips / Day</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Monthly Trips Executed:</span>
                  <span className="font-mono font-bold text-primary">{analytics.monthlyTrips} Trips</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Average Fleet Occupancy:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.averageOccupancyPct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Route Utilization Index:</span>
                  <span className="font-mono font-bold text-amber-600">{analytics.routeUtilization}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Peak Travel Hours:</span>
                  <span className="font-mono font-semibold text-foreground text-[0.7rem]">{analytics.peakTravelHours}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Average Trip Delay:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.averageDelay}</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: FINANCIAL ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <PieChart className="size-4 text-emerald-600" /> Financial Telemetry Analytics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Monthly Transport Revenue:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.monthlyRevenue}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Monthly Fuel Cost:</span>
                  <span className="font-mono font-bold text-amber-600">{analytics.monthlyFuelCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Monthly Maintenance Cost:</span>
                  <span className="font-mono font-bold text-blue-600">{analytics.monthlyMaintenanceCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Pending Student Dues:</span>
                  <span className="font-mono font-bold text-red-600">{analytics.pendingFees}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">YoY Revenue Trend:</span>
                  <span className="font-bold text-emerald-600">{analytics.revenueTrend}</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: FLEET ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <Bus className="size-4 text-blue-600" /> Fleet Availability Analytics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Vehicles Active in Service:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.vehiclesInService} Buses</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Vehicles Under Maintenance:</span>
                  <span className="font-mono font-bold text-amber-600">{analytics.vehiclesUnderMaintenance} Buses</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Idle Fleet Vehicles:</span>
                  <span className="font-mono font-bold text-foreground">{analytics.idleVehicles} Buses</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Fleet Availability Rate:</span>
                  <span className="font-mono font-bold text-primary">{analytics.fleetAvailabilityPct}%</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: PASSENGER ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <Users className="size-4 text-purple-600" /> Passenger Usage Analytics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Student Pass Holders Share:</span>
                  <span className="font-mono font-bold text-primary">{analytics.studentUsagePct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Faculty Pass Holders Share:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.facultyUsagePct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Top Dept Usage (CSE):</span>
                  <span className="font-bold text-foreground">38% Share (426 Passes)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Highest Occupancy Route:</span>
                  <span className="font-bold text-emerald-600">Route 2 LB Nagar (100%)</span>
                </div>
              </div>
            </div>

            {/* SECTION 5: DRIVER ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <UserCheck className="size-4 text-emerald-500" /> Driver Performance Telemetry
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Driver Duty Attendance Rate:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.driverAttendancePct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Average Driver Performance Score:</span>
                  <span className="font-mono font-bold text-primary">{analytics.driverPerformanceScore}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Zero Incident Safety Index:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.safetyRatingPct}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">License Expiry Alerts:</span>
                  <span className="font-mono font-bold text-amber-600">{analytics.licenseExpiryAlertsCount} Alert (35 Days)</span>
                </div>
              </div>
            </div>

            {/* SECTION 6: SAFETY ANALYTICS */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <ShieldAlert className="size-4 text-red-500" /> Safety & Incident Analytics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Vehicle Breakdowns Logged:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.vehicleBreakdownsCount} Incidents</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Speed Violations Recorded:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.speedViolationsCount} Violations</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Panic Button Emergency Alerts:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.emergencyAlertsCount} Alerts</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">GPS Offline Telematics Units:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.gpsOfflineCount} Units</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Security Incidents Logged:</span>
                  <span className="font-mono font-bold text-emerald-600">{analytics.securityIncidentsCount} Incidents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW TAB (TAB 5): TRANSPORT POLICY & GOVERNANCE */}
      {activeTab === "governance" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Institutional Policy, Compliance & Audit Governance
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Institutional policies, government compliance metrics, fleet inspection audits, and master document repository.</p>
            </div>
            <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
              <Sliders className="size-3.5" /> Edit Governance Policies
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* POLICIES OVERVIEW CARD */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <FileText className="size-4 text-primary" /> Active Transport Institutional Policies
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-foreground block">Fee Policy:</span>
                  <p className="text-muted-foreground leading-snug">{policyGovernance.feePolicy}</p>
                </div>
                <div>
                  <span className="font-bold text-foreground block">Driver Eligibility & Safety Policy:</span>
                  <p className="text-muted-foreground leading-snug">{policyGovernance.driverPolicy}</p>
                </div>
                <div>
                  <span className="font-bold text-foreground block">Student & Pass Eligibility Rules:</span>
                  <p className="text-muted-foreground leading-snug">{policyGovernance.studentEligibility}</p>
                </div>
                <div>
                  <span className="font-bold text-foreground block">Vehicle Replacement Policy:</span>
                  <p className="text-muted-foreground leading-snug">{policyGovernance.vehicleReplacementPolicy}</p>
                </div>
                <div>
                  <span className="font-bold text-foreground block">Emergency Transport Protocol:</span>
                  <p className="text-muted-foreground leading-snug">{policyGovernance.emergencyTransportPolicy}</p>
                </div>
              </div>
            </div>

            {/* COMPLIANCE & AUDIT OVERVIEW CARD */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
                <CheckSquare className="size-4 text-emerald-600" /> Compliance Status & Audit Telemetry
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Government RTO Compliance:</span>
                  <span className="font-mono font-bold text-emerald-600">{policyGovernance.governmentCompliancePct}% Certified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Insurance Policy Coverage:</span>
                  <span className="font-mono font-bold text-emerald-600">{policyGovernance.insuranceCompliancePct}% Active</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Safety Equipment Compliance:</span>
                  <span className="font-mono font-bold text-emerald-600">{policyGovernance.safetyCompliancePct}% Verified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Pollution Standards Compliance:</span>
                  <span className="font-mono font-bold text-emerald-600">{policyGovernance.pollutionCompliancePct}% Certified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Last Fleet Audit Date:</span>
                  <span className="font-mono font-bold text-foreground">{policyGovernance.lastFleetAudit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Next Scheduled Audit:</span>
                  <span className="font-mono font-bold text-amber-600">{policyGovernance.nextScheduledAudit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Audit Grade & Status:</span>
                  <span className="font-bold text-emerald-600">{policyGovernance.auditStatus}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground font-medium">Institutional Compliance Score:</span>
                  <span className="font-mono font-bold text-primary text-sm">{policyGovernance.complianceScore} / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* DOCUMENTS REPOSITORY CARD */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FileCheck className="size-4 text-blue-600" /> Institutional Transport Master Document Repository
              </h4>
              <Badge variant="outline" className="text-[0.65rem] font-mono">{policyGovernance.documents.length} Master Docs</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Document Number</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {policyGovernance.documents.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-semibold text-foreground">{doc.title}</td>
                      <td className="py-2.5 px-3"><Badge variant="outline" className="font-mono text-[0.65rem]">{doc.category}</Badge></td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{doc.docNo}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{doc.expiry}</td>
                      <td className="py-2.5 px-3">
                        <Badge className={doc.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>{doc.status}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedDoc(doc)} className="h-7 text-[0.7rem] font-semibold gap-1">
                          <Eye className="size-3 text-primary" /> View Document
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS & ALERTS & ACTIVITIES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* EXECUTIVE QUICK ACTIONS CARD */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Executive Quick Actions
            </h3>
            <span className="text-[0.65rem] font-mono text-muted-foreground">6 Active Tools</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfigOpen(true)}
              className="justify-start gap-2.5 h-10 text-xs font-semibold hover:bg-primary/5 transition-all"
            >
              <Sliders className="size-4 text-primary shrink-0" /> Transport Policy & Governance Configuration
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsReportsOpen(true)}
              className="justify-start gap-2.5 h-10 text-xs font-semibold hover:bg-emerald-500/5 transition-all text-emerald-700 border-emerald-500/30"
            >
              <BarChart3 className="size-4 text-emerald-600 shrink-0" /> View Comprehensive Fleet Reports
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadTransportReport}
              disabled={downloadingReport}
              className="justify-start gap-2.5 h-10 text-xs font-semibold hover:bg-blue-500/5 transition-all text-blue-700 border-blue-500/30"
            >
              {downloadingReport ? <Loader2 className="size-4 animate-spin text-blue-600 shrink-0" /> : <FileText className="size-4 text-blue-600 shrink-0" />}
              Download Transport & Route Ledger
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsAuditOpen(true)}
              className="justify-start gap-2.5 h-10 text-xs font-semibold hover:bg-purple-500/5 transition-all text-purple-700 border-purple-500/30"
            >
              <ShieldCheck className="size-4 text-purple-600 shrink-0" /> Schedule Institutional Fleet Audit
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsComplianceOpen(true)}
              className="justify-start gap-2.5 h-10 text-xs font-semibold hover:bg-amber-500/5 transition-all text-amber-800 border-amber-500/30"
            >
              <Wrench className="size-4 text-amber-600 shrink-0" /> View Fleet Health & Vehicle Compliance
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab("analytics")}
              className="justify-start gap-2.5 h-10 text-xs font-semibold hover:bg-primary/5 transition-all"
            >
              <PieChart className="size-4 text-emerald-600 shrink-0" /> View Executive Analytics Summary
            </Button>
          </div>
        </div>

        {/* GOVERNANCE ALERTS CARD */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BellRing className="size-4 text-amber-500" /> Active Governance Alerts
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

        {/* RECENT ACTIVITIES TIMELINE */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Audit Trail & Recent Activities
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

      {/* VIEW DETAILS MODAL: ROUTE TELEMETRY */}
      <Dialog open={selectedRoute !== null} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Bus className="size-4 text-primary" /> Route Telemetry & Performance Ledger
            </DialogTitle>
            <DialogDescription className="text-xs">
              Read-only executive monitoring view for {selectedRoute?.routeNo} ({selectedRoute?.routeCode}).
            </DialogDescription>
          </DialogHeader>

          {selectedRoute && (
            <div className="space-y-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Route Name:</span>
                  <span className="font-semibold text-foreground text-[0.7rem]">{selectedRoute.routeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Assigned Bus / Driver:</span>
                  <span className="font-mono font-bold text-foreground">{selectedRoute.busRegNo} ({selectedRoute.driverName})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Passenger Breakdown:</span>
                  <span className="font-mono font-semibold text-primary">{selectedRoute.studentCount} Students | {selectedRoute.facultyCount} Staff</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">On-Time Rate / Delay:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedRoute.onTimePerformancePct}% (Avg {selectedRoute.avgDelay})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">GPS Tracking Signal:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedRoute.gpsStatus}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Safety Rating / Complaints:</span>
                  <span className="font-bold text-foreground">{selectedRoute.safetyRating} ({selectedRoute.complaintCount} Complaints)</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setSelectedRoute(null)} className="text-xs">
              Close Telemetry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS MODAL: PASS HOLDER */}
      <Dialog open={selectedPass !== null} onOpenChange={() => setSelectedPass(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Users className="size-4 text-primary" /> Transport Pass Holder Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Read-only pass details for {selectedPass?.studentName} ({selectedPass?.rollNo}).
            </DialogDescription>
          </DialogHeader>

          {selectedPass && (
            <div className="space-y-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Pass Number:</span>
                  <span className="font-mono font-bold text-foreground">{selectedPass.passId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">User Type & Dept:</span>
                  <span className="font-semibold text-foreground">{selectedPass.userType} - {selectedPass.department} ({selectedPass.year})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Assigned Route & Stop:</span>
                  <span className="font-mono font-bold text-primary">{selectedPass.routeNo} ({selectedPass.pickupStop})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Pass Type & Fee:</span>
                  <span className="font-bold text-emerald-600">{selectedPass.passType} - ₹{selectedPass.annualFee.toLocaleString()} ({selectedPass.paymentStatus})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Validity & Status:</span>
                  <span className="font-mono font-bold text-foreground">{selectedPass.expiryDate} ({selectedPass.passStatus})</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setSelectedPass(null)} className="text-xs">
              Close Pass Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS MODAL: VEHICLE COMPLIANCE */}
      <Dialog open={selectedVehicle !== null} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wrench className="size-4 text-amber-600" /> Vehicle Maintenance & Compliance Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Read-only vehicle compliance and safety telemetry for {selectedVehicle?.vehicleNo}.
            </DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Vehicle Reg No:</span>
                  <span className="font-mono font-bold text-foreground">{selectedVehicle.vehicleNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Type & Model:</span>
                  <span className="font-semibold text-foreground">{selectedVehicle.manufacturer} {selectedVehicle.model} ({selectedVehicle.purchaseYear})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Insurance & Permit:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedVehicle.insuranceStatus} / {selectedVehicle.permitStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Tyre & Battery Health:</span>
                  <span className="font-mono font-semibold text-foreground">{selectedVehicle.tyreHealth} | {selectedVehicle.batteryHealth}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Overall Health Score:</span>
                  <span className="font-mono font-bold text-primary text-sm">{selectedVehicle.overallComplianceScore}% (Safety: {selectedVehicle.safetyScore}%)</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setSelectedVehicle(null)} className="text-xs">
              Close Vehicle Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DOCUMENT MODAL */}
      <Dialog open={selectedDoc !== null} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileCheck className="size-4 text-blue-600" /> Master Institutional Governance Document
            </DialogTitle>
            <DialogDescription className="text-xs">
              Official university transport document repository viewer.
            </DialogDescription>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-muted/40 space-y-1.5">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Document Title:</span>
                  <span className="font-semibold text-foreground">{selectedDoc.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-mono font-bold text-primary">{selectedDoc.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Document No:</span>
                  <span className="font-mono font-bold text-foreground">{selectedDoc.docNo}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="font-mono font-bold text-foreground">{selectedDoc.expiry} ({selectedDoc.status})</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="default"
              onClick={() => {
                toast.success(`Downloaded ${selectedDoc?.title}`);
                setSelectedDoc(null);
              }}
              className="text-xs font-semibold gap-1"
            >
              <Download className="size-3.5" /> Download Document
            </Button>
            <Button variant="outline" onClick={() => setSelectedDoc(null)} className="text-xs">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK ACTION MODALS (RETAINED & FULLY FUNCTIONAL) */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="size-5 text-primary" /> Transport Policy & Governance Configuration
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure general transport settings, fee rules, vehicle/driver policies, student transport rules, GPS tracking, and notifications.
            </DialogDescription>
          </DialogHeader>

          {/* Config Tabs Switcher */}
          <div className="flex items-center gap-1.5 border-b border-border pb-2 pt-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setConfigSubTab("general")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "general" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              1. General Settings
            </button>
            <button
              type="button"
              onClick={() => setConfigSubTab("fees")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "fees" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              2. Transport Fees
            </button>
            <button
              type="button"
              onClick={() => setConfigSubTab("vehicles")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "vehicles" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              3. Vehicle Policies
            </button>
            <button
              type="button"
              onClick={() => setConfigSubTab("drivers")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "drivers" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              4. Driver Policies
            </button>
            <button
              type="button"
              onClick={() => setConfigSubTab("students")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "students" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              5. Student Policies
            </button>
            <button
              type="button"
              onClick={() => setConfigSubTab("gps")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "gps" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              6. GPS & Tracking
            </button>
            <button
              type="button"
              onClick={() => setConfigSubTab("notifications")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${configSubTab === "notifications" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              7. Notifications
            </button>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
            {/* SUBTAB 1: GENERAL SETTINGS */}
            {configSubTab === "general" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">General Transport Operational Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Transport Academic Year</Label>
                    <Input value={configForm.academicYear || "2026 - 2027"} onChange={(e) => setConfigForm({ ...configForm, academicYear: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Transport Working Days</Label>
                    <Input value={configForm.workingDays || "Mon - Sat (6 Days / Week)"} onChange={(e) => setConfigForm({ ...configForm, workingDays: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs font-semibold">Holiday Transport Schedule</Label>
                    <Textarea rows={2} value={configForm.holidaySchedule || ""} onChange={(e) => setConfigForm({ ...configForm, holidaySchedule: e.target.value })} className="text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: TRANSPORT FEE SETTINGS */}
            {configSubTab === "fees" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Transport Fee Structure & Policies</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Single Zone Fee (Annual ₹)</Label>
                    <Input type="number" value={configForm.feeStructure.singleZone} onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, singleZone: Number(e.target.value) } })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Double Zone Fee (Annual ₹)</Label>
                    <Input type="number" value={configForm.feeStructure.doubleZone} onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, doubleZone: Number(e.target.value) } })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Full Zone Fee (Annual ₹)</Label>
                    <Input type="number" value={configForm.feeStructure.fullZone} onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, fullZone: Number(e.target.value) } })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Faculty Annual Fee (Annual ₹)</Label>
                    <Input type="number" value={configForm.feeStructure.staffAnnualFee} onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, staffAnnualFee: Number(e.target.value) } })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Installment Rules</Label>
                    <Input value={configForm.feeStructure.installmentRules || ""} onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, installmentRules: e.target.value } })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Refund Policy</Label>
                    <Textarea rows={2} value={configForm.feeStructure.refundPolicy || ""} onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, refundPolicy: e.target.value } })} className="text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 3: VEHICLE POLICIES */}
            {configSubTab === "vehicles" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Vehicle Maintenance & Fleet Standards</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Standard Seating Capacity</Label>
                    <Input type="number" value={configForm.seatingCapacity || 50} onChange={(e) => setConfigForm({ ...configForm, seatingCapacity: Number(e.target.value) })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Fuel Consumption Target (Kmpl)</Label>
                    <Input value={configForm.fuelConsumptionStandards} onChange={(e) => setConfigForm({ ...configForm, fuelConsumptionStandards: e.target.value })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Preventive Maintenance Policy</Label>
                    <Textarea rows={2} value={configForm.preventiveMaintenancePolicy || ""} onChange={(e) => setConfigForm({ ...configForm, preventiveMaintenancePolicy: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Vehicle Replacement Policy</Label>
                    <Input value={configForm.vehicleReplacementPolicy || ""} onChange={(e) => setConfigForm({ ...configForm, vehicleReplacementPolicy: e.target.value })} className="h-9 text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 4: DRIVER POLICIES */}
            {configSubTab === "drivers" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Driver Eligibility & Health Regulations</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Driver Eligibility Rules</Label>
                    <Input value={configForm.driverEligibility || ""} onChange={(e) => setConfigForm({ ...configForm, driverEligibility: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">License Verification Frequency</Label>
                    <Input value={configForm.licenseVerification || ""} onChange={(e) => setConfigForm({ ...configForm, licenseVerification: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Max Daily Working Hours</Label>
                    <Input type="number" value={configForm.maxWorkingHours || 8} onChange={(e) => setConfigForm({ ...configForm, maxWorkingHours: Number(e.target.value) })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Health & Breathalyzer Check Schedule</Label>
                    <Input value={configForm.healthCheckSchedule || ""} onChange={(e) => setConfigForm({ ...configForm, healthCheckSchedule: e.target.value })} className="h-9 text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 5: STUDENT POLICIES */}
            {configSubTab === "students" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Student & Pass Discipline Rules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Boarding Point Rules</Label>
                    <Input value={configForm.boardingRules || ""} onChange={(e) => setConfigForm({ ...configForm, boardingRules: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Lost Pass Policy</Label>
                    <Input value={configForm.lostPassPolicy || ""} onChange={(e) => setConfigForm({ ...configForm, lostPassPolicy: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs font-semibold">Bus Discipline Rules</Label>
                    <Textarea rows={2} value={configForm.disciplineRules || ""} onChange={(e) => setConfigForm({ ...configForm, disciplineRules: e.target.value })} className="text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 6: GPS & TRACKING */}
            {configSubTab === "gps" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">AIS-140 GPS & Telematics Provider Settings</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">GPS Provider</Label>
                    <Input value={configForm.gpsProvider || ""} onChange={(e) => setConfigForm({ ...configForm, gpsProvider: e.target.value })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Speed Alert Limit (km/h)</Label>
                    <Input type="number" value={configForm.speedAlertLimitKmvh || 55} onChange={(e) => setConfigForm({ ...configForm, speedAlertLimitKmvh: Number(e.target.value) })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">SOS & Panic Button Tracking Integration</Label>
                    <Input value={configForm.sosTracking || ""} onChange={(e) => setConfigForm({ ...configForm, sosTracking: e.target.value })} className="h-9 text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 7: NOTIFICATIONS */}
            {configSubTab === "notifications" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Notification & Delay Alert Rules</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Route Delay Alert Threshold (Mins)</Label>
                    <Input type="number" value={configForm.routeDelayAlertMin || 10} onChange={(e) => setConfigForm({ ...configForm, routeDelayAlertMin: Number(e.target.value) })} className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Pass Expiry Warning (Days Prior)</Label>
                    <Input type="number" value={configForm.passExpiryNotificationDays || 15} onChange={(e) => setConfigForm({ ...configForm, passExpiryNotificationDays: Number(e.target.value) })} className="h-9 text-xs font-mono" />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPreviewOpen(true)} className="text-xs gap-1">
                  <Eye className="size-3.5 text-primary" /> Preview Changes
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsHistoryOpen(true)} className="text-xs gap-1">
                  <History className="size-3.5 text-muted-foreground" /> Config History
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleResetConfig} className="text-xs">
                  Reset
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsConfigOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-gradient text-white text-xs font-semibold gap-1.5">
                  <CheckCircle2 className="size-3.5" /> Save Configuration
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
