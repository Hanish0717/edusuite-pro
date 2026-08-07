import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  UserCog,
  Building2,
  IndianRupee,
  Activity,
  Plus,
  RefreshCw,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Database,
  Brain,
  Shield,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Lock,
  Server,
  Terminal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LockKeyhole,
  Bell,
  BellRing,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  Mail,
  MessageSquare,
  FileText,
  Sparkles,
  Check,
  X,
  PieChart,
  Cpu,
  HardDrive,
  MailCheck,
  ShieldAlert,
  Gauge,
  Send,
  Share2,
  School,
  BarChart3,
  Layers,
  Zap,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  useSuperAdmin,
  type SortField,
} from "./useSuperAdmin";
import type { SuperAdminUser, DepartmentItem, AuditLogItem, RolePermissionMatrixItem } from "./SuperAdminService";

const ROLES = [
  "All Roles",
  "super_admin",
  "admin",
  "principal",
  "dean",
  "hod",
  "faculty",
  "student",
  "finance",
  "hr",
];

const STATUSES = ["All Statuses", "Active", "Inactive", "Suspended"];

export function SuperAdminModuleView() {
  const {
    activeTab,
    setActiveTab,
    stats,
    users,
    departments,
    auditLogs,
    rolePermissions,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    sortField,
    sortOrder,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    selectedUserIds,
    handleSelectAllOnPage,
    handleSelectUser,
    loading,
    backupLoading,
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    isViewUserOpen,
    setIsViewUserOpen,
    isAddDeptOpen,
    setIsAddDeptOpen,
    selectedUser,
    userFormData,
    setUserFormData,
    deptFormData,
    setDeptFormData,
    loadData,
    handleOpenAddUser,
    handleOpenEditUser,
    handleOpenViewUser,
    handleAddUserSubmit,
    handleEditUserSubmit,
    handleDeleteUser,
    handleBulkDelete,
    handleBulkUpdateStatus,
    handleOpenAddDept,
    handleAddDeptSubmit,
    handleTogglePermission,
    handleTriggerBackup,
    handleExportCSV,
  } = useSuperAdmin();

  // -------------------------------------------------------------------------
  // EXECUTIVE DASHBOARD STATE (DYNAMIC REALISTIC SIMULATION & STATEFUL ACTIONS)
  // -------------------------------------------------------------------------
  const [executiveAlerts, setExecutiveAlerts] = useState([
    {
      id: "ALT-001",
      title: "Attendance below threshold in ECE",
      description: "Average student attendance in ECE Sem VI dropped to 78.2%, falling below the mandatory 80% institutional threshold.",
      priority: "Critical",
      category: "Academics",
      department: "Electronics & Comm. Engg.",
      timestamp: "10 mins ago",
      status: "Action Needed",
    },
    {
      id: "ALT-002",
      title: "Fee collection pending for 48 students",
      description: "Semester tuition fee installments for 48 students in Mechanical Engineering are overdue by more than 14 days.",
      priority: "High",
      category: "Finance",
      department: "Mechanical Engineering",
      timestamp: "1 hour ago",
      status: "Pending",
    },
    {
      id: "ALT-003",
      title: "Library software license expires in 7 days",
      description: "Enterprise LMS & IEEE Digital Library subscription renewal invoice requires clearance by finance committee.",
      priority: "Medium",
      category: "Infrastructure",
      department: "Central Library",
      timestamp: "3 hours ago",
      status: "Warning",
    },
    {
      id: "ALT-004",
      title: "NAAC document submission due",
      description: "Self-Study Report (SSR) Criterion 4 documentation requires final VC & Academic Council verification.",
      priority: "Critical",
      category: "Accreditation",
      department: "IQAC Cell",
      timestamp: "5 hours ago",
      status: "Urgent",
    },
    {
      id: "ALT-005",
      title: "Semester registration completed successfully",
      description: "100% course registrations completed for 2026-27 Even Semester across all undergraduate engineering programs.",
      priority: "Low",
      category: "Operations",
      department: "Academic Affairs",
      timestamp: "1 day ago",
      status: "Completed",
    },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "APP-001",
      title: "Faculty Medical Leave Request",
      category: "Leave Requests",
      count: 4,
      priority: "Medium",
      requestedBy: "Dr. A. Sharma (HOD ECE)",
      submittedDate: "Today 09:30 AM",
      details: "14 days medical leave request for post-surgery recovery with temporary workload reassignment to Prof. Kapoor.",
    },
    {
      id: "APP-002",
      title: "Robotics Lab Equipment Purchase Requisition",
      category: "Purchase Requests",
      count: 2,
      priority: "High",
      requestedBy: "ECE Lab Admin",
      submittedDate: "Yesterday 04:15 PM",
      details: "Purchase request for 10 ARM Cortex-M4 development boards and sensor kits (Est. ₹1.85 Lakhs).",
    },
    {
      id: "APP-003",
      title: "Associate Professor Seniority Promotion Dossier",
      category: "Faculty Promotions",
      count: 3,
      priority: "High",
      requestedBy: "HR Dean Office",
      submittedDate: "Aug 2, 2026",
      details: "Career Advancement Scheme (CAS) promotion dossier for 3 Assistant Professors to Associate level.",
    },
    {
      id: "APP-004",
      title: "New AI Elective Course Introduction Request",
      category: "Department Requests",
      count: 1,
      priority: "Medium",
      requestedBy: "HOD CSE",
      submittedDate: "Aug 1, 2026",
      details: "Inclusion of 'Generative AI Architecture' as a 3-credit professional elective in Semester VII.",
    },
    {
      id: "APP-005",
      title: "Annual R&D Research Infrastructure Grant",
      category: "Budget Requests",
      count: 5,
      priority: "Critical",
      requestedBy: "Finance Committee",
      submittedDate: "Today 08:15 AM",
      details: "Capital expenditure approval for GPU AI Compute Server Cluster (Est. ₹14.5 Lakhs).",
    },
    {
      id: "APP-006",
      title: "NPTEL Online Course Credit Transfer Batch",
      category: "NPTEL Verification",
      count: 12,
      priority: "Low",
      requestedBy: "Academic Cell",
      submittedDate: "Jul 31, 2026",
      details: "Credit equivalence verification for 42 students completing NPTEL Swayam certifications.",
    },
    {
      id: "APP-007",
      title: "Fiber Optic Backbone Upgrade Request",
      category: "Infrastructure Requests",
      count: 3,
      priority: "Medium",
      requestedBy: "IT Network Head",
      submittedDate: "Aug 3, 2026",
      details: "10 Gbps core optical fiber backbone extension to New Academic Block C.",
    },
  ]);

  // Modal Dialog States for Executive Dashboard
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState("All Institutional Roles");

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isCommCenterOpen, setIsCommCenterOpen] = useState(false);

  // Department options for filter
  const departmentOptions = [
    "All Departments",
    ...Array.from(new Set(departments.map((d) => d.name))),
  ];

  const allOnPageSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedUserIds.includes(u.id));

  // Executive Approval Handlers
  const handleApproveApproval = (id: string, title: string) => {
    setPendingApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count: Math.max(0, item.count - 1) } : item))
    );
    toast.success(`Approved: ${title}`);
    if (isApprovalModalOpen) setIsApprovalModalOpen(false);
  };

  const handleRejectApproval = (id: string, title: string) => {
    setPendingApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count: Math.max(0, item.count - 1) } : item))
    );
    toast.error(`Rejected: ${title}`);
    if (isApprovalModalOpen) setIsApprovalModalOpen(false);
  };

  const handleGenerateReport = () => {
    toast.loading("Compiling Executive Institutional Performance Report...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Executive Performance Report PDF compiled and exported!");
    }, 1500);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    toast.success(`Broadcasting announcement to target: ${announcementTarget}`);
    setAnnouncementText("");
    setIsAnnouncementModalOpen(false);
  };

  const handleRefreshAll = async () => {
    await loadData();
    toast.success("Dashboard metrics refreshed with live institutional state");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Super Admin Cockpit & Controller
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                System Superuser
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Global platform administration, institutional metrics, user RBAC, and database backups.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <Download className="size-3.5" /> Export Roster
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerBackup}
            disabled={backupLoading}
            className="h-9 gap-2 text-xs font-medium border-primary/40 text-primary hover:bg-primary/10"
          >
            <Database className={`size-3.5 ${backupLoading ? "animate-bounce" : ""}`} />
            {backupLoading ? "Backing up..." : "Trigger Backup"}
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAddUser}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Plus className="size-4" /> Register Global User
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Enrolled Students</span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">
            {stats.totalStudents.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-muted-foreground">Across all departments</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Staff & Faculty</span>
            <UserCog className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">
            {stats.totalStaff.toLocaleString("en-IN")}
          </p>
          <p className="text-[0.68rem] text-muted-foreground">Active faculty & admins</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Active Departments</span>
            <Building2 className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            {departments.length}
          </p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">NBA / NAAC Accredited</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Institutional Revenue</span>
            <IndianRupee className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">{stats.totalRevenue}</p>
          <p className="text-[0.68rem] text-muted-foreground">Fiscal year collections</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Overview &amp; System Health
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "departments"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "rbac"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Role &amp; Permission Matrix
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "audit"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "ai"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          AI &amp; Analytics
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM HEALTH (EXECUTIVE COCKPIT) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* SECTION 11 & SECTION 10: EXTENDED SYSTEM MONITOR & OPERATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* System Health Card (EXTENDED WITH SECTION 11 REQS) */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Activity className="size-5 text-emerald-500" /> Infrastructure Node Cluster Monitor
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
                  All Systems Operational
                </Badge>
              </div>

              {/* Original Monitor Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex justify-between items-center font-mono">
                  <span className="text-muted-foreground font-sans">API Latency:</span>
                  <span className="font-bold text-emerald-600">{stats.apiLatency}</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex justify-between items-center font-mono">
                  <span className="text-muted-foreground font-sans">SSL Certificate:</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex justify-between items-center font-mono">
                  <span className="text-muted-foreground font-sans">24h Error Rate:</span>
                  <span className="font-bold text-foreground">{stats.errorRate}</span>
                </div>
              </div>

              {/* Extended Resource & Health Status Grid (Section 11) */}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Extended System Resource & Infrastructure Health
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><Cpu className="size-3 text-primary" /> CPU Usage</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-sm">28%</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><Gauge className="size-3 text-blue-500" /> RAM Usage</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-sm">42% <span className="text-[0.65rem] text-muted-foreground font-normal">(13.4GB)</span></p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><Database className="size-3 text-purple-500" /> DB Cluster</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-xs truncate">Synced (12ms)</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><MailCheck className="size-3 text-emerald-500" /> SMTP Status</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-xs">Operational</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><HardDrive className="size-3 text-amber-500" /> Storage</span>
                      <Badge className="bg-amber-500/10 text-amber-600 text-[0.6rem] px-1 py-0 h-4">Warning</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-xs">64% <span className="text-[0.65rem] text-muted-foreground font-normal">(1.4TB)</span></p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><ShieldAlert className="size-3 text-emerald-500" /> Security</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-xs">0 Active Threat</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><Clock className="size-3 text-primary" /> Last Backup</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-xs">Today 04:00 AM</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium"><RefreshCw className="size-3 text-blue-500" /> Last Sync</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.6rem] px-1 py-0 h-4">Healthy</Badge>
                    </div>
                    <p className="font-mono font-bold text-foreground text-xs">2 mins ago</p>
                  </div>
                </div>
              </div>

              {/* Original Node Cluster List */}
              <div className="space-y-2 pt-1">
                {stats.systemHealth.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <Server className="size-4 text-primary" /> {item.label}
                    </span>
                    <Badge variant="secondary" className="font-mono text-[0.68rem]">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Shortcuts Panel (EXTENDED WITH SECTION 10 REQS) */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Terminal className="size-5 text-primary" /> Super Admin Operations
              </h3>

              <div className="space-y-2">
                {/* Existing Operations Buttons */}
                <Button
                  onClick={handleOpenAddUser}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-9"
                >
                  <Plus className="size-4" /> Register New Global User
                </Button>

                <Button
                  onClick={handleTriggerBackup}
                  disabled={backupLoading}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 h-9"
                >
                  <Database className="size-4" /> Trigger Database Backup
                </Button>

                <Button
                  onClick={() => setActiveTab("rbac")}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                >
                  <LockKeyhole className="size-4 text-amber-500" /> Manage Role Privileges
                </Button>

                <Button
                  onClick={() => setActiveTab("audit")}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                >
                  <FileSpreadsheet className="size-4 text-blue-500" /> View Audit Trail Logs
                </Button>

                {/* Section 10 Additional Quick Actions */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Executive Control Actions
                  </p>
                  
                  <Button
                    onClick={handleOpenAddDept}
                    className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                  >
                    <Building2 className="size-4 text-emerald-600" /> Create Department
                  </Button>

                  <Button
                    onClick={() => setIsAnnouncementModalOpen(true)}
                    className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                  >
                    <Send className="size-4 text-purple-600" /> Send Announcement
                  </Button>

                  <Button
                    onClick={handleGenerateReport}
                    className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                  >
                    <FileText className="size-4 text-indigo-600" /> Generate Institutional Report
                  </Button>

                  <Button
                    onClick={() => setIsCalendarModalOpen(true)}
                    className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                  >
                    <Calendar className="size-4 text-rose-600" /> Configure Academic Calendar
                  </Button>

                  <Button
                    onClick={() => setActiveTab("ai")}
                    className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                  >
                    <BarChart3 className="size-4 text-amber-600" /> View Analytics & AI Engine
                  </Button>

                  <Button
                    onClick={() => setActiveTab("departments")}
                    className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-9"
                  >
                    <Layers className="size-4 text-teal-600" /> Manage Departments
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 9: INSTITUTION HEALTH SCORE (ENTERPRISE SCORECARD) */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <PieChart className="size-5 text-primary" /> Institutional Enterprise Health Cockpit
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time composite health index evaluating governance, academics, security, and finance.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Overall Index Score:</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-sm font-mono font-bold px-2.5 py-0.5">
                  94 / 100 (Optimal)
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5"><School className="size-4 text-primary" /> Overall Health</span>
                  <span className="text-emerald-600 font-mono font-bold">94%</span>
                </div>
                <Progress value={94} className="h-2.5" />
                <p className="text-[0.68rem] text-muted-foreground">Composite institution rating across all 6 core operational verticals.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5"><BookOpen className="size-4 text-blue-500" /> Academic Health</span>
                  <span className="text-blue-600 font-mono font-bold">92%</span>
                </div>
                <Progress value={92} className="h-2.5" />
                <p className="text-[0.68rem] text-muted-foreground">Syllabus coverage on schedule; 91.5% average student attendance.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5"><Server className="size-4 text-emerald-500" /> Infrastructure Health</span>
                  <span className="text-emerald-600 font-mono font-bold">98%</span>
                </div>
                <Progress value={98} className="h-2.5" />
                <p className="text-[0.68rem] text-muted-foreground">100% server uptime; active optical backbone & cloud redundancy.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5"><ShieldCheck className="size-4 text-purple-500" /> Security Health</span>
                  <span className="text-purple-600 font-mono font-bold">96%</span>
                </div>
                <Progress value={96} className="h-2.5" />
                <p className="text-[0.68rem] text-muted-foreground">RBAC enforced; SSL active; automated anomaly detection running.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5"><IndianRupee className="size-4 text-amber-500" /> Financial Health</span>
                  <span className="text-amber-600 font-mono font-bold">89%</span>
                </div>
                <Progress value={89} className="h-2.5" />
                <p className="text-[0.68rem] text-muted-foreground">₹12.45 Cr collected; 89% tuition recovery for Q3 fiscal term.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5"><BellRing className="size-4 text-rose-500" /> Communication Health</span>
                  <span className="text-rose-600 font-mono font-bold">95%</span>
                </div>
                <Progress value={95} className="h-2.5" />
                <p className="text-[0.68rem] text-muted-foreground">100% broadcast reach via SMS/Email; 4 active announcements today.</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: INSTITUTION SNAPSHOT (COMPACT EXECUTIVE SUMMARY) */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <School className="size-5 text-indigo-500" /> Executive Institution Snapshot & Academic Cycle
              </h3>
              <Badge variant="outline" className="font-mono text-xs text-indigo-600 border-indigo-500/30">
                Academic Term 2026-27
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Academic Year</span>
                <span className="font-bold text-foreground font-mono text-sm block">2026 - 2027</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Current Semester</span>
                <span className="font-bold text-foreground font-mono text-xs block">Even Sem (IV, VI, VIII)</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Departments</span>
                <span className="font-bold text-emerald-600 font-mono text-sm block">12 Accredited</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Programs Offered</span>
                <span className="font-bold text-primary font-mono text-sm block">24 UG & PG</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Active Courses</span>
                <span className="font-bold text-purple-600 font-mono text-sm block">180 Scheduled</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Running Classes Today</span>
                <span className="font-bold text-foreground font-mono text-sm block">142 / 150 <span className="text-[0.65rem] font-normal text-emerald-600">(94.6%)</span></span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Students Present</span>
                <span className="font-bold text-foreground font-mono text-sm block">4,120 / 4,500</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Faculty Present</span>
                <span className="font-bold text-foreground font-mono text-sm block">312 / 328</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Avg Attendance</span>
                <span className="font-bold text-emerald-600 font-mono text-sm block">91.5%</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-muted-foreground block font-medium text-[0.7rem] uppercase">Calendar Phase</span>
                <span className="font-bold text-amber-600 font-mono text-xs block truncate">Mid-Term Exams</span>
              </div>
            </div>
          </div>

          {/* SECTION 1 & SECTION 2: EXECUTIVE ALERTS & PENDING APPROVALS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* SECTION 1: EXECUTIVE ALERTS CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <AlertTriangle className="size-5 text-amber-500" /> Executive Alerts
                  </h3>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {executiveAlerts.length} Dynamic Items
                  </Badge>
                </div>

                <div className="space-y-2.5 mt-3">
                  {executiveAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={
                              alert.priority === "Critical"
                                ? "size-2 rounded-full bg-red-500 animate-pulse shrink-0"
                                : alert.priority === "High"
                                ? "size-2 rounded-full bg-amber-500 shrink-0"
                                : alert.priority === "Medium"
                                ? "size-2 rounded-full bg-yellow-500 shrink-0"
                                : "size-2 rounded-full bg-emerald-500 shrink-0"
                            }
                          />
                          <p className="font-bold text-foreground truncate">{alert.title}</p>
                          <Badge
                            className={
                              alert.priority === "Critical"
                                ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.65rem] px-1.5 py-0"
                                : alert.priority === "High"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.65rem] px-1.5 py-0"
                                : alert.priority === "Medium"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[0.65rem] px-1.5 py-0"
                                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem] px-1.5 py-0"
                            }
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[0.68rem] text-muted-foreground font-mono">
                          <span>{alert.category}</span>
                          <span>•</span>
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>Dept: {alert.department}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setIsAlertModalOpen(true);
                        }}
                        className="h-7 text-xs px-2.5 shrink-0"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: PENDING APPROVALS CARD */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-500" /> Pending Executive Approvals
                  </h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                    {pendingApprovals.reduce((acc, curr) => acc + curr.count, 0)} Requests Pending
                  </Badge>
                </div>

                <div className="space-y-2.5 mt-3">
                  {pendingApprovals.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant="outline" className="font-mono text-[0.65rem] shrink-0">
                            {app.category}
                          </Badge>
                          <span className="font-bold text-foreground truncate">{app.title}</span>
                        </div>
                        <Badge
                          className={
                            app.priority === "Critical"
                              ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.65rem] px-1.5 py-0 shrink-0"
                              : app.priority === "High"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.65rem] px-1.5 py-0 shrink-0"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[0.65rem] px-1.5 py-0 shrink-0"
                          }
                        >
                          {app.count} Pending
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[0.68rem] text-muted-foreground font-mono">
                        <span>Requested By: <strong className="text-foreground font-sans">{app.requestedBy}</strong></span>
                        <span>{app.submittedDate}</span>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-border/40">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedApproval(app);
                            setIsApprovalModalOpen(true);
                          }}
                          className="h-6 text-[0.68rem] px-2"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectApproval(app.id, app.title)}
                          disabled={app.count === 0}
                          className="h-6 text-[0.68rem] px-2 text-red-600 hover:bg-red-500/10 border-red-500/20"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveApproval(app.id, app.title)}
                          disabled={app.count === 0}
                          className="h-6 text-[0.68rem] px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/60">
                <Button
                  variant="outline"
                  onClick={() => setIsWorkflowModalOpen(true)}
                  className="w-full text-xs font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/10 h-9"
                >
                  <CheckCircle2 className="size-4" /> Open Approval Workflow ({pendingApprovals.length} Categories)
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 5: DEPARTMENT PERFORMANCE COMPARISON */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <BarChart3 className="size-5 text-emerald-500" /> Departmental Academic & Attendance Performance Matrix
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Institutional comparison comparing student count, faculty ratio, average attendance, and pass percentage.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1">
                  <Award className="size-3" /> Top Performer: Computer Science
                </Badge>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
                  <AlertCircle className="size-3" /> Needs Attention: ECE
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Department Name</th>
                    <th className="py-3 px-3 text-center">Students</th>
                    <th className="py-3 px-3 text-center">Faculty</th>
                    <th className="py-3 px-3 text-center">Attendance %</th>
                    <th className="py-3 px-3 text-center">Pass Percentage</th>
                    <th className="py-3 px-3 text-center">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono">
                  <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                    <td className="py-3 px-3 font-bold font-sans text-foreground flex items-center gap-2">
                      <Award className="size-4 text-emerald-500 shrink-0" /> Computer Science & Engineering
                    </td>
                    <td className="py-3 px-3 text-center font-bold">1,240</td>
                    <td className="py-3 px-3 text-center font-bold">84</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">96.8%</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">98.4%</td>
                    <td className="py-3 px-3 text-center">
                      <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-sans text-[0.68rem]">
                        ⭐ Top Performer
                      </Badge>
                    </td>
                  </tr>

                  <tr className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                    <td className="py-3 px-3 font-bold font-sans text-foreground flex items-center gap-2">
                      <AlertCircle className="size-4 text-amber-500 shrink-0" /> Electronics & Communication Engg.
                    </td>
                    <td className="py-3 px-3 text-center font-bold">980</td>
                    <td className="py-3 px-3 text-center font-bold">62</td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600">78.2%</td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600">81.5%</td>
                    <td className="py-3 px-3 text-center">
                      <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 font-sans text-[0.68rem]">
                        🔴 Action Required
                      </Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans text-foreground">Mechanical Engineering</td>
                    <td className="py-3 px-3 text-center">850</td>
                    <td className="py-3 px-3 text-center">54</td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">88.5%</td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">92.1%</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="font-sans text-[0.68rem]">Normal</Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans text-foreground">Information Technology</td>
                    <td className="py-3 px-3 text-center font-bold">760</td>
                    <td className="py-3 px-3 text-center font-bold">48</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">94.2%</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">96.0%</td>
                    <td className="py-3 px-3 text-center">
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-sans text-[0.68rem]">High Performing</Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-semibold font-sans text-foreground">Civil Engineering</td>
                    <td className="py-3 px-3 text-center">612</td>
                    <td className="py-3 px-3 text-center">42</td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">85.0%</td>
                    <td className="py-3 px-3 text-center font-bold text-foreground">89.2%</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="font-sans text-[0.68rem]">Normal</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 8: AI RECOMMENDATIONS & STRATEGIC INSIGHT PANEL */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Brain className="size-5 text-purple-500" /> AI Executive Strategic Insights & Recommendations
              </h3>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-xs">
                Real-time Predictive Analytics
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/30 text-[0.65rem]">Critical Priority</Badge>
                  <span className="font-mono text-red-600 font-bold">94% Confidence</span>
                </div>
                <h4 className="font-bold text-foreground">Attendance Anomaly in ECE</h4>
                <p className="text-muted-foreground text-[0.72rem]">
                  Attendance dropping by 4.2% in ECE Sem VI. Recommendation: Issue automated parent notification & schedule HOD review meeting.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[0.65rem]">High Priority</Badge>
                  <span className="font-mono text-amber-600 font-bold">89% Confidence</span>
                </div>
                <h4 className="font-bold text-foreground">Faculty Workload Alert in AIML</h4>
                <p className="text-muted-foreground text-[0.72rem]">
                  Faculty teaching load high (26 hrs/wk) in AIML. Recommendation: Reallocate 2 adjunct teaching slots to balance curriculum delivery.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 text-[0.65rem]">Medium Priority</Badge>
                  <span className="font-mono text-yellow-600 font-bold">92% Confidence</span>
                </div>
                <h4 className="font-bold text-foreground">Fee Collection Delay in Mechanical</h4>
                <p className="text-muted-foreground text-[0.72rem]">
                  Fee collection delayed for 48 students in Mechanical. Recommendation: Initiate automated reminder SMS & email clearance batch.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[0.65rem]">Low Priority</Badge>
                  <span className="font-mono text-emerald-600 font-bold">96% Confidence</span>
                </div>
                <h4 className="font-bold text-foreground">Placement Registration Surge</h4>
                <p className="text-muted-foreground text-[0.72rem]">
                  Campus placement registrations increasing by 28% YoY. Recommendation: Allocate 4 additional interview labs in Block B.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-[0.65rem]">Low Priority</Badge>
                  <span className="font-mono text-blue-600 font-bold">87% Confidence</span>
                </div>
                <h4 className="font-bold text-foreground">Library Digital Access Trend</h4>
                <p className="text-muted-foreground text-[0.72rem]">
                  Library digital resource usage decreased 15% this week. Recommendation: Promote IEEE e-journal links on student LMS dashboard.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[0.65rem]">Medium Priority</Badge>
                  <span className="font-mono text-purple-600 font-bold">95% Confidence</span>
                </div>
                <h4 className="font-bold text-foreground">Hostel Occupancy Capacity</h4>
                <p className="text-muted-foreground text-[0.72rem]">
                  Boys Hostel Block C reaching 94% occupancy. Recommendation: Reserve remaining 12 beds for incoming international scholars.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4, SECTION 6 & SECTION 7: RECENT ACTIVITIES, ACADEMIC CALENDAR & COMMUNICATION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* SECTION 4: RECENT ACTIVITIES TIMELINE */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Clock className="size-5 text-primary" /> Institutional Recent Activities
                </h3>
                <Badge variant="secondary" className="font-mono text-xs">
                  Real-time Feed
                </Badge>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { time: "10:45 AM", user: "Dr. Rajesh (Super Admin)", action: "Created Faculty Account (Prof. Mehta)", module: "Faculty Mgmt", status: "Success" },
                  { time: "10:12 AM", user: "System Automated", action: "Database Backup Completed (4.2 GB)", module: "Database", status: "Success" },
                  { time: "09:30 AM", user: "Registrar Office", action: "Published Academic Circular #2026-08", module: "Communication", status: "Success" },
                  { time: "08:50 AM", user: "HOD CSE", action: "Updated Department Course Mapping", module: "Academics", status: "Success" },
                  { time: "08:15 AM", user: "Super Admin", action: "Modified RBAC Permissions for Dean Persona", module: "Security", status: "Success" },
                  { time: "Yesterday", user: "Finance Controller", action: "Batch Processed Student Fee Dispatches", module: "Finance", status: "Success" },
                ].map((act, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.68rem] text-primary font-semibold">{act.time}</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem] px-1 py-0">{act.status}</Badge>
                    </div>
                    <p className="font-semibold text-foreground">{act.action}</p>
                    <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground font-mono">
                      <span>{act.user}</span>
                      <span>{act.module}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: ACADEMIC CALENDAR & UPCOMING EVENTS */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Calendar className="size-5 text-rose-500" /> Upcoming Academic Events
                </h3>
                <Badge variant="outline" className="font-mono text-xs text-rose-600 border-rose-500/30">
                  August 2026
                </Badge>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { date: "Aug 10, 2026", event: "Mid-Semester Examinations Begin", priority: "High Priority", bg: "bg-amber-500/10 text-amber-600" },
                  { date: "Aug 15, 2026", event: "Independence Day Institutional Celebration", priority: "Medium Priority", bg: "bg-blue-500/10 text-blue-600" },
                  { date: "Aug 20, 2026", event: "NAAC Peer Team On-Site Inspection Visit", priority: "Critical Priority", bg: "bg-red-500/10 text-red-600" },
                  { date: "Aug 25, 2026", event: "Annual Campus Placement Drive - Phase 1", priority: "High Priority", bg: "bg-emerald-500/10 text-emerald-600" },
                  { date: "Sep 01, 2026", event: "National Research Workshop on AI & Cloud", priority: "Medium Priority", bg: "bg-purple-500/10 text-purple-600" },
                ].map((ev, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-mono text-[0.68rem] text-muted-foreground block">{ev.date}</span>
                      <p className="font-bold text-foreground truncate">{ev.event}</p>
                    </div>
                    <Badge className={`${ev.bg} border-current/20 text-[0.65rem] shrink-0`}>
                      {ev.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: COMMUNICATION SUMMARY */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <MessageSquare className="size-5 text-purple-500" /> Executive Communication Summary
                  </h3>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-xs">
                    Broadcast Dispatch
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs mt-3">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[0.68rem]">Announcements Today</span>
                    <span className="font-mono font-bold text-base text-foreground">4 Active</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[0.68rem]">Emails Sent Today</span>
                    <span className="font-mono font-bold text-base text-primary">1,240 Sent</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[0.68rem]">SMS Dispatched</span>
                    <span className="font-mono font-bold text-base text-emerald-600">3,850 Sent</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[0.68rem]">Unread Notifications</span>
                    <span className="font-mono font-bold text-base text-amber-600">12 Unread</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[0.68rem]">Emergency Alerts</span>
                    <span className="font-mono font-bold text-base text-emerald-600">0 Active</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground block text-[0.68rem]">Circulars Published</span>
                    <span className="font-mono font-bold text-base text-purple-600">2 Published</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60">
                <Button
                  variant="outline"
                  onClick={() => setIsCommCenterOpen(true)}
                  className="w-full text-xs font-semibold gap-2 border-purple-500/30 text-purple-600 hover:bg-purple-500/10 h-9"
                >
                  <Send className="size-4" /> Open Communication Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, ID, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-9 w-[140px] text-xs" aria-label="Role Filter">
                  <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDepartmentFilter}
                onValueChange={setSelectedDepartmentFilter}
              >
                <SelectTrigger className="h-9 w-[160px] text-xs" aria-label="Department Filter">
                  <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d} value={d} className="text-xs">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                <SelectTrigger className="h-9 w-[130px] text-xs" aria-label="Status Filter">
                  <SlidersHorizontal className="size-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Operations Bar */}
          {selectedUserIds.length > 0 && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 text-xs font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                <CheckCircle className="size-4" /> {selectedUserIds.length} users selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdateStatus("Active")}
                  className="h-8 text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                >
                  Set Active
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdateStatus("Suspended")}
                  className="h-8 text-xs bg-amber-500/10 text-amber-600 border-amber-500/20"
                >
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                  className="h-8 text-xs gap-1.5"
                >
                  <Trash2 className="size-3.5" /> Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <UserCog className="size-4 text-primary" /> System Accounts Roster
                <Badge variant="secondary" className="font-mono text-xs">
                  {sortedUsers.length} Users Found
                </Badge>
              </h3>
            </div>

            {paginatedUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground space-y-2">
                <UserCog className="size-8 mx-auto text-muted-foreground/50" />
                <p className="text-sm font-semibold">No users matching your filters.</p>
                <p className="text-xs text-muted-foreground">Try adjusting your search term or dropdown filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                    <tr>
                      <th className="py-3 px-3 w-8">
                        <Checkbox
                          checked={allOnPageSelected}
                          onCheckedChange={(val) => handleSelectAllOnPage(!!val)}
                          aria-label="Select all on page"
                        />
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center gap-1">
                          <span>User ID</span>
                          {sortField === "id" ? (
                            sortOrder === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Full Name & Email</span>
                          {sortField === "name" ? (
                            sortOrder === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Role</span>
                          {sortField === "role" ? (
                            sortOrder === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("department")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Department</span>
                          {sortField === "department" ? (
                            sortOrder === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          {sortField === "status" ? (
                            sortOrder === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUpDown className="size-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </th>
                      <th className="py-3 px-3">Last Login</th>
                      <th className="py-3 px-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {paginatedUsers.map((u) => {
                      const isSelected = selectedUserIds.includes(u.id);
                      return (
                        <tr
                          key={u.id}
                          className={`transition-colors ${
                            isSelected ? "bg-primary/5" : "hover:bg-muted/20"
                          }`}
                        >
                          <td className="py-3 px-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(val) => handleSelectUser(u.id, !!val)}
                              aria-label={`Select ${u.name}`}
                            />
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-foreground">{u.id}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-foreground">{u.name}</div>
                            <div className="text-[0.68rem] text-muted-foreground font-mono">{u.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant="outline"
                              className="font-mono text-[0.68rem] text-primary border-primary/30 uppercase"
                            >
                              {u.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 font-medium text-foreground">{u.department}</td>
                          <td className="py-3 px-3">
                            <Badge
                              className={
                                u.status === "Active"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                                  : u.status === "Suspended"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                                  : "bg-muted text-muted-foreground text-[0.68rem]"
                              }
                            >
                              {u.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground">{u.lastLogin}</td>
                          <td className="py-3 px-3 text-right pr-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenViewUser(u)}
                                className="size-7 text-muted-foreground hover:text-foreground"
                                title="View User Dossier"
                              >
                                <Eye className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEditUser(u)}
                                className="size-7 text-muted-foreground hover:text-primary"
                                title="Edit User"
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(u)}
                                className="size-7 text-muted-foreground hover:text-red-600"
                                title="Delete User"
                              >
                                <Trash2 className="size-3.5" />
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

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => setPageSize(Number(val))}
                >
                  <SelectTrigger className="h-8 w-16 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5" className="text-xs">
                      5
                    </SelectItem>
                    <SelectItem value="10" className="text-xs">
                      10
                    </SelectItem>
                    <SelectItem value="25" className="text-xs">
                      25
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing {sortedUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(currentPage * pageSize, sortedUsers.length)} of {sortedUsers.length} entries
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 text-xs gap-1"
                >
                  <ChevronLeft className="size-3.5" /> Previous
                </Button>
                <span className="font-semibold text-foreground px-2 font-mono">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-8 text-xs gap-1"
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Building2 className="size-5 text-emerald-500" /> Academic & Administrative Departments
            </h3>
            <Button
              size="sm"
              onClick={handleOpenAddDept}
              className="h-9 bg-primary text-primary-foreground gap-2 font-semibold text-xs"
            >
              <Plus className="size-4" /> Add Department
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {dept.code}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    {dept.accreditation}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    HOD: <span className="font-semibold text-primary">{dept.hodName}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-muted/40 text-center">
                    <div className="text-[0.68rem] text-muted-foreground font-sans">Students</div>
                    <div className="font-bold text-foreground text-sm">{dept.studentsCount}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 text-center">
                    <div className="text-[0.68rem] text-muted-foreground font-sans">Faculty</div>
                    <div className="font-bold text-foreground text-sm">{dept.facultyCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ROLE & PERMISSION MATRIX (RBAC) */}
      {activeTab === "rbac" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <LockKeyhole className="size-5 text-amber-500" /> Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure module privilege flags dynamically across institution user personas.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs text-amber-600 border-amber-500/30">
              Live Enforcement
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Role Persona</th>
                  <th className="py-3 px-3 text-center">System Admin</th>
                  <th className="py-3 px-3 text-center">Principal</th>
                  <th className="py-3 px-3 text-center">Academic Dean</th>
                  <th className="py-3 px-3 text-center">HOD</th>
                  <th className="py-3 px-3 text-center">Faculty</th>
                  <th className="py-3 px-3 text-center">Finance</th>
                  <th className="py-3 px-3 text-center">User Mgmt</th>
                  <th className="py-3 px-3 text-center">Export Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rolePermissions.map((item) => (
                  <tr key={item.role} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">
                      <div>{item.label}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono uppercase">{item.role}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.isSystemAdmin}
                        onCheckedChange={() => handleTogglePermission(item.role, "isSystemAdmin", item.isSystemAdmin)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.isPrincipal}
                        onCheckedChange={() => handleTogglePermission(item.role, "isPrincipal", item.isPrincipal)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.isDean}
                        onCheckedChange={() => handleTogglePermission(item.role, "isDean", item.isDean)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.isHod}
                        onCheckedChange={() => handleTogglePermission(item.role, "isHod", item.isHod)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.isFaculty}
                        onCheckedChange={() => handleTogglePermission(item.role, "isFaculty", item.isFaculty)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.isFinance}
                        onCheckedChange={() => handleTogglePermission(item.role, "isFinance", item.isFinance)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.canManageUsers}
                        onCheckedChange={() => handleTogglePermission(item.role, "canManageUsers", item.canManageUsers)}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Switch
                        checked={item.canExportData}
                        onCheckedChange={() => handleTogglePermission(item.role, "canExportData", item.canExportData)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-primary" /> Admin Audit Trail
            </h3>
            <Badge variant="secondary" className="font-mono text-xs">
              {auditLogs.length} Log Entries
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Actor</th>
                  <th className="py-3 px-3">Action Performed</th>
                  <th className="py-3 px-3">Module</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{log.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{log.actor}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{log.action}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-mono text-[0.68rem]">
                        {log.module}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{log.ipAddress}</td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          log.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                            : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AI ANOMALY ENGINE */}
      {activeTab === "ai" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Brain className="size-5 text-purple-500" /> Student Retention & Dropout Risk
            </h3>

            <div className="space-y-4">
              {[
                { dept: "Computer Science & Engineering", risk: "Low (2.1%)", val: 12 },
                { dept: "Electrical & Electronics", risk: "Medium (8.4%)", val: 42 },
                { dept: "Mechanical Engineering", risk: "High (14.2%)", val: 78 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{item.dept}</span>
                    <span
                      className={
                        item.val > 50
                          ? "text-red-500"
                          : item.val > 25
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }
                    >
                      {item.risk}
                    </span>
                  </div>
                  <Progress value={item.val} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Shield className="size-5 text-amber-500" /> Security Anomaly Alarms
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="size-4 text-amber-500" /> Concurrent Request Surge
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Mitigation rule applied to SIT-HYD API Gateway.")}
                    className="h-6 text-[0.65rem] px-2"
                  >
                    Mitigate
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Spike of 800+ concurrent requests detected on SIT-HYD API gateway node.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                <div className="font-bold text-red-700 dark:text-red-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="size-4 text-red-500" /> Brute Force IP Block
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info("IP 192.168.1.145 moved to permanent block list.")}
                    className="h-6 text-[0.65rem] px-2"
                  >
                    Details
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  IP 192.168.1.145 blocked after 15 failed password attempts on staff account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* ORIGINAL MODAL DIALOGS (KEEP 100% INTACT) */}
      {/* --------------------------------------------------------------------- */}

      {/* DIALOG 1: ADD GLOBAL USER MODAL */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Register Global User Account
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new user profile with role-based access privileges.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUserSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Dr. K. Sai Teja"
                  value={userFormData.name || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address *</Label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. user@college.com"
                  value={userFormData.email || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assigned Role</Label>
                <Select
                  value={userFormData.role || "faculty"}
                  onValueChange={(val: any) => setUserFormData({ ...userFormData, role: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.filter((r) => r !== "All Roles").map((r) => (
                      <SelectItem key={r} value={r} className="text-xs uppercase">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Input
                  placeholder="e.g. Computer Science"
                  value={userFormData.department || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUserOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Register User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT USER MODAL */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-5 text-primary" /> Edit User Profile ({selectedUser?.id})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditUserSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name</Label>
                <Input
                  required
                  value={userFormData.name || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  type="email"
                  required
                  value={userFormData.email || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Role</Label>
                <Select
                  value={userFormData.role || "faculty"}
                  onValueChange={(val: any) => setUserFormData({ ...userFormData, role: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.filter((r) => r !== "All Roles").map((r) => (
                      <SelectItem key={r} value={r} className="text-xs uppercase">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Input
                  value={userFormData.department || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <Select
                  value={userFormData.status || "Active"}
                  onValueChange={(val: any) => setUserFormData({ ...userFormData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.filter((s) => s !== "All Statuses").map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditUserOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Save User Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: VIEW USER DOSSIER MODAL */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserCog className="size-5 text-primary" /> User Dossier & Role Matrix
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 pt-1 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedUser.id}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {selectedUser.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedUser.name}</h2>
                <p className="text-xs text-primary font-mono">{selectedUser.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">System Role:</span>
                  <Badge variant="outline" className="font-mono text-xs uppercase text-primary">
                    {selectedUser.role}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground">{selectedUser.department}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Last Login Timestamp:</span>
                  <span className="text-foreground">{selectedUser.lastLogin}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Account Created Date:</span>
                  <span className="text-foreground">{selectedUser.createdAt}</span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewUserOpen(false)}
                  className="w-full text-xs"
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: ADD DEPARTMENT MODAL */}
      <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="size-5 text-emerald-500" /> Create Academic Department
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new institutional department or division.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddDeptSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department Name *</Label>
                <Input
                  required
                  placeholder="e.g. Civil Engineering"
                  value={deptFormData.name || ""}
                  onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department Code *</Label>
                <Input
                  required
                  placeholder="e.g. CE"
                  value={deptFormData.code || ""}
                  onChange={(e) => setDeptFormData({ ...deptFormData, code: e.target.value.toUpperCase() })}
                  className="h-9 text-xs uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">HOD Name</Label>
                <Input
                  placeholder="e.g. Dr. A. V. Rao"
                  value={deptFormData.hodName || ""}
                  onChange={(e) => setDeptFormData({ ...deptFormData, hodName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Accreditation</Label>
                <Input
                  placeholder="e.g. NBA Accredited"
                  value={deptFormData.accreditation || ""}
                  onChange={(e) => setDeptFormData({ ...deptFormData, accreditation: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDeptOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                Create Department
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --------------------------------------------------------------------- */}
      {/* NEW MODAL DIALOGS FOR EXECUTIVE ENHANCEMENTS */}
      {/* --------------------------------------------------------------------- */}

      {/* EXECUTIVE ALERT DETAIL MODAL */}
      <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" /> Executive Alert Details
            </DialogTitle>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedAlert.id}
                  </Badge>
                  <Badge
                    className={
                      selectedAlert.priority === "Critical"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {selectedAlert.priority} Priority
                  </Badge>
                </div>
                <h4 className="font-bold text-foreground text-sm">{selectedAlert.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{selectedAlert.description}</p>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans">Category:</span>
                  <span className="font-semibold text-foreground">{selectedAlert.category}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans">Target Department:</span>
                  <span className="font-semibold text-foreground">{selectedAlert.department}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans">Reported Time:</span>
                  <span className="text-foreground">{selectedAlert.timestamp}</span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  onClick={() => {
                    toast.success(`Action initiated for alert ${selectedAlert.id}`);
                    setIsAlertModalOpen(false);
                  }}
                  className="w-full bg-primary text-primary-foreground text-xs font-semibold"
                >
                  Initiate Corrective Action
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* EXECUTIVE APPROVAL ITEM MODAL */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-500" /> Executive Approval Request
            </DialogTitle>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedApproval.category}
                  </Badge>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    {selectedApproval.count} Pending
                  </Badge>
                </div>
                <h4 className="font-bold text-foreground text-sm">{selectedApproval.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{selectedApproval.details}</p>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans">Requested By:</span>
                  <span className="font-semibold text-foreground">{selectedApproval.requestedBy}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground font-sans">Submitted Date:</span>
                  <span className="text-foreground">{selectedApproval.submittedDate}</span>
                </div>
              </div>

              <DialogFooter className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleRejectApproval(selectedApproval.id, selectedApproval.title)}
                  className="flex-1 text-xs text-red-600 hover:bg-red-500/10 border-red-500/20"
                >
                  Reject Request
                </Button>
                <Button
                  onClick={() => handleApproveApproval(selectedApproval.id, selectedApproval.title)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Approve Request
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* APPROVAL WORKFLOW MANAGEMENT MODAL */}
      <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Layers className="size-5 text-primary" /> Approval Workflow Management Cockpit
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review, approve, or delegate pending institutional approvals across all departments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto pr-1">
            {pendingApprovals.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-[0.68rem]">
                      {app.category}
                    </Badge>
                    <h4 className="font-bold text-foreground">{app.title}</h4>
                  </div>
                  <Badge
                    className={
                      app.priority === "Critical"
                        ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                    }
                  >
                    {app.count} Pending
                  </Badge>
                </div>

                <p className="text-muted-foreground text-[0.72rem]">{app.details}</p>

                <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[0.68rem] font-mono">
                  <span className="text-muted-foreground">Submitted by: <strong className="text-foreground font-sans">{app.requestedBy}</strong> ({app.submittedDate})</span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectApproval(app.id, app.title)}
                      disabled={app.count === 0}
                      className="h-7 text-xs text-red-600 border-red-500/20 hover:bg-red-500/10"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveApproval(app.id, app.title)}
                      disabled={app.count === 0}
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Approve All ({app.count})
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-3 border-t border-border">
            <Button variant="outline" onClick={() => setIsWorkflowModalOpen(false)} className="text-xs">
              Close Workflow Cockpit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BROADCAST ANNOUNCEMENT MODAL */}
      <Dialog open={isAnnouncementModalOpen} onOpenChange={setIsAnnouncementModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Send className="size-5 text-purple-600" /> Broadcast Institutional Announcement
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send an urgent executive message via push notification, email, and SMS.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendAnnouncement} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Audience</Label>
              <Select value={announcementTarget} onValueChange={setAnnouncementTarget}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Institutional Roles" className="text-xs">All Institutional Roles (Global)</SelectItem>
                  <SelectItem value="All Faculty & Staff" className="text-xs">All Faculty & Staff Only</SelectItem>
                  <SelectItem value="All Enrolled Students" className="text-xs">All Enrolled Students Only</SelectItem>
                  <SelectItem value="HODs and Department Deans" className="text-xs">HODs and Department Deans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Announcement Content *</Label>
              <Textarea
                required
                rows={4}
                placeholder="Type your official executive announcement message here..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsAnnouncementModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5">
                <Send className="size-3.5" /> Broadcast Now
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIGURE ACADEMIC CALENDAR MODAL */}
      <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Calendar className="size-5 text-rose-500" /> Configure Academic Calendar Milestone
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add or update key academic term dates, examination schedules, and institutional events.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Academic Calendar schedule updated successfully!");
              setIsCalendarModalOpen(false);
            }}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Event Title *</Label>
                <Input required placeholder="e.g. NAAC Peer Inspection" className="h-9 text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Date *</Label>
                <Input type="date" required className="h-9 text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Priority Level</Label>
                <Select defaultValue="High">
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical" className="text-xs">Critical Priority</SelectItem>
                    <SelectItem value="High" className="text-xs">High Priority</SelectItem>
                    <SelectItem value="Medium" className="text-xs">Medium Priority</SelectItem>
                    <SelectItem value="Low" className="text-xs">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <Select defaultValue="Examination">
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Examination" className="text-xs">Examination</SelectItem>
                    <SelectItem value="Accreditation" className="text-xs">Accreditation</SelectItem>
                    <SelectItem value="Holiday" className="text-xs">Holiday</SelectItem>
                    <SelectItem value="Workshop" className="text-xs">Workshop / Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsCalendarModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold">
                Save Calendar Milestone
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* COMMUNICATION CENTER MODAL */}
      <Dialog open={isCommCenterOpen} onOpenChange={setIsCommCenterOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="size-5 text-purple-600" /> Executive Communication Center
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Monitor active circulars, SMS gateways, and broadcast communications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-0.5">
                <span className="text-[0.68rem] text-muted-foreground font-sans block">Today's SMS</span>
                <span className="font-bold text-purple-600 text-base">3,850 Sent</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-0.5">
                <span className="text-[0.68rem] text-muted-foreground font-sans block">Emails Delivered</span>
                <span className="font-bold text-blue-600 text-base">1,240 Sent</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
                <span className="text-[0.68rem] text-muted-foreground font-sans block">Active Circulars</span>
                <span className="font-bold text-emerald-600 text-base">2 Published</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">Recent Circular Broadcasts</p>
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                <div className="flex justify-between font-mono text-[0.68rem] text-primary">
                  <span>Circular #2026-08</span>
                  <span>Published Today 09:30 AM</span>
                </div>
                <p className="font-bold text-foreground">Mid-Semester Exam Timetable & Hall Ticket Release Schedule</p>
                <p className="text-muted-foreground text-[0.7rem]">Dispatched to 4,500 students and 328 faculty members via SMS and Student Portal.</p>
              </div>
            </div>

            <DialogFooter className="pt-2 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCommCenterOpen(false)}
                className="flex-1 text-xs"
              >
                Close Center
              </Button>
              <Button
                onClick={() => {
                  setIsCommCenterOpen(false);
                  setIsAnnouncementModalOpen(true);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5"
              >
                <Send className="size-3.5" /> Broadcast New Circular
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
