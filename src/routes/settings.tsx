import { createFileRoute } from "@tanstack/react-router";
import {
  Settings as SettingsIcon,
  ShieldAlert,
  Building,
  Key,
  Users,
  Search,
  Download,
  Filter,
  Palette,
  Calendar,
  Bell,
  Clock,
  Eye,
  Check,
  ToggleRight,
  GitBranch,
  ArrowRight,
  Plus,
  Trash2,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import {
  roleProfiles,
  ERP_MODULES,
  DEPARTMENTS,
  RESPONSIBILITY_FLAGS,
  getDefaultRouteForUser,
  type LoginRole,
} from "@/config/roles";
import {
  getBasePermissions,
  getFlagOverrideForModule,
  type ModulePermissions,
  type PermissionScope,
} from "@/lib/permissions";

export const Route = createFileRoute("/settings")({
  component: SettingsRedirect,
});

function SettingsRedirect() {
  const { role, flags } = useRole();
  if (role === "super-admin") {
    return <Navigate to="/super-admin/settings" replace />;
  }
  const defaultRoute = getDefaultRouteForUser(role, flags);
  return <Navigate to={defaultRoute} replace />;
}

const scopeLabels: Record<string, string> = {
  own: "Own Records",
  department: "Department",
  school: "School",
  campus: "Campus",
  institution: "Institution",
  global: "Global",
};

export function SettingsPage({ withLayout = true }: { withLayout?: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptScope, setSelectedDeptScope] = useState("all");
  const { featureFlags, setFeatureFlags } = useRole();

  // Workflows configuration state (Configurable Approval Engine)
  const [workflows, setWorkflows] = useState([
    {
      id: "leave",
      name: "Faculty Leave Approval",
      steps: ["Faculty Advisor", "HOD (Department Head)", "Dean", "Principal"],
    },
    {
      id: "purchase",
      name: "Procurement / Purchase Request",
      steps: ["Inventory Manager", "Finance Officer", "Principal"],
    },
    {
      id: "exam",
      name: "Exam Result Publication",
      steps: ["Exam Controller", "Dean", "Principal"],
    },
    {
      id: "admission",
      name: "Student Scholarship Approval",
      steps: ["Admissions Officer", "Finance Officer", "Principal"],
    },
  ]);

  // Permission Formula Evaluator state
  const [calcRole, setCalcRole] = useState<LoginRole>("staff");
  const [calcPrivilege, setCalcPrivilege] = useState("isExamController");
  const [calcModule, setCalcModule] = useState("examination");
  const [calcAction, setCalcAction] = useState<"read" | "create" | "update" | "delete" | "approve">(
    "approve",
  );
  const [calcScope, setCalcScope] = useState<PermissionScope>("institution");

  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [tempStep, setTempStep] = useState("HOD (Department Head)");

  // Custom permissions matrix state (allowing users to toggle permissions for demo purposes)
  const [customMatrix, setCustomMatrix] = useState<
    Record<string, Record<string, Partial<ModulePermissions>>>
  >({});

  const handleTogglePerm = (
    moduleId: string,
    roleOrFlag: string,
    action: keyof ModulePermissions,
  ) => {
    setCustomMatrix((prev) => {
      const modulePrev = prev[moduleId] || {};
      const targetPrev = modulePrev[roleOrFlag] || {};
      const newval = !targetPrev[action];

      const updated = {
        ...prev,
        [moduleId]: {
          ...modulePrev,
          [roleOrFlag]: {
            ...targetPrev,
            [action]: newval,
          },
        },
      };

      toast.success(
        `Updated permission for ${moduleId}: ${roleOrFlag} -> ${action} = ${newval ? "Allowed" : "Denied"}`,
      );
      return updated;
    });
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ customMatrix, featureFlags, workflows }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "edusuite_rbac_permissions.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Permissions Matrix and configurations exported!");
  };

  // Get active cell value (merges default config with custom modifications)
  const getCellPerms = (moduleId: string, targetKey: string, isFlag = false) => {
    let base: ModulePermissions;
    if (isFlag) {
      base = {
        read: false,
        create: false,
        update: false,
        delete: false,
        approve: false,
        scope: "global",
      };
      const override = getFlagOverrideForModule([targetKey], moduleId);
      if (override) Object.assign(base, override);
    } else {
      base = { ...getBasePermissions(targetKey as LoginRole, moduleId) };
    }

    // Merge custom matrix edits
    const custom = customMatrix[moduleId]?.[targetKey];
    if (custom) {
      base = { ...base, ...custom };
    }
    return base;
  };

  const handleToggleFeature = (key: string) => {
    const nextFeatures = { ...featureFlags, [key]: !featureFlags[key] };
    setFeatureFlags(nextFeatures);
    toast.success(
      `Feature Flag for ${key.toUpperCase()} has been ${nextFeatures[key] ? "ENABLED" : "DISABLED"}!`,
    );
  };

  const addWorkflowStep = (wfId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === wfId) {
          return { ...w, steps: [...w.steps, tempStep] };
        }
        return w;
      }),
    );
    toast.success(`Added step "${tempStep}" to workflow.`);
  };

  const removeWorkflowStep = (wfId: string, idx: number) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === wfId) {
          const nextSteps = [...w.steps];
          nextSteps.splice(idx, 1);
          return { ...w, steps: nextSteps };
        }
        return w;
      }),
    );
    toast.success("Removed step from workflow.");
  };

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) {
      toast.error("Please enter a workflow name.");
      return;
    }
    const newWf = {
      id: newWorkflowName.toLowerCase().replace(/\s+/g, "-"),
      name: newWorkflowName,
      steps: ["Faculty", "HOD (Department Head)"],
    };
    setWorkflows([...workflows, newWf]);
    setNewWorkflowName("");
    toast.success("New custom approval workflow created successfully!");
  };

  const filteredModules = ERP_MODULES.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Simple evaluator result calculation
  const getEvaluatorResult = () => {
    // 0. Feature flag check
    if (calcModule in featureFlags && !featureFlags[calcModule]) {
      return { allowed: false, reason: "Module License Disabled (Feature Flag is OFF)" };
    }
    // 1. Core role permissions
    const base = getBasePermissions(calcRole, calcModule);
    let allowed = base[calcAction];
    let finalScope = base.scope;

    // 2. Privilege flags override (if staff)
    if (calcRole === "staff") {
      const override = getFlagOverrideForModule([calcPrivilege], calcModule);
      if (override) {
        if (override[calcAction] !== undefined) allowed = override[calcAction]!;
        if (override.scope) finalScope = override.scope;
      }
    }

    return {
      allowed,
      scope: finalScope,
      reason: allowed
        ? `Access granted under scope "${scopeLabels[finalScope]}".`
        : `Denied: ${calcRole} with privilege flag ${calcPrivilege} does not possess "${calcAction.toUpperCase()}" action permission on the ${calcModule} module.`,
    };
  };

  const calcResult = getEvaluatorResult();

  const mainContent = (
    <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <SettingsIcon className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage campus licensing parameters, approval workflows, and granular role
                permissions.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 h-9">
              <Download className="size-4" /> Export Config
            </Button>
          </div>
        </header>

        <Tabs defaultValue="rbac" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto bg-background/50 border border-border p-1 gap-1">
            <TabsTrigger value="rbac" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <ShieldAlert className="size-4" /> Roles & Access Matrix
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <ToggleRight className="size-4" /> Licensing & Feature Flags
            </TabsTrigger>
            <TabsTrigger value="workflows" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <GitBranch className="size-4" /> Approval Workflows
            </TabsTrigger>
            <TabsTrigger value="institution" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <Building className="size-4" /> Institution Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <Key className="size-4" /> Security & Session
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <Palette className="size-4" /> Branding & Theme
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-1.5 py-2 px-3 text-xs md:text-sm">
              <Clock className="size-4" /> Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ROLES & ACCESS MATRIX */}
          <TabsContent value="rbac" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Permissions Matrix */}
              <div className="lg:col-span-2 space-y-6">
                <Panel
                  title="Module Access Matrix"
                  description="Review and customize granular permissions across all login roles and responsibility privilege flags. Click cell checkboxes to toggle permissions."
                >
                  {/* Matrix filters */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 border-b border-border/40 pb-4">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Dept. Scope:</span>
                      <select
                        value={selectedDeptScope}
                        onChange={(e) => setSelectedDeptScope(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 text-xs"
                      >
                        <option value="all">All Departments</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Matrix Table */}
                  <div className="overflow-x-auto border border-border rounded-xl">
                    <Table className="min-w-[1000px]">
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="w-[180px] font-bold">MODULES</TableHead>
                          <TableHead className="text-center font-semibold">SUPER ADMIN</TableHead>
                          <TableHead className="text-center font-semibold">
                            STAFF (DEFAULT)
                          </TableHead>
                          <TableHead className="text-center font-semibold">STUDENT</TableHead>
                          <TableHead className="text-center font-semibold">PARENT</TableHead>
                          <TableHead className="text-center font-semibold">EXTERNAL USER</TableHead>
                          <TableHead className="text-center font-semibold">
                            RESPONSIBILITY FLAG OVERRIDES
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredModules.map((mod) => {
                          const superAdminCell = getCellPerms(mod.id, "super-admin");
                          const staffCell = getCellPerms(mod.id, "staff");
                          const studentCell = getCellPerms(mod.id, "student");
                          const parentCell = getCellPerms(mod.id, "parent");
                          const externalCell = getCellPerms(mod.id, "external-user");

                          // Find which responsibility flags have overrides for this module
                          const flagOverrides = RESPONSIBILITY_FLAGS.filter(
                            (f) => getFlagOverrideForModule([f.id], mod.id) !== null,
                          );

                          return (
                            <TableRow key={mod.id} className="hover:bg-accent/10 transition-colors">
                              <TableCell className="font-semibold flex items-center gap-2 py-3.5">
                                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                                  <mod.icon className="size-4" />
                                </span>
                                <span className="text-sm truncate">{mod.name}</span>
                              </TableCell>

                              {/* Super Admin */}
                              <TableCell className="text-center">
                                <div className="flex flex-col gap-1 items-center justify-center">
                                  <div className="flex gap-0.5 justify-center">
                                    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200 border-none text-[0.6rem] px-1 font-bold">
                                      R
                                    </Badge>
                                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200 border-none text-[0.6rem] px-1 font-bold">
                                      C
                                    </Badge>
                                    <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200 border-none text-[0.6rem] px-1 font-bold">
                                      U
                                    </Badge>
                                    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200 border-none text-[0.6rem] px-1 font-bold">
                                      D
                                    </Badge>
                                    <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200 border-none text-[0.6rem] px-1 font-bold">
                                      A
                                    </Badge>
                                  </div>
                                  <span className="text-[0.6rem] text-muted-foreground uppercase font-mono">
                                    Scope: Global
                                  </span>
                                </div>
                              </TableCell>

                              {/* Staff */}
                              <TableCell>
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                  <div className="flex gap-0.5 justify-center">
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "staff", "read")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${staffCell.read ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      R
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "staff", "create")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${staffCell.create ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      C
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "staff", "update")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${staffCell.update ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      U
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "staff", "delete")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${staffCell.delete ? "bg-red-50 border-red-200 text-red-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      D
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "staff", "approve")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${staffCell.approve ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      A
                                    </span>
                                  </div>
                                  <span className="text-[0.6rem] text-muted-foreground uppercase font-mono">
                                    Scope: {scopeLabels[staffCell.scope]}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Student */}
                              <TableCell>
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                  <div className="flex gap-0.5 justify-center">
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "student", "read")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${studentCell.read ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      R
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "student", "create")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${studentCell.create ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      C
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "student", "update")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${studentCell.update ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      U
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "student", "delete")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${studentCell.delete ? "bg-red-50 border-red-200 text-red-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      D
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "student", "approve")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${studentCell.approve ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      A
                                    </span>
                                  </div>
                                  <span className="text-[0.6rem] text-muted-foreground uppercase font-mono">
                                    Scope: {scopeLabels[studentCell.scope]}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Parent */}
                              <TableCell>
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                  <div className="flex gap-0.5 justify-center">
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "parent", "read")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${parentCell.read ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      R
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "parent", "create")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${parentCell.create ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      C
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "parent", "update")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${parentCell.update ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      U
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "parent", "delete")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${parentCell.delete ? "bg-red-50 border-red-200 text-red-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      D
                                    </span>
                                    <span
                                      onClick={() => handleTogglePerm(mod.id, "parent", "approve")}
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${parentCell.approve ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      A
                                    </span>
                                  </div>
                                  <span className="text-[0.6rem] text-muted-foreground uppercase font-mono">
                                    Scope: {scopeLabels[parentCell.scope]}
                                  </span>
                                </div>
                              </TableCell>

                              {/* External User */}
                              <TableCell>
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                  <div className="flex gap-0.5 justify-center">
                                    <span
                                      onClick={() =>
                                        handleTogglePerm(mod.id, "external-user", "read")
                                      }
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${externalCell.read ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      R
                                    </span>
                                    <span
                                      onClick={() =>
                                        handleTogglePerm(mod.id, "external-user", "create")
                                      }
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${externalCell.create ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      C
                                    </span>
                                    <span
                                      onClick={() =>
                                        handleTogglePerm(mod.id, "external-user", "update")
                                      }
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${externalCell.update ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      U
                                    </span>
                                    <span
                                      onClick={() =>
                                        handleTogglePerm(mod.id, "external-user", "delete")
                                      }
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${externalCell.delete ? "bg-red-50 border-red-200 text-red-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      D
                                    </span>
                                    <span
                                      onClick={() =>
                                        handleTogglePerm(mod.id, "external-user", "approve")
                                      }
                                      className={`cursor-pointer border rounded text-[0.65rem] font-bold px-1 select-none ${externalCell.approve ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-muted text-muted-foreground border-border"}`}
                                    >
                                      A
                                    </span>
                                  </div>
                                  <span className="text-[0.6rem] text-muted-foreground uppercase font-mono">
                                    Scope: {scopeLabels[externalCell.scope]}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Responsibility Override Info */}
                              <TableCell className="w-[220px]">
                                {flagOverrides.length > 0 ? (
                                  <div className="flex flex-col gap-1 max-w-[200px]">
                                    {flagOverrides.slice(0, 2).map((f) => {
                                      const cell = getCellPerms(mod.id, f.id, true);
                                      return (
                                        <div
                                          key={f.id}
                                          className="flex justify-between items-center bg-accent/40 rounded px-1.5 py-0.5 text-[0.65rem]"
                                        >
                                          <span className="font-semibold truncate w-24">
                                            {f.label}
                                          </span>
                                          <div className="flex gap-0.5">
                                            {cell.read && (
                                              <span className="text-[0.6rem] text-blue-700 font-bold">
                                                R
                                              </span>
                                            )}
                                            {cell.create && (
                                              <span className="text-[0.6rem] text-emerald-700 font-bold">
                                                C
                                              </span>
                                            )}
                                            {cell.update && (
                                              <span className="text-[0.6rem] text-amber-700 font-bold">
                                                U
                                              </span>
                                            )}
                                            {cell.delete && (
                                              <span className="text-[0.6rem] text-red-700 font-bold">
                                                D
                                              </span>
                                            )}
                                            {cell.approve && (
                                              <span className="text-[0.6rem] text-violet-700 font-bold">
                                                A
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {flagOverrides.length > 2 && (
                                      <span className="text-[0.6rem] text-muted-foreground text-right">
                                        +{flagOverrides.length - 2} more...
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[0.65rem] text-muted-foreground font-mono">
                                    Default Staff Rules
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Panel>
              </div>

              {/* Formula Evaluator Panel */}
              <div className="space-y-6">
                <Panel
                  title="Formula Evaluator"
                  description="Interactively calculate permissions based on the enterprise RBAC engine formula."
                >
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-4">
                    <div className="text-center pb-2 border-b border-border">
                      <h4 className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                        Permission Engine Formula
                      </h4>
                      <p className="font-mono text-xs font-bold text-foreground">
                        Role + Privilege + Module + Action + Scope
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-muted-foreground block mb-1">1. Login Role</label>
                        <select
                          value={calcRole}
                          onChange={(e) => setCalcRole(e.target.value as LoginRole)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3"
                        >
                          {Object.keys(roleProfiles).map((r) => (
                            <option key={r} value={r}>
                              {roleProfiles[r as LoginRole].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {calcRole === "staff" && (
                        <div>
                          <label className="text-muted-foreground block mb-1">
                            2. Responsibility Privilege Flag
                          </label>
                          <select
                            value={calcPrivilege}
                            onChange={(e) => setCalcPrivilege(e.target.value)}
                            className="w-full h-9 rounded-md border border-input bg-background px-3"
                          >
                            {RESPONSIBILITY_FLAGS.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="text-muted-foreground block mb-1">3. Module Target</label>
                        <select
                          value={calcModule}
                          onChange={(e) => setCalcModule(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3"
                        >
                          {ERP_MODULES.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-muted-foreground block mb-1">
                          4. Action Required
                        </label>
                        <select
                          value={calcAction}
                          onChange={(e) => setCalcAction(e.target.value as typeof calcAction)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3"
                        >
                          <option value="read">Read (R)</option>
                          <option value="create">Create (C)</option>
                          <option value="update">Update (U)</option>
                          <option value="delete">Delete (D)</option>
                          <option value="approve">Approve (A)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-muted-foreground block mb-1">
                          5. Data Scope Context
                        </label>
                        <select
                          value={calcScope}
                          onChange={(e) => setCalcScope(e.target.value as PermissionScope)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3"
                        >
                          {Object.keys(scopeLabels).map((sc) => (
                            <option key={sc} value={sc}>
                              {scopeLabels[sc]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Evaluation Status:</span>
                        <Badge
                          variant={calcResult.allowed ? "default" : "destructive"}
                          className={
                            calcResult.allowed ? "bg-emerald-600 hover:bg-emerald-600" : ""
                          }
                        >
                          {calcResult.allowed ? "ACCESS GRANTED" : "ACCESS DENIED"}
                        </Badge>
                      </div>
                      <p className="text-[0.7rem] text-muted-foreground bg-background p-2.5 rounded-lg border border-border">
                        {calcResult.reason}
                      </p>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: LICENSING & FEATURE FLAGS */}
          <TabsContent value="features" className="space-y-4">
            <Panel
              title="SaaS Licensing & Feature Flags"
              description="Institutions can dynamically license modules and activate/deactivate enterprise capabilities. Disabling a feature hides corresponding sidebar elements, suppresses AI actions, and revokes granular api access immediately."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                {[
                  {
                    key: "aiAssistant",
                    name: "AI Copilot & Assistant",
                    desc: "Interactive floating assistant, predictive student risk insights, and calendar alerts.",
                    category: "Intelligence",
                  },
                  {
                    key: "analytics",
                    name: "Performance Analytics",
                    desc: "Accreditation readiness scorecards, department progression charts, and KPIs.",
                    category: "Intelligence",
                  },
                  {
                    key: "finance",
                    name: "Finance ERP Module",
                    desc: "Fee registers, online merchant invoice generation, scholarship allocations, and ledgers.",
                    category: "Operations",
                  },
                  {
                    key: "hostel",
                    name: "Hostel Management Module",
                    desc: "Room allocation workflows, Warden control, student mess lists, and occupancy registers.",
                    category: "Operations",
                  },
                  {
                    key: "transport",
                    name: "Transport & Routing Module",
                    desc: "Bus passes issuance, route grids, GPS tracking, and fleet drivers profiles.",
                    category: "Operations",
                  },
                  {
                    key: "placement",
                    name: "Placement & Recruitment Module",
                    desc: "Student resumes pipeline, recruiters dashboard, drive listings, and job offer statistics.",
                    category: "Career Services",
                  },
                  {
                    key: "library",
                    name: "Digital Library Module",
                    desc: "Book cataloging indexing, physical issue & return registers, fines, and pdf libraries.",
                    category: "Academic Support",
                  },
                ].map((item) => {
                  const enabled = featureFlags[item.key] !== false;
                  return (
                    <div
                      key={item.key}
                      className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <Badge variant="secondary" className="text-[0.6rem]">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4">
                        <span className="text-xs font-medium font-mono text-muted-foreground">
                          Status: {enabled ? "Active License" : "Disabled"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`feat-${item.key}`}
                            checked={enabled}
                            onCheckedChange={() => handleToggleFeature(item.key)}
                          />
                          <label
                            htmlFor={`feat-${item.key}`}
                            className="text-xs font-semibold cursor-pointer select-none"
                          >
                            Licensed
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 3: CONFIGURABLE APPROVAL ENGINE */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Approval Workflows List */}
              <div className="lg:col-span-2 space-y-4">
                <Panel
                  title="Configurable Approval Engine Workflows"
                  description="Design multi-step sequential approval chains for institutional processes. Define the order of responsibility roles who must sign-off on transactions."
                >
                  <div className="space-y-6">
                    {workflows.map((wf) => (
                      <div
                        key={wf.id}
                        className="border border-border rounded-xl p-4 bg-card space-y-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-border/60">
                          <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                            <GitBranch className="size-4" /> {wf.name}
                          </h4>
                          <Badge variant="outline" className="font-mono text-[0.65rem]">
                            ID: {wf.id}
                          </Badge>
                        </div>

                        {/* Steps Timeline Visualizer */}
                        <div className="flex flex-wrap items-center gap-2 py-2">
                          {wf.steps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="bg-primary/10 text-primary border border-primary/20 rounded-lg py-1.5 px-3 text-xs font-medium flex items-center gap-1.5">
                                <span className="size-4 rounded-full bg-primary/20 text-primary text-[0.6rem] font-bold grid place-items-center">
                                  {idx + 1}
                                </span>
                                {step}
                                <button
                                  onClick={() => removeWorkflowStep(wf.id, idx)}
                                  className="text-red-500 hover:text-red-700 ml-1.5 transition-colors"
                                  title="Remove step"
                                  disabled={wf.steps.length <= 1}
                                >
                                  &times;
                                </button>
                              </div>
                              {idx < wf.steps.length - 1 && (
                                <ArrowRight className="size-3.5 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Step Controller */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                          <select
                            value={tempStep}
                            onChange={(e) => setTempStep(e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-3 text-xs"
                          >
                            <option value="Faculty Advisor">Faculty Advisor</option>
                            <option value="HOD (Department Head)">HOD (Department Head)</option>
                            <option value="Dean">Dean</option>
                            <option value="Principal">Principal</option>
                            <option value="Exam Controller">Exam Controller</option>
                            <option value="Finance Officer">Finance Officer</option>
                            <option value="HR Manager">HR Manager</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1"
                            onClick={() => addWorkflowStep(wf.id)}
                          >
                            <Plus className="size-3.5" /> Add Step
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* Add New Workflow */}
              <div className="space-y-6">
                <Panel
                  title="Create Custom Workflow"
                  description="Register a new transaction type and its approval path."
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold block">Workflow Name</label>
                      <Input
                        placeholder="e.g. Hostels Gatepass Approval"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                      />
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground leading-relaxed leading-relaxed leading-relaxed leading-relaxed leading-relaxed leading-relaxed leading-relaxed bg-accent/40 rounded p-2 border border-border/40">
                      Creating a workflow will initialize a two-step approval chain:{" "}
                      <i>Faculty &rarr; HOD</i>. You can add more steps afterwards.
                    </p>
                    <Button
                      onClick={createWorkflow}
                      className="w-full bg-brand-gradient shadow-glow text-xs"
                    >
                      Create Workflow Chain
                    </Button>
                  </div>
                </Panel>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: INSTITUTION SETTINGS */}
          <TabsContent value="institution" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel
                title="Campus Details"
                description="Configure campus identities and addresses."
              >
                <div className="space-y-4">
                  {[
                    { name: "Main Campus", city: "Hyderabad, TS", code: "MC-HYD", active: true },
                    { name: "City Campus", city: "Bangalore, KA", code: "CC-BLR", active: true },
                    {
                      name: "Research Park",
                      city: "Visakhapatnam, AP",
                      code: "RP-VSP",
                      active: false,
                    },
                  ].map((campus, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <h4 className="text-sm font-semibold">{campus.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {campus.city} | Code: {campus.code}
                        </p>
                      </div>
                      <Badge variant={campus.active ? "secondary" : "outline"}>
                        {campus.active ? "Active" : "Archived"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Add Campus
                  </Button>
                </div>
              </Panel>

              <Panel
                title="Academic Calendar"
                description="Configure semesters, terms and holidays."
              >
                <div className="space-y-3">
                  <div className="rounded-xl border border-border p-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-semibold">Odd Semester 2026-27</h4>
                      <p className="text-muted-foreground mt-0.5">Aug 01, 2026 - Dec 15, 2026</p>
                    </div>
                    <Badge>Ongoing</Badge>
                  </div>
                  <div className="rounded-xl border border-border p-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-semibold">Even Semester 2026-27</h4>
                      <p className="text-muted-foreground mt-0.5">Jan 05, 2027 - May 20, 2027</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage Calendar Events
                  </Button>
                </div>
              </Panel>
            </div>
          </TabsContent>

          {/* TAB 5: SECURITY & SESSION */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel
                title="Authentication Settings"
                description="MFA & SSO credentials configurations."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold">
                        Enforce Multi-Factor Authentication (MFA)
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Require app-based OTP for administrative accounts.
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold">Single Sign-On (SSO)</h4>
                      <p className="text-xs text-muted-foreground">
                        Allow login via Microsoft Azure AD or Google Workspace.
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Session Timeout</h4>
                      <p className="text-xs text-muted-foreground">
                        Log out users after 30 minutes of inactivity.
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
              </Panel>

              <Panel title="API Credentials" description="External webhook integrations keys.">
                <div className="space-y-3">
                  <div className="rounded-xl border border-border p-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">EduSuite Core API Endpoint</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-muted-foreground font-mono text-[0.65rem] truncate bg-accent/40 rounded p-1">
                      https://api.edusuitepro.com/v2/webhooks/oauth-receiver
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Generate Integration Token
                  </Button>
                </div>
              </Panel>
            </div>
          </TabsContent>

          {/* TAB 6: BRANDING & THEME */}
          <TabsContent value="preferences" className="space-y-4">
            <Panel
              title="Branding Configuration"
              description="Customize platform logos, accent colors and titles."
            >
              <div className="space-y-4 max-w-lg">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Accent Theme Palette</h4>
                  <div className="flex gap-2">
                    {["#1d4ed8", "#4f46e5", "#06b6d4", "#10b981", "#ec4899"].map((color) => (
                      <div
                        key={color}
                        className={`size-8 rounded-full cursor-pointer border border-border flex items-center justify-center`}
                        style={{ backgroundColor: color }}
                        onClick={() => toast.success(`Primary color set to ${color}`)}
                      >
                        {color === "#1d4ed8" && <Check className="size-4 text-white" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Institution Name</h4>
                  <Input defaultValue="State Institute of Technology" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Support Contact Email</h4>
                  <Input defaultValue="support@sit.edu" />
                </div>

                <Button className="bg-brand-gradient shadow-glow">Save Branding</Button>
              </div>
            </Panel>
          </TabsContent>

          {/* TAB 7: AUDIT LOGS */}
          <TabsContent value="audit" className="space-y-4">
            <Panel
              title="System Audit Logs"
              description="Traceable actions captured by the access control engine."
            >
              <div className="overflow-x-auto border border-border rounded-xl">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action / Module</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        time: "2026-07-31 14:25:02",
                        user: "Dr. Ravi Kumar",
                        role: "Staff",
                        action: "Updated Attendance Matrix",
                        status: "Success",
                      },
                      {
                        time: "2026-07-31 14:18:50",
                        user: "Super Admin",
                        role: "Super Admin",
                        action: "Modified Role: HOD privilege flag granted",
                        status: "Success",
                      },
                      {
                        time: "2026-07-31 13:40:11",
                        user: "John Doe",
                        role: "Applicant (External)",
                        action: "Uploaded Transcript Document",
                        status: "Success",
                      },
                      {
                        time: "2026-07-31 11:15:33",
                        user: "David Miller",
                        role: "Recruiter (External)",
                        action: "Accessed Placements Drive Panel",
                        status: "Denied (Blocked)",
                      },
                    ].map((log, idx) => (
                      <TableRow key={idx} className="text-xs">
                        <TableCell className="font-mono text-muted-foreground">
                          {log.time}
                        </TableCell>
                        <TableCell className="font-semibold">{log.user}</TableCell>
                        <TableCell>{log.role}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Badge
                            variant={log.status.includes("Denied") ? "destructive" : "secondary"}
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
  );

  if (!withLayout) {
    return mainContent;
  }

  return <DashboardLayout>{mainContent}</DashboardLayout>;
}
