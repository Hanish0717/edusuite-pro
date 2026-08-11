import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Users,
  UserCog,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Wallet,
  Package,
  Calendar,
  BookOpen,
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  fetchAdminKpiConfigs,
  fetchAssignedModules,
  fetchAdminOperations,
  fetchAdminUsers,
  fetchAdminDepartments,
  fetchAdminAuditLogs,
  fetchConfigurableReports,
  fetchAdminSettings,
  type AdminUser,
} from "@/lib/adminService";

export function AdminDashboard() {
  // Config-Driven KPI List & Modules
  const kpiConfigs = useMemo(() => fetchAdminKpiConfigs(), []);
  const assignedModules = useMemo(() => fetchAssignedModules(), []);
  const initialSettings = useMemo(() => fetchAdminSettings(), []);
  const [settings, setSettings] = useState(initialSettings);

  // Operations Task Queue States
  const [opSearch, setOpSearch] = useState("");
  const [opStatusFilter, setOpStatusFilter] = useState("All Statuses");
  const [opModuleFilter, setOpModuleFilter] = useState("All Modules");
  const tasks = useMemo(() => {
    return fetchAdminOperations(opSearch, opStatusFilter, opModuleFilter);
  }, [opSearch, opStatusFilter, opModuleFilter]);

  // User Management States (Search, Filter, Sort, Pagination)
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All Roles");
  const [userDeptFilter, setUserDeptFilter] = useState("All Departments");
  const [userPage, setUserPage] = useState(1);
  const [userSortKey, setUserSortKey] = useState<keyof AdminUser>("name");
  const [userSortOrder, setUserSortOrder] = useState<"asc" | "desc">("asc");

  const paginatedUsers = useMemo(() => {
    return fetchAdminUsers(
      userSearch,
      userRoleFilter,
      userDeptFilter,
      userPage,
      5,
      userSortKey,
      userSortOrder,
    );
  }, [userSearch, userRoleFilter, userDeptFilter, userPage, userSortKey, userSortOrder]);

  // Department Management States (Search, Filter, Pagination)
  const [deptSearch, setDeptSearch] = useState("");
  const [deptStatusFilter, setDeptStatusFilter] = useState("All Statuses");
  const [deptPage, setDeptPage] = useState(1);

  const paginatedDepartments = useMemo(() => {
    return fetchAdminDepartments(deptSearch, deptStatusFilter, deptPage, 5);
  }, [deptSearch, deptStatusFilter, deptPage]);

  // Audit Logs States (Search, Action Filter, Pagination)
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("All Actions");
  const [auditPage, setAuditPage] = useState(1);

  const paginatedAuditLogs = useMemo(() => {
    return fetchAdminAuditLogs(auditSearch, auditActionFilter, auditPage, 5);
  }, [auditSearch, auditActionFilter, auditPage]);

  // Configurable Reports State
  const [reportCategoryFilter, setReportCategoryFilter] = useState("All Categories");
  const reports = useMemo(() => {
    return fetchConfigurableReports(reportCategoryFilter);
  }, [reportCategoryFilter]);

  // Icon Resolver Helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return Users;
      case "UserCog":
        return UserCog;
      case "GraduationCap":
        return GraduationCap;
      case "Wallet":
        return Wallet;
      case "CalendarCheck":
        return CalendarCheck;
      case "FileSpreadsheet":
        return FileSpreadsheet;
      case "Package":
        return Package;
      default:
        return BookOpen;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "High":
        return <Badge className="bg-amber-500 text-white">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const handleToggleModuleSetting = (modKey: string) => {
    setSettings((prev) => ({
      ...prev,
      moduleToggles: {
        ...prev.moduleToggles,
        [modKey]: !prev.moduleToggles[modKey],
      },
    }));
    toast.success(`Module '${modKey}' configuration toggled!`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Operations & Admin Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Daily Operations & Workflows across admissions, rosters, timetables, and inventory.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ADMIN / OPERATIONS
        </Badge>
      </div>

      {/* DYNAMIC CONFIGURATION-DRIVEN KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiConfigs.map((kpi) => {
          const IconComp = renderIcon(kpi.iconName);
          return (
            <KpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              icon={IconComp}
              tone={kpi.tone}
              delta={kpi.delta}
            />
          );
        })}
      </div>

      {/* DYNAMIC ASSIGNED MODULES GRID */}
      <Panel
        title="Assigned Modules & Operations"
        description="Active operational workflows configured for the Admin role."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {assignedModules.map((m) => {
            const IconComp = renderIcon(m.iconName);
            return (
              <Link
                key={m.id}
                to={m.route}
                className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComp className="size-5" />
                    </span>
                    <div>
                      <h4 className="font-display text-sm font-bold group-hover:text-primary transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </Panel>

      {/* DYNAMIC TABS MANAGEMENT CONTAINER */}
      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="bg-background/50 border border-border p-1">
          <TabsTrigger value="operations">Operations Queue</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="departments">Department Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="reports">Configurable Reports</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* OPERATIONS QUEUE TAB */}
        <TabsContent value="operations">
          <Panel
            title="Daily Operations & Task Queue"
            description="Live queue of administrative tasks requiring review or processing."
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks, IDs, or assignee..."
                    value={opSearch}
                    onChange={(e) => setOpSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <Select value={opStatusFilter} onValueChange={setOpStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={opModuleFilter} onValueChange={setOpModuleFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Modules">All Modules</SelectItem>
                    <SelectItem value="Admissions">Admissions</SelectItem>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Examinations">Examinations</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Task & Module</th>
                      <th className="p-3">Assigned To</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {tasks.length > 0 ? (
                      tasks.map((t) => (
                        <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <p className="font-bold text-foreground">{t.title}</p>
                            <span className="text-[0.68rem] text-muted-foreground font-mono">
                              {t.id} • {t.module}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{t.assignedTo}</td>
                          <td className="p-3">{getPriorityBadge(t.priority)}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-mono text-xs">
                              {t.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right text-muted-foreground font-mono">
                            {t.lastUpdated}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-muted-foreground">
                          No operational tasks match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* USER MANAGEMENT TAB */}
        <TabsContent value="users">
          <Panel
            title="User Roster Management"
            description="Manage active institutional accounts across all roles and departments."
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search user name, email, or ID..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <Select
                  value={userRoleFilter}
                  onValueChange={(val) => {
                    setUserRoleFilter(val);
                    setUserPage(1);
                  }}
                >
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Roles">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={userDeptFilter}
                  onValueChange={(val) => {
                    setUserDeptFilter(val);
                    setUserPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px] h-9 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Departments">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Exam Cell">Exam Cell</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
                <table aria-label="User Roster Table" className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3 cursor-pointer" onClick={() => setUserSortOrder(userSortOrder === "asc" ? "desc" : "asc")}>
                        User & Email <ArrowUpDown className="inline size-3 ml-1" />
                      </th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Joined</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {paginatedUsers.data.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-foreground">{u.name}</p>
                          <p className="text-[0.68rem] text-muted-foreground font-mono">{u.email}</p>
                        </td>
                        <td className="p-3 font-mono">
                          <Badge variant="outline">{u.role}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{u.department}</td>
                        <td className="p-3 font-mono text-muted-foreground">{u.dateJoined}</td>
                        <td className="p-3 text-right">
                          <Badge variant={u.status === "Active" ? "secondary" : "destructive"}>
                            {u.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Showing Page {paginatedUsers.page} of {paginatedUsers.totalPages} ({paginatedUsers.total} total)
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => p - 1)}
                    className="h-8 text-xs cursor-pointer gap-1"
                  >
                    <ChevronLeft className="size-3.5" /> Prev
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={userPage >= paginatedUsers.totalPages}
                    onClick={() => setUserPage((p) => p + 1)}
                    className="h-8 text-xs cursor-pointer gap-1"
                  >
                    Next <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* DEPARTMENT MANAGEMENT TAB */}
        <TabsContent value="departments">
          <Panel
            title="Departmental Directory"
            description="Manage academic and administrative departments."
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search department name, code, or HOD..."
                    value={deptSearch}
                    onChange={(e) => {
                      setDeptSearch(e.target.value);
                      setDeptPage(1);
                    }}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Select
                  value={deptStatusFilter}
                  onValueChange={(val) => {
                    setDeptStatusFilter(val);
                    setDeptPage(1);
                  }}
                >
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Dept Name & Code</th>
                      <th className="p-3">HOD Name</th>
                      <th className="p-3">Faculty Count</th>
                      <th className="p-3">Student Count</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {paginatedDepartments.data.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-foreground">{d.name}</p>
                          <span className="font-mono text-[0.68rem] text-muted-foreground">{d.code}</span>
                        </td>
                        <td className="p-3 text-muted-foreground">{d.hodName}</td>
                        <td className="p-3 font-mono">{d.facultyCount}</td>
                        <td className="p-3 font-mono">{d.studentCount}</td>
                        <td className="p-3 text-right">
                          <Badge variant={d.status === "Active" ? "secondary" : "destructive"}>
                            {d.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* AUDIT LOGS TAB */}
        <TabsContent value="audit">
          <Panel title="System Audit Logs" description="Live audit logging of administrative changes.">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search audit log user, action, or module..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/80 bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">User & IP</th>
                      <th className="p-3">Action Performed</th>
                      <th className="p-3">Target Module</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {paginatedAuditLogs.data.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-foreground">{log.user}</p>
                          <span className="font-mono text-[0.68rem] text-muted-foreground">{log.ipAddress}</span>
                        </td>
                        <td className="p-3">{log.action}</td>
                        <td className="p-3 font-mono">{log.module}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* CONFIGURABLE REPORTS TAB */}
        <TabsContent value="reports">
          <Panel title="Configurable Institutional Reports" description="Generate and export system reports.">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={reportCategoryFilter} onValueChange={setReportCategoryFilter}>
                  <SelectTrigger className="w-[160px] h-9 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <FileText className="size-5 text-primary" />
                      <Badge variant="outline" className="font-mono text-[0.65rem]">
                        {rep.format}
                      </Badge>
                    </div>
                    <h4 className="font-display text-sm font-bold">{rep.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Category: {rep.category} • Last generated: {rep.lastGenerated}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Exporting ${rep.title} as ${rep.format}...`)}
                      className="w-full text-xs cursor-pointer gap-1.5 mt-2"
                    >
                      <Download className="size-3.5" /> Download Report
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* SYSTEM SETTINGS TAB */}
        <TabsContent value="settings">
          <Panel title="System Configuration Settings" description="Configuration-driven policies and module toggles.">
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-sm font-bold mb-3">Module Feature Toggles</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(settings.moduleToggles).map(([modKey, enabled]) => (
                    <div
                      key={modKey}
                      className="p-3 rounded-xl border border-border/80 bg-card flex items-center justify-between"
                    >
                      <span className="text-xs font-bold capitalize">{modKey}</span>
                      <Button
                        size="sm"
                        variant={enabled ? "default" : "outline"}
                        onClick={() => handleToggleModuleSetting(modKey)}
                        className="h-7 text-[0.65rem] px-2 cursor-pointer font-mono"
                      >
                        {enabled ? "ENABLED" : "DISABLED"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
