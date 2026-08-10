import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Lock,
  Search,
  RefreshCw,
  Download,
  Eye,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Filter,
  X,
  BarChart3,
  Sparkles,
  Printer,
  Bell,
  CheckCircle,
  AlertCircle,
  Database,
  Server,
  ArrowRight,
  User,
  Archive,
  History,
  FileText,
  SlidersHorizontal,
  HardDrive
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

import { KpiCard } from "@/components/dashboard/kpi-card";
import { DonutChart, GroupedBarChart, ChartLegend } from "@/components/dashboard/charts";

import {
  MOCK_AUDIT_LOGS,
  MOCK_SECURITY_EVENTS,
  MOCK_SYSTEM_HEALTH,
  MODULE_USAGE_CHART,
  STATUS_BREAKDOWN_CHART,
  type AuditLog,
  type SecurityEvent,
  type AuditStatus,
  type AuditPriority,
  type AuditModule,
} from "@/data/audit-logs-mock";

function statusBadgeClass(status: AuditStatus) {
  switch (status) {
    case "Success":
      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Warning":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Failed":
      return "text-destructive border-destructive/20 bg-destructive/5";
    case "Pending":
    default:
      return "text-primary border-primary/20 bg-primary/5";
  }
}

function priorityBadgeClass(priority: AuditPriority) {
  switch (priority) {
    case "Critical":
      return "text-destructive border-destructive/20 bg-destructive/5 font-bold";
    case "High":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Medium":
      return "text-primary border-primary/20 bg-primary/5";
    case "Low":
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
}

export function AuditLogsModuleView() {
  // ── States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [auditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [securityEvents] = useState<SecurityEvent[]>(MOCK_SECURITY_EVENTS);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "logs" | "security" | "timeline" | "health" | "analytics" | "reports" | "retention"
  >("logs");

  // Selection & Details Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleResetFilters = () => {
    setSearchQuery("");
    setModuleFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
    toast.success("Filters reset successfully.");
  };

  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 600);
  };

  // ── Filter Computations ─────────────────────────────────────
  const filteredLogs = useMemo(() => {
    return auditLogs
      .filter((log) => {
        const matchesSearch =
          log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMod = moduleFilter === "all" || log.module === moduleFilter;
        const matchesStat = statusFilter === "all" || log.status === statusFilter;
        const matchesPri = priorityFilter === "all" || log.priority === priorityFilter;

        return matchesSearch && matchesMod && matchesStat && matchesPri;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        if (sortBy === "oldest") return a.id.localeCompare(b.id);
        if (sortBy === "critical") return a.priority === "Critical" ? -1 : 1;
        return 0;
      });
  }, [auditLogs, searchQuery, moduleFilter, statusFilter, priorityFilter, sortBy]);

  // ── Metrics Computation ─────────────────────────────────────
  const metrics = useMemo(() => {
    const totalActivities = 1648;
    const todaysActivities = 142;
    const successActions = 1580;
    const failedActions = 18;
    const criticalActivities = auditLogs.filter((l) => l.priority === "Critical").length;
    const pendingReviews = 12;
    const activeUsers = 84;
    const securityAlerts = securityEvents.length;

    return { totalActivities, todaysActivities, successActions, failedActions, criticalActivities, pendingReviews, activeUsers, securityAlerts };
  }, [auditLogs, securityEvents]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted/40 animate-pulse rounded-xl border border-border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 border rounded-2xl bg-card text-center space-y-4 shadow-sm">
        <AlertTriangle className="size-10 text-destructive mx-auto" />
        <h3 className="text-base font-bold text-foreground">Failed to load audit logs</h3>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={triggerReload} className="bg-brand-gradient text-white font-semibold">
          <RefreshCw className="size-3.5 mr-1.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-xs leading-normal">
      
      {/* ── 1. PAGE HEADER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Audit Logs & Activity Tracking
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Audit Logs & System Security</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Track every academic action, system activity, approvals, and configuration changes performed within the Academic Management module.
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm" onClick={triggerReload} className="h-9 gap-1.5 font-semibold text-xs">
            <RefreshCw className="size-3.5" /> Refresh Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Archived 1,200 audit logs older than 90 days.")}
            className="h-9 gap-1.5 font-semibold text-xs border-amber-300 text-amber-600 hover:bg-amber-50"
          >
            <Archive className="size-3.5" /> Archive Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Downloaded full PDF audit security audit report.")}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Printer className="size-3.5" /> Download Report
          </Button>
          <Button
            onClick={() => toast.success("Exported 1,648 activity logs to CSV format!")}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Download className="size-3.5" /> Export Logs
          </Button>
        </div>
      </div>

      {/* ── 2. SUMMARY DASHBOARD KPI CARDS ─────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Total Activities" value={String(metrics.totalActivities)} icon={Activity} tone="primary" />
        <KpiCard label="Today's Actions" value={String(metrics.todaysActivities)} icon={Clock} tone="info" />
        <KpiCard label="Successful Actions" value={String(metrics.successActions)} icon={CheckCircle2} tone="success" />
        <KpiCard label="Failed Actions" value={String(metrics.failedActions)} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Critical Events" value={String(metrics.criticalActivities)} icon={Lock} tone="destructive" />
        <KpiCard label="Pending Reviews" value={String(metrics.pendingReviews)} icon={Clock} tone="warning" />
        <KpiCard label="Active Users Today" value={String(metrics.activeUsers)} icon={UserCheck} tone="success" />
        <KpiCard label="Security Alerts" value={String(metrics.securityAlerts)} icon={Bell} tone="warning" />
      </div>

      {/* ── 3. MAIN TAB NAVIGATION ─────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {[
            { id: "logs", label: "Master Audit Trail", icon: Activity },
            { id: "security", label: `Security Events (${metrics.securityAlerts})`, icon: Lock },
            { id: "timeline", label: "Activity Timeline", icon: History },
            { id: "health", label: "System Health", icon: Server },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "reports", label: "Audit Reports", icon: Printer },
            { id: "retention", label: "Data Retention", icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => toast.success("Refreshed live audit event pipeline.")}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Sparkles className="size-3.5" /> Live Log Stream
        </Button>
      </div>

      {/* ── 4. SEARCH & FILTERS TOOLBAR ───────────────────── */}
      <div className="flex items-center justify-between border rounded-2xl bg-card p-3 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search user, action, log ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-[180px]"
            />
          </div>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="h-8 text-xs w-[130px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="Results">Results</SelectItem>
              <SelectItem value="Faculty Management">Faculty Management</SelectItem>
              <SelectItem value="Notifications">Notifications</SelectItem>
              <SelectItem value="Attendance">Attendance</SelectItem>
              <SelectItem value="Settings">Settings</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-[95px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="critical">Critical First</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
            <X className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
            {filteredLogs.length} Audit Entries
          </Badge>
        </div>
      </div>

      {/* ── 5. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: Master Audit Trail Table */}
      {activeTab === "logs" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Activity className="size-5 text-primary" /> Master Institutional Audit & Activity Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Activity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{log.id}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-muted-foreground">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground">{log.user}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{log.role} &middot; {log.department}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold">{log.module}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{log.activity}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(log.status)}`}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${priorityBadgeClass(log.priority)}`}>
                        {log.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedLog(log); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer font-semibold">
                        <Eye className="size-3.5 mr-1" /> Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Security Events */}
      {activeTab === "security" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Lock className="size-5 text-destructive" /> Security Events & Unauthorized Access Alerts
          </h3>

          <div className="space-y-3">
            {securityEvents.map((sec) => (
              <div key={sec.id} className="p-4 border rounded-xl flex items-center justify-between bg-destructive/5 border-destructive/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] font-mono text-destructive border-destructive/30 uppercase">{sec.severity}</Badge>
                    <span className="font-bold text-xs text-foreground">{sec.eventType}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{sec.details}</p>
                  <span className="text-[9px] font-mono text-muted-foreground block">{sec.user} &middot; IP: {sec.ipAddress} &middot; {sec.time}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Investigating event ${sec.id}...`)} className="h-7 text-[10px]">
                  Investigate
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Activity Timeline */}
      {activeTab === "timeline" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <History className="size-5 text-primary" /> Chronological User Activity Stream
          </h3>

          <div className="space-y-4 pl-4 border-l-2 border-primary/20">
            {auditLogs.map((log) => (
              <div key={log.id} className="relative pl-6 space-y-1">
                <div className="absolute -left-[31px] top-1 size-3.5 rounded-full bg-primary ring-4 ring-card" />
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                  <span>{log.timestamp}</span>
                  <Badge variant="outline" className="text-[8px]">{log.module}</Badge>
                </div>
                <h4 className="font-bold text-xs text-foreground">{log.activity} by {log.user}</h4>
                <p className="text-[11px] text-muted-foreground">{log.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: System Health */}
      {activeTab === "health" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Server className="size-5 text-primary" /> System Health & API Telemetry Monitor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SYSTEM_HEALTH.map((sh) => (
              <div key={sh.id} className="p-4 border rounded-xl flex items-center justify-between bg-emerald-50/30 border-emerald-200 dark:bg-emerald-500/5">
                <div>
                  <h4 className="font-bold text-xs text-foreground">{sh.serviceName}</h4>
                  <span className="text-[9px] font-mono text-muted-foreground">Latency: {sh.latency}</span>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 border-emerald-300 bg-emerald-50">{sh.status}</Badge>
                  <span className="text-[10px] font-mono font-bold block mt-1">{sh.uptime} Uptime</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Module Audit Volume</h4>
            <GroupedBarChart
              data={MODULE_USAGE_CHART as any}
              xKey="name"
              series={[{ key: "Activity", label: "Log Count" }]}
              height={200}
            />
          </div>

          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Action Status Breakdown</h4>
            <DonutChart data={STATUS_BREAKDOWN_CHART} height={180} centerLabel="Actions" />
            <ChartLegend items={STATUS_BREAKDOWN_CHART} />
          </div>
        </div>
      )}

      {/* TAB 6: Reports */}
      {activeTab === "reports" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Printer className="size-5 text-primary" /> Audit & Compliance Audit Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              "Institutional Security Audit Report",
              "User Activity Log Summary",
              "Approval Center Sign-off Audit",
              "Configuration Change History",
              "Module Operations Log",
              "NAAC Compliance Audit Ledger",
            ].map((rep) => (
              <div key={rep} className="p-3.5 border rounded-xl flex items-center justify-between bg-muted/10">
                <span className="font-semibold text-xs text-foreground">{rep}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Exporting ${rep}...`)} className="h-7 text-[10px]">
                  <Download className="size-3 mr-1" /> PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Data Retention Settings */}
      {activeTab === "retention" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Database className="size-5 text-primary" /> Data Retention & Automated Archiving Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-xl space-y-2 bg-muted/10">
              <span className="font-bold text-xs text-foreground block">Log Retention Period</span>
              <p className="text-[10px] text-muted-foreground">Audit logs are retained live for 365 days before cold storage archive.</p>
              <Badge variant="outline" className="font-mono text-xs text-primary">365 Days Retention</Badge>
            </div>
            <div className="p-4 border rounded-xl space-y-2 bg-muted/10">
              <span className="font-bold text-xs text-foreground block">Automated Archive Schedule</span>
              <p className="text-[10px] text-muted-foreground">Cold backup archives created on the 1st of every month.</p>
              <Badge variant="outline" className="font-mono text-xs text-emerald-600 border-emerald-300">Monthly Backup Active</Badge>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. DETAILS DIALOG WITH BEFORE/AFTER DIFF ─────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl text-xs leading-normal max-h-[90vh] overflow-y-auto">
          {selectedLog && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{selectedLog.id}</Badge>
                  <Badge variant="outline" className={`text-[9px] uppercase ${priorityBadgeClass(selectedLog.priority)}`}>
                    {selectedLog.priority}
                  </Badge>
                  <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(selectedLog.status)}`}>
                    {selectedLog.status}
                  </Badge>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">{selectedLog.activity}</DialogTitle>
                <DialogDescription>{selectedLog.module} &middot; {selectedLog.timestamp}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Activity Description</span>
                  <p className="text-foreground leading-relaxed">{selectedLog.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 border rounded-xl p-3 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Performed By</span>
                    <p className="font-bold text-foreground mt-0.5">{selectedLog.user} ({selectedLog.role})</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department</span>
                    <p className="font-bold text-foreground mt-0.5">{selectedLog.department}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Affected Record</span>
                    <p className="font-bold font-mono text-primary mt-0.5">{selectedLog.affectedRecord}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">IP & Device</span>
                    <p className="font-bold font-mono text-muted-foreground mt-0.5">{selectedLog.ipAddress} ({selectedLog.device})</p>
                  </div>
                </div>

                {/* BEFORE-AND-AFTER CHANGE HISTORY COMPARISON */}
                {selectedLog.changeHistory && selectedLog.changeHistory.length > 0 && (
                  <div className="border rounded-xl p-3.5 space-y-2 bg-card">
                    <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <History className="size-4 text-primary" /> Before & After Change Comparison
                    </h4>
                    <div className="space-y-2 pt-1">
                      {selectedLog.changeHistory.map((ch) => (
                        <div key={ch.field} className="p-2.5 border rounded-lg bg-muted/10 text-[10px] space-y-1.5">
                          <span className="font-bold text-foreground block uppercase font-mono text-[9px]">{ch.field}</span>
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="p-2 border rounded bg-destructive/5 text-destructive border-destructive/20 font-mono">
                              <span className="text-[8px] uppercase block text-muted-foreground">Old Value</span>
                              <span className="font-bold">{ch.oldValue}</span>
                            </div>
                            <div className="p-2 border rounded bg-emerald-50 text-emerald-600 border-emerald-200 font-mono">
                              <span className="text-[8px] uppercase block text-muted-foreground">New Value</span>
                              <span className="font-bold">{ch.newValue}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
