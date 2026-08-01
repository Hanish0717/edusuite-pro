import React, { useEffect, useState } from "react";
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
  Clock,
  XCircle,
  AlertTriangle,
  Lock,
  Server,
  Terminal,
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
  fetchSuperAdminStats,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchDepartments,
  fetchAuditLogs,
  triggerBackup,
  MOCK_SUPER_ADMIN_STATS,
  MOCK_USERS,
  MOCK_DEPARTMENTS,
  MOCK_AUDIT_LOGS,
  type SuperAdminStats,
  type SuperAdminUser,
  type DepartmentItem,
  type AuditLogItem,
} from "./SuperAdminService";

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

export function SuperAdminModuleView() {
  const [stats, setStats] = useState<SuperAdminStats>(MOCK_SUPER_ADMIN_STATS);
  const [users, setUsers] = useState<SuperAdminUser[]>(MOCK_USERS);
  const [departments, setDepartments] = useState<DepartmentItem[]>(MOCK_DEPARTMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "departments" | "audit" | "ai"
  >("overview");

  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SuperAdminUser>>({
    name: "",
    email: "",
    role: "faculty",
    department: "Computer Science & Engineering",
    status: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, uData, dData, aData] = await Promise.all([
        fetchSuperAdminStats(),
        fetchUsers(),
        fetchDepartments(),
        fetchAuditLogs(),
      ]);
      setStats(sData);
      setUsers(uData);
      setDepartments(dData);
      setAuditLogs(aData);
    } catch (err) {
      toast.error("Error connecting to backend services. Using local fallback mode.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());

    const matchesRole = selectedRole === "All Roles" || u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Handlers
  const handleOpenAddUser = () => {
    setFormData({
      name: "",
      email: "",
      role: "faculty",
      department: "Computer Science & Engineering",
      status: "Active",
    });
    setIsAddUserOpen(true);
  };

  const handleOpenEditUser = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setIsEditUserOpen(true);
  };

  const handleOpenViewUser = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setIsViewUserOpen(true);
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide user full name and email.");
      return;
    }

    const created = await createUser(formData);
    setUsers((prev) => [created, ...prev]);
    setIsAddUserOpen(false);
    toast.success(`User ${created.name} (${created.role.toUpperCase()}) created successfully!`);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    await updateUser(selectedUser.id, formData);
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? ({ ...u, ...formData } as SuperAdminUser) : u)),
    );
    setIsEditUserOpen(false);
    toast.success(`User ${formData.name} updated successfully!`);
  };

  const handleDeleteUser = async (user: SuperAdminUser) => {
    if (confirm(`Are you sure you want to delete user account ${user.name} (${user.email})?`)) {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(`User ${user.name} deleted.`);
    }
  };

  const handleTriggerBackup = async () => {
    setBackupLoading(true);
    toast.info("Initializing system database backup snapshot...");
    const res = await triggerBackup();
    setBackupLoading(false);
    toast.success(res.message);
  };

  const handleExportCSV = () => {
    const headers = [
      "User ID",
      "Full Name",
      "Email Address",
      "Role",
      "Department",
      "Status",
      "Last Login",
      "Created At",
    ];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      `"${u.department}"`,
      u.status,
      u.lastLogin,
      u.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `SuperAdmin_Users_Roster_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredUsers.length} user records to CSV!`);
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
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
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
            {stats.totalDepartments}
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
          Overview & System Health
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
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "audit"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === "ai"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          AI Anomaly Engine
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* System Health Card */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Activity className="size-5 text-emerald-500" /> Infrastructure Node Cluster Monitor
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-xs">
                  All Systems Operational
                </Badge>
              </div>

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

              <div className="space-y-2 pt-2">
                {stats.systemHealth.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs"
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

            {/* Quick Action Shortcuts Panel */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Terminal className="size-5 text-primary" /> Super Admin Operations
              </h3>

              <div className="space-y-2.5">
                <Button
                  onClick={handleOpenAddUser}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-10"
                >
                  <Plus className="size-4" /> Register New Global User
                </Button>

                <Button
                  onClick={handleTriggerBackup}
                  disabled={backupLoading}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 h-10"
                >
                  <Database className="size-4" /> Trigger Database Backup
                </Button>

                <Button
                  onClick={() => setActiveTab("users")}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-10"
                >
                  <UserCog className="size-4" /> Manage Role Privileges
                </Button>

                <Button
                  onClick={() => setActiveTab("audit")}
                  className="w-full justify-start text-xs font-semibold gap-2 bg-muted text-foreground hover:bg-muted/80 border border-border h-10"
                >
                  <FileSpreadsheet className="size-4" /> View Audit Trail Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search user by name, email, role, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="h-9 w-full sm:w-[160px] text-xs" aria-label="Role Filter">
                <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Role Filter" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <UserCog className="size-4 text-primary" /> System Accounts Roster
                <Badge variant="secondary" className="font-mono text-xs">
                  {filteredUsers.length} Users
                </Badge>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">User ID</th>
                    <th className="py-3 px-3">Full Name & Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Last Login</th>
                    <th className="py-3 px-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
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
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]">
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
                            title="View User"
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === "departments" && (
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
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-primary" /> Admin Audit Trail
            </h3>
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

      {/* TAB 5: AI ANOMALY ENGINE */}
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
                <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-amber-500" /> Concurrent Request Surge
                </div>
                <p className="text-muted-foreground">
                  Spike of 800+ concurrent requests detected on SIT-HYD API gateway node.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                <div className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                  <Lock className="size-4 text-red-500" /> Brute Force IP Block
                </div>
                <p className="text-muted-foreground">
                  IP 192.168.1.145 blocked after 15 failed password attempts on staff account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address *</Label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. user@college.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assigned Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val: any) => setFormData({ ...formData, role: val })}
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
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val: any) => setFormData({ ...formData, role: val })}
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
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="h-9 text-xs"
                />
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
    </div>
  );
}
