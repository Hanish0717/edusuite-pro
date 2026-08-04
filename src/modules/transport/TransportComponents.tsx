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
  DEFAULT_FLEET_HEALTH,
  DEFAULT_ANALYTICS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  DEFAULT_STAFF_SUMMARY,
  type EnhancedBusRoute,
  type EnhancedTransportPass,
  type TransportConfig,
  type FleetHealthCompliance,
  type ExecutiveTransportAnalyticsData,
  type TransportAlert,
  type TransportActivityLog,
  type TransportStaffSummary,
} from "./TransportService";

export function TransportModuleView() {
  const [routes, setRoutes] = useState<EnhancedBusRoute[]>(INITIAL_ENHANCED_ROUTES);
  const [passes, setPasses] = useState<EnhancedTransportPass[]>(INITIAL_ENHANCED_PASSES);
  const [activeTab, setActiveTab] = useState<"routes" | "passes" | "health">("routes");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Filters state for Passes tab
  const [passSearch, setPassSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterRoute, setFilterRoute] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Executive Modals State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const [configTab, setConfigTab] = useState<"fees" | "policies" | "standards">("fees");
  const [configForm, setConfigForm] = useState<TransportConfig>(DEFAULT_TRANSPORT_CONFIG);

  // Governance Telemetry
  const [fleetHealth] = useState<FleetHealthCompliance>(DEFAULT_FLEET_HEALTH);
  const [analytics] = useState<ExecutiveTransportAnalyticsData>(DEFAULT_ANALYTICS);
  const [alerts] = useState<TransportAlert[]>(INITIAL_ALERTS);
  const [activities] = useState<TransportActivityLog[]>(INITIAL_ACTIVITIES);
  const [staffSummary] = useState<TransportStaffSummary>(DEFAULT_STAFF_SUMMARY);

  const loadData = async () => {
    setLoading(true);
    const [rt, ps] = await Promise.all([fetchBusRoutes(), fetchTransportPasses()]);
    setRoutes(rt as EnhancedBusRoute[]);
    setLoading(false);
    toast.success("Transport executive governance console synced");
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRoutes = routes.filter((r) => {
    return (
      r.routeNo.toLowerCase().includes(search.toLowerCase()) ||
      r.routeName.toLowerCase().includes(search.toLowerCase()) ||
      r.busRegNo.toLowerCase().includes(search.toLowerCase()) ||
      r.driverName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredPasses = passes.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(passSearch.toLowerCase()) ||
      p.rollNo.toLowerCase().includes(passSearch.toLowerCase()) ||
      p.passId.toLowerCase().includes(passSearch.toLowerCase());
    const matchesDept = filterDept === "All" || p.department === filterDept;
    const matchesYear = filterYear === "All" || p.year === filterYear;
    const matchesRoute = filterRoute === "All" || p.routeNo === filterRoute;
    const matchesStatus = filterStatus === "All" || p.passStatus === filterStatus;

    return matchesSearch && matchesDept && matchesYear && matchesRoute && matchesStatus;
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigOpen(false);
    toast.success("Transport Policy & Governance Configuration updated!");
  };

  const handleExportCSV = () => {
    const headers = ["Route ID", "Route No", "Route Name", "Bus Reg No", "Driver", "Capacity", "Occupancy %", "Distance (km)", "Fuel Kmpl", "GPS Status", "Vehicle Health", "Status"];
    const rows = filteredRoutes.map((r) => [r.id, r.routeNo, `"${r.routeName}"`, r.busRegNo, `"${r.driverName}"`, r.capacity, `${r.occupancyPercentage}%`, r.distanceKm, r.fuelEfficiencyKmpl, `"${r.gpsStatus}"`, r.vehicleHealth, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fleet_Governance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported fleet routes report to CSV!");
  };

  const handleExportPDF = () => {
    toast.success("Fleet Reports & Transport Analytics (PDF) generated.");
  };

  const handleExportExcel = () => {
    toast.success("Fleet Operations Master Ledger (Excel) generated.");
  };

  const handleScheduleAudit = () => {
    toast.info("Institutional Fleet Audit scheduled for Thursday 10:00 AM.");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Bus className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Campus Transport & Fleet Governance
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Executive Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Executive monitoring of fleet health, route analytics, transport policies, driver compliance, and revenue.
            </p>
          </div>
        </div>

        {/* Action Buttons - Executive Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Routes
          </Button>
          <Button size="sm" onClick={() => setIsReportsOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <BarChart3 className="size-4" /> Fleet Reports
          </Button>
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Sliders className="size-4" /> Transport Configuration
          </Button>
        </div>
      </div>

      {/* TOP KPI SECTION - ROW 1: PRIMARY KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Fleet Buses</span>
            <Bus className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">24 Buses Active</p>
          <p className="text-[0.68rem] text-muted-foreground">GPS tracking enabled (100% Online)</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Active Bus Routes</span>
            <Navigation className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{routes.length} Active Routes</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Greater Hyderabad Region</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Transport Pass Holders</span>
            <Users className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">1,120 Scholars</p>
          <p className="text-[0.68rem] text-muted-foreground">1,040 Students & 80 Faculty</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Driver Compliance</span>
            <CheckCircle2 className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">100% Verified</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">RTO Commercial Heavy Licenses</p>
        </div>
      </div>

      {/* TOP KPI SECTION - ROW 2: EXECUTIVE RESPONSIVE ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">In Service</span>
          <span className="text-lg font-bold font-mono text-emerald-600">23 Active</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Under Maintenance</span>
          <span className="text-lg font-bold font-mono text-amber-600">1 Bus</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Avg Occupancy</span>
          <span className="text-lg font-bold font-mono text-primary">92.4%</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Fuel Mileage</span>
          <span className="text-lg font-bold font-mono text-foreground">4.8 Kmpl</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Trips Today</span>
          <span className="text-lg font-bold font-mono text-emerald-600">48 Trips</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Drivers On Duty</span>
          <span className="text-lg font-bold font-mono text-foreground">24 Drivers</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">GPS Active</span>
          <span className="text-lg font-bold font-mono text-blue-600">24/24 Online</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm text-center">
          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Transport Revenue</span>
          <span className="text-lg font-bold font-mono text-emerald-600">₹3.58 Cr</span>
        </div>
      </div>

      {/* EXECUTIVE VIEW TABS SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto">
        <button onClick={() => setActiveTab("routes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "routes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Fleet Overview & Route Analytics ({routes.length} Routes)
        </button>
        <button onClick={() => setActiveTab("passes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "passes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Transport Pass Monitoring ({passes.length})
        </button>
        <button onClick={() => setActiveTab("health")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "health" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Fleet Health & Compliance
        </button>
      </div>

      {/* TAB 1: FLEET OVERVIEW & ROUTE ANALYTICS */}
      {activeTab === "routes" && (
        <div className="space-y-4">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Fleet Size</span>
              <span className="text-lg font-bold font-mono text-primary">24 Buses</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Active Routes</span>
              <span className="text-lg font-bold font-mono text-emerald-600">3 Routes</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Active Drivers</span>
              <span className="text-lg font-bold font-mono text-foreground">24 Drivers</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">GPS Online</span>
              <span className="text-lg font-bold font-mono text-blue-600">24 Online</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Maintenance Due</span>
              <span className="text-lg font-bold font-mono text-amber-600">1 Bus</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Avg Occupancy</span>
              <span className="text-lg font-bold font-mono text-primary">92.4%</span>
            </div>
          </div>

          {/* FLEET OVERVIEW MONITORING TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Bus className="size-4 text-primary" /> Fleet Overview & Route Telemetry
              </h3>
              <span className="text-xs text-muted-foreground">Executive Governance View</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Route No</th>
                    <th className="py-3 px-3">Route Name & Destination</th>
                    <th className="py-3 px-3">Vehicle (Reg No)</th>
                    <th className="py-3 px-3">Driver & Phone</th>
                    <th className="py-3 px-3">Capacity & Occupancy</th>
                    <th className="py-3 px-3">Distance & Fuel</th>
                    <th className="py-3 px-3">GPS Status</th>
                    <th className="py-3 px-3">Vehicle Health</th>
                    <th className="py-3 px-3">Maintenance Due</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRoutes.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">{r.routeNo}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{r.routeName}</td>
                      <td className="py-3 px-3 font-mono font-bold">{r.busRegNo}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{r.driverName} ({r.driverPhone})</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary">{r.passHoldersCount} / {r.capacity} ({r.occupancyPercentage}%)</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{r.distanceKm} km | {r.fuelEfficiencyKmpl} Kmpl</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{r.gpsStatus}</td>
                      <td className="py-3 px-3">
                        <Badge className={r.vehicleHealth === "Optimal" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                          {r.vehicleHealth}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{r.maintenanceDue}</td>
                      <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSPORT PASS MONITORING */}
      {activeTab === "passes" && (
        <div className="space-y-4">
          {/* PASS METRICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Total Pass Holders</span>
              <span className="text-lg font-bold font-mono text-primary">1,120</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Students</span>
              <span className="text-lg font-bold font-mono text-emerald-600">1,040</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Faculty</span>
              <span className="text-lg font-bold font-mono text-purple-600">80</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Expired Passes</span>
              <span className="text-lg font-bold font-mono text-destructive">12</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Renewal Due</span>
              <span className="text-lg font-bold font-mono text-amber-600">45</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Blocked Passes</span>
              <span className="text-lg font-bold font-mono text-muted-foreground">0</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Pending Renewals</span>
              <span className="text-lg font-bold font-mono text-amber-600">18</span>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 shadow-sm space-y-0.5">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Pass Revenue</span>
              <span className="text-lg font-bold font-mono text-emerald-600">₹3.58 Cr</span>
            </div>
          </div>

          {/* QUICK FILTERS */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Filter className="size-3.5 text-primary" /> Transport Pass Telemetry Filters
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPassSearch("");
                  setFilterDept("All");
                  setFilterYear("All");
                  setFilterRoute("All");
                  setFilterStatus("All");
                }}
                className="h-7 text-[0.68rem] text-muted-foreground"
              >
                Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search pass holder..."
                  value={passSearch}
                  onChange={(e) => setPassSearch(e.target.value)}
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
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Renewal Due">Renewal Due</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PASS MONITORING TABLE */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Pass ID</th>
                    <th className="py-3 px-3">Pass Holder Name</th>
                    <th className="py-3 px-3">User Type</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Route & Pickup Stop</th>
                    <th className="py-3 px-3">Annual Fee</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Pass Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPasses.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{p.passId}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{p.studentName} ({p.rollNo})</td>
                      <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{p.userType}</Badge></td>
                      <td className="py-3 px-3">{p.department}</td>
                      <td className="py-3 px-3 font-mono text-primary font-bold">{p.routeNo} &middot; {p.pickupStop}</td>
                      <td className="py-3 px-3 font-mono font-bold text-foreground">₹{p.annualFee.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{p.expiryDate}</td>
                      <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{p.paymentStatus}</Badge></td>
                      <td className="py-3 px-3">
                        <Badge className={p.passStatus === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                          {p.passStatus}
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

      {/* TAB 3: FLEET HEALTH & COMPLIANCE */}
      {activeTab === "health" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" /> Fleet Health & RTO Compliance Status
            </h3>
            <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-xs">
              Vehicle Health Score: {fleetHealth.vehicleHealthScore} / 100
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Overall Transport Fleet Health Score</span>
              <span className="text-emerald-600 font-mono font-bold">{fleetHealth.vehicleHealthScore}% Operational Score</span>
            </div>
            <Progress value={fleetHealth.vehicleHealthScore} className="h-2 bg-muted" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" /> Insurance Expiry
              </span>
              <p className="font-bold text-foreground">{fleetHealth.insuranceExpiry}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <FileCheck className="size-3.5 text-emerald-500" /> Permit Status
              </span>
              <p className="font-bold text-foreground">{fleetHealth.permitStatus}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Gauge className="size-3.5 text-blue-500" /> Pollution Certificate
              </span>
              <p className="font-bold text-foreground">{fleetHealth.pollutionCertificate}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" /> Fitness Certificate
              </span>
              <p className="font-bold text-foreground">{fleetHealth.fitnessCertificate}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Wrench className="size-3.5 text-orange-500" /> Maintenance Schedule
              </span>
              <p className="font-bold text-foreground">{fleetHealth.maintenanceSchedule}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Navigation className="size-3.5 text-primary" /> GPS Tracking Units
              </span>
              <p className="font-bold text-foreground">{fleetHealth.gpsStatus}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> Emergency Kits
              </span>
              <p className="font-bold text-foreground">{fleetHealth.emergencyKitStatus}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" /> Fire Extinguishers
              </span>
              <p className="font-bold text-foreground">{fleetHealth.fireExtinguisherStatus}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <PieChart className="size-3.5 text-primary" /> Road Tax Status
              </span>
              <p className="font-bold text-foreground">{fleetHealth.roadTaxStatus}</p>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE TRANSPORT ANALYTICS */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <PieChart className="size-4 text-primary" /> Executive Transport Analytics
          </h3>
          <span className="text-xs text-muted-foreground font-mono">Academic Year 2025 - 2026</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Route Utilization</span>
            <span className="text-lg font-bold font-mono text-primary">{analytics.routeUtilization}%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Monthly Fuel Cost</span>
            <span className="text-lg font-bold font-mono text-amber-600">{analytics.monthlyFuelCost}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Maintenance Cost</span>
            <span className="text-lg font-bold font-mono text-foreground">{analytics.monthlyMaintenanceCost}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Transport Revenue</span>
            <span className="text-lg font-bold font-mono text-emerald-600">{analytics.transportRevenue}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Trips Completed</span>
            <span className="text-lg font-bold font-mono text-primary">{analytics.tripsCompletedToday} Trips</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase block">Vehicle Downtime</span>
            <span className="text-lg font-bold font-mono text-emerald-600">{analytics.vehicleDowntimePct}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-muted-foreground font-semibold uppercase">Peak High-Demand Routes</span>
            <p className="font-bold text-foreground">{analytics.peakRoutes}</p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-muted-foreground font-semibold uppercase">Low Utilization Routes</span>
            <p className="font-bold text-foreground">{analytics.lowUsageRoutes}</p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & ALERTS & ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* EXECUTIVE QUICK ACTIONS */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Executive Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" onClick={() => setIsConfigOpen(true)} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <Sliders className="size-3.5 text-primary" /> Transport Policy & Governance Configuration
            </Button>

            <Button variant="outline" onClick={() => setIsReportsOpen(true)} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <BarChart3 className="size-3.5 text-emerald-600" /> View Comprehensive Fleet Reports
            </Button>

            <Button variant="outline" onClick={handleExportCSV} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <FileText className="size-3.5 text-blue-600" /> Download Transport & Route Ledger
            </Button>

            <Button variant="outline" onClick={handleScheduleAudit} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <ShieldCheck className="size-3.5 text-purple-600" /> Schedule Institutional Fleet Audit
            </Button>

            <Button variant="outline" onClick={() => setActiveTab("health")} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <Wrench className="size-3.5 text-amber-600" /> View Fleet Health & Vehicle Compliance
            </Button>

            <Button variant="outline" onClick={handleExportPDF} className="justify-start gap-2.5 h-9 text-xs font-semibold">
              <PieChart className="size-3.5 text-emerald-600" /> View Executive Analytics Summary
            </Button>
          </div>
        </div>

        {/* TRANSPORT GOVERNANCE ALERTS */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BellRing className="size-4 text-amber-500" /> Governance Alerts
            </h3>
            <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">{alerts.length} Active</Badge>
          </div>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {alt.severity === "high" ? (
                      <ShieldAlert className="size-3.5 text-destructive shrink-0" />
                    ) : alt.severity === "medium" ? (
                      <AlertCircle className="size-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <BellRing className="size-3.5 text-primary shrink-0" />
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

        {/* RECENT TRANSPORT ACTIVITIES & STAFF SUMMARY */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Audit Trail & Staff Summary
            </h3>
          </div>

          <div className="space-y-2 text-xs border-b border-border/60 pb-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-semibold">Transport Manager:</span>
              <span className="font-bold text-foreground">{staffSummary.transportManager}</span>
            </div>
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-muted-foreground">Fleet Crew:</span>
              <span className="font-mono text-primary font-bold">{staffSummary.driversCount} Drivers | {staffSummary.mechanicsCount} Mechanics</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="p-2 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
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

      {/* DIALOG 1: TRANSPORT CONFIGURATION */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="size-5 text-primary" /> Institutional Transport Policy & Governance Rules
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure fee structures, GPS standards, fuel consumption benchmarks, driver compliance rules, timings, and holiday schedules.
            </DialogDescription>
          </DialogHeader>

          {/* Configuration Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2 pt-1">
            <button
              type="button"
              onClick={() => setConfigTab("fees")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "fees" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              1. Fees & Eligibility
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("policies")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "policies" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              2. Policies & GPS Standards
            </button>
            <button
              type="button"
              onClick={() => setConfigTab("standards")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${configTab === "standards" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              3. Inspection & Driver Rules
            </button>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
            {/* TAB 1: FEES */}
            {configTab === "fees" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Transport Fee Structure & Zone Categories</h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Single Zone Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.singleZone}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, singleZone: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Double Zone Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.doubleZone}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, doubleZone: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Full Zone Fee (Annual ₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.fullZone}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, fullZone: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Staff Annual Fee (₹)</Label>
                    <Input
                      type="number"
                      value={configForm.feeStructure.staffAnnualFee}
                      onChange={(e) => setConfigForm({ ...configForm, feeStructure: { ...configForm.feeStructure, staffAnnualFee: Number(e.target.value) } })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Student Eligibility & Clearance Rules</Label>
                  <Textarea rows={2} value={configForm.eligibilityRules} onChange={(e) => setConfigForm({ ...configForm, eligibilityRules: e.target.value })} className="text-xs" />
                </div>
              </div>
            )}

            {/* TAB 2: POLICIES & GPS */}
            {configTab === "policies" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Transport Policies & Telematics</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">GPS Telematics & AIS-140 Configuration</Label>
                    <Textarea rows={2} value={configForm.gpsConfig} onChange={(e) => setConfigForm({ ...configForm, gpsConfig: e.target.value })} className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Fuel Consumption Benchmark Standards</Label>
                    <Textarea rows={2} value={configForm.fuelConsumptionStandards} onChange={(e) => setConfigForm({ ...configForm, fuelConsumptionStandards: e.target.value })} className="text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Staff Transport Allocation Policy</Label>
                  <Input value={configForm.staffTransportPolicy} onChange={(e) => setConfigForm({ ...configForm, staffTransportPolicy: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>
            )}

            {/* TAB 3: STANDARDS */}
            {configTab === "standards" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Inspection Schedules & Driver Compliance</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Vehicle Inspection & RTO Audit Schedule</Label>
                    <Textarea rows={2} value={configForm.vehicleInspectionSchedule} onChange={(e) => setConfigForm({ ...configForm, vehicleInspectionSchedule: e.target.value })} className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Driver Compliance & Alcohol Policy</Label>
                    <Textarea rows={2} value={configForm.driverComplianceRules} onChange={(e) => setConfigForm({ ...configForm, driverComplianceRules: e.target.value })} className="text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Emergency Escalation Contacts</Label>
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

      {/* DIALOG 2: FLEET REPORTS */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" /> Institutional Fleet Executive Reports
            </DialogTitle>
            <DialogDescription className="text-xs">
              Generate and download comprehensive fuel usage, maintenance, driver performance, and GPS telematics reports.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => toast.success("Monthly Fleet Utilization Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <FileText className="size-4 text-primary" /> Monthly Fleet Report
            </Button>

            <Button variant="outline" onClick={() => toast.success("Fuel Mileage & Efficiency Audit generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <Fuel className="size-4 text-amber-600" /> Fuel Usage & Mileage Report
            </Button>

            <Button variant="outline" onClick={() => toast.success("Vehicle Servicing & Repair Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <Wrench className="size-4 text-blue-600" /> Maintenance & Repair Report
            </Button>

            <Button variant="outline" onClick={() => toast.success("Driver Performance & Compliance Audit generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <UserCheck className="size-4 text-purple-600" /> Driver Performance Audit
            </Button>

            <Button variant="outline" onClick={() => toast.success("Route Efficiency & Load Factor Report generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <Navigation className="size-4 text-emerald-600" /> Route Performance Audit
            </Button>

            <Button variant="outline" onClick={() => toast.success("AIS-140 GPS Telematics Summary generated")} className="justify-start gap-2.5 h-11 text-xs font-semibold">
              <Gauge className="size-4 text-primary" /> GPS Telematics & Speed Audit
            </Button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button size="sm" variant="outline" onClick={handleExportPDF} className="h-9 gap-1.5 text-xs font-semibold">
              <FileText className="size-3.5 text-destructive" /> Export PDF
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-9 gap-1.5 text-xs font-semibold">
              <FileSpreadsheet className="size-3.5 text-emerald-600" /> Export Excel
            </Button>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsReportsOpen(false)} className="text-xs">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
