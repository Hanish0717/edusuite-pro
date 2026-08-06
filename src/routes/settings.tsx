import { createFileRoute, useLocation } from "@tanstack/react-router";
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
  EyeOff,
  Check,
  ToggleRight,
  GitBranch,
  ArrowRight,
  Plus,
  Trash2,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Camera,
  KeyRound,
  Laptop,
  LogOut,
  Save,
  UserCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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

const TAB_METADATA: Record<string, { title: string; description: string; icon: any }> = {
  "account-profile": {
    title: "Account Profile Details",
    description: "Update your personal profile information, display name, and contact details.",
    icon: User,
  },
  "account-password": {
    title: "Password & Security Credentials",
    description: "Manage your login password, 2FA authentication, and active browser sessions.",
    icon: KeyRound,
  },
  "account-notifications": {
    title: "Notifications & Account Preferences",
    description: "Configure email alerts, emergency push notifications, and digest preferences.",
    icon: Bell,
  },
  rbac: {
    title: "Roles & Access Matrix",
    description: "Review and customize granular permissions across all login roles and responsibility privilege flags.",
    icon: ShieldAlert,
  },
  features: {
    title: "Licensing & Feature Flags",
    description: "Manage global feature toggles, module licensing, and system capability flags.",
    icon: ToggleRight,
  },
  workflows: {
    title: "Approval Workflows",
    description: "Define multi-level approval hierarchies for leaves, expenses, and institutional requests.",
    icon: GitBranch,
  },
  institution: {
    title: "Institution Settings",
    description: "Configure campus information, academic sessions, branding, and institutional metadata.",
    icon: Building,
  },
  security: {
    title: "Security & Session Control",
    description: "Configure password policies, session timeouts, MFA requirements, and security logs.",
    icon: Key,
  },
  preferences: {
    title: "Branding & Theme Customization",
    description: "Customize portal colors, logo assets, UI theme preferences, and layout defaults.",
    icon: Palette,
  },
  audit: {
    title: "System Audit Logs",
    description: "Traceable actions captured by the access control engine and system administrators.",
    icon: Clock,
  },
};

export function SettingsPage({ withLayout = true }: { withLayout?: boolean }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab") || "account-profile";

  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const currentTab = new URLSearchParams(location.search).get("tab") || "account-profile";
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.search]);

  const activeMeta = TAB_METADATA[activeTab] || TAB_METADATA["account-profile"];
  const ActiveHeaderIcon = activeMeta.icon;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptScope, setSelectedDeptScope] = useState("all");
  const { role, profile, featureFlags, setFeatureFlags } = useRole();

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
      steps: ["Admission Desk", "Finance Officer", "Principal"],
    },
  ]);

  const [editingWorkflow, setEditingWorkflow] = useState<string | null>(null);

  // Profile Form State
  const [fullName, setFullName] = useState(profile?.personaName || "Super Admin");
  const [email, setEmail] = useState(profile?.email || "admin@edusuite.pro");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [designation, setDesignation] = useState("Platform Superuser & System Administrator");
  const [department, setDepartment] = useState("Central Administration & IT Ops");
  const [locationStr, setLocationStr] = useState("Main Campus, Admin Block - Suite 401");
  const [bio, setBio] = useState("Responsible for global platform administration, security policies, and system management.");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Security & Preferences State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [emergencyBroadcasts, setEmergencyBroadcasts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Evaluator Interactive Sandbox State
  const [calcRole, setCalcRole] = useState<LoginRole>("staff");
  const [calcPrivilege, setCalcPrivilege] = useState<string>("isExamController");
  const [calcModule, setCalcModule] = useState<string>("examination");
  const [calcAction, setCalcAction] = useState<"read" | "create" | "update" | "delete" | "approve">("read");

  const handleExport = () => {
    toast.success("System configuration exported successfully as JSON!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile details updated successfully!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account preferences saved!");
  };

  const toggleFeatureFlag = (key: string) => {
    setFeatureFlags({
      ...featureFlags,
      [key]: !featureFlags[key],
    });
    toast.success(`Feature flag "${key}" updated.`);
  };

  const handleAddWorkflowStep = (wfId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === wfId) {
          return { ...wf, steps: [...wf.steps, "Additional Approver"] };
        }
        return wf;
      })
    );
    toast.success("Added new approval step.");
  };

  const handleRemoveWorkflowStep = (wfId: string, stepIdx: number) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === wfId) {
          const newSteps = wf.steps.filter((_, idx) => idx !== stepIdx);
          return { ...wf, steps: newSteps };
        }
        return wf;
      })
    );
    toast.info("Removed approval step.");
  };

  const getEvaluatorResult = (): { allowed: boolean; scope: PermissionScope; reason: string } => {
    const base = getBasePermissions(calcRole, calcModule);
    let allowed = base[calcAction];
    let finalScope = base.scope;

    if (calcPrivilege !== "none") {
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
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <ActiveHeaderIcon className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold sm:text-2xl">{activeMeta.title}</h1>
            <p className="text-sm text-muted-foreground">{activeMeta.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 h-9">
            <Download className="size-4" /> Export Config
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

        {/* TAB: EDIT PROFILE */}
        <TabsContent value="account-profile" className="space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <div className="size-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-2xl font-bold font-mono shadow-inner">
                  {fullName.split(" ").map((n) => n[0]).join("").toUpperCase() || "SA"}
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Photo upload feature opened.")}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Camera className="size-3.5" />
                </button>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-foreground">{fullName}</h3>
                <p className="text-xs text-muted-foreground">{email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <Badge variant="secondary" className="text-[0.68rem] font-mono">
                    ID: {profile?.personaMeta || "USR-2026-001"}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]">
                    Active Status
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
                <User className="size-4 text-primary" /> Personal & Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="designation" className="text-xs font-semibold">Designation / Role Title</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="department" className="text-xs font-semibold">Department / Unit</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-semibold">Office Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label htmlFor="bio" className="text-xs font-semibold">Profile Bio / Summary</Label>
                <textarea
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" className="gap-2 bg-primary text-white font-semibold text-xs h-9 px-5 shadow-sm">
                  <Save className="size-4" /> Save Profile Changes
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* TAB: CHANGE PASSWORD & SECURITY */}
        <TabsContent value="account-password" className="space-y-6">
          <form onSubmit={handleUpdatePassword} className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <KeyRound className="size-4 text-amber-500" /> Change Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPass" className="text-xs font-semibold">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="currentPass"
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPass" className="text-xs font-semibold">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="newPass"
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="pl-9 pr-9 text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPass" className="text-xs font-semibold">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="confirmPass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-9 px-5 shadow-sm">
                <ShieldCheck className="size-4" /> Update Password
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-500" /> Two-Factor Authentication (2FA)
                </h4>
                <Badge className={twoFactorEnabled ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem]" : "bg-muted text-muted-foreground text-[0.65rem]"}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Enhance your account security by requiring an authenticator code alongside your password.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs font-medium text-foreground">Require 2FA Code on Login</span>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(val) => {
                    setTwoFactorEnabled(val);
                    toast.success(val ? "2FA enabled." : "2FA disabled.");
                  }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Laptop className="size-4 text-primary" /> Active Login Session
                </h4>
                <Badge variant="outline" className="text-[0.65rem] font-mono text-emerald-600 border-emerald-500/30">
                  Current Device
                </Badge>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">Windows • Chrome Browser</p>
                <p className="font-mono text-[0.7rem]">IP: 192.168.1.45 (Hyderabad Node)</p>
              </div>
              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Revoked all other active sessions.")}
                  className="w-full h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-1.5"
                >
                  <LogOut className="size-3.5" /> Terminate Other Sessions
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: PREFERENCES & ALERTS */}
        <TabsContent value="account-notifications" className="space-y-6">
          <form onSubmit={handleSavePreferences} className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Bell className="size-4 text-emerald-500" /> Account Notifications & Alert Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-semibold text-foreground">Email Security Alerts</p>
                  <p className="text-muted-foreground">Receive instant email notifications for new logins and password changes.</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-semibold text-foreground">System Critical Alerts</p>
                  <p className="text-muted-foreground">Get notified about critical updates, scheduled maintenance, and backup reports.</p>
                </div>
                <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-semibold text-foreground">Emergency Broadcast Alerts</p>
                  <p className="text-muted-foreground">High-priority instant push notifications dispatched during emergency events.</p>
                </div>
                <Switch checked={emergencyBroadcasts} onCheckedChange={setEmergencyBroadcasts} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-semibold text-foreground">Weekly Activity Digest</p>
                  <p className="text-muted-foreground">Receive a weekly summary email of institutional metrics and user roster changes.</p>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-5 shadow-sm">
                <Save className="size-4" /> Save Preferences
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* TAB 1: ROLES & ACCESS MATRIX */}
        <TabsContent value="rbac" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Panel
                title="Module Access Matrix"
                description="Review and customize granular permissions across all login roles and responsibility privilege flags. Click cell checkboxes to toggle permissions."
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 border-b border-border/40 pb-4">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-xs h-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Dept. Scope:</span>
                    <select
                      value={selectedDeptScope}
                      onChange={(e) => setSelectedDeptScope(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      <option value="all">All Departments</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto border border-border rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-48 font-bold">MODULES</TableHead>
                        {Object.entries(roleProfiles).map(([roleKey, rp]) => (
                          <TableHead key={roleKey} className="text-center font-bold">
                            <div>{(rp.label || roleKey).toUpperCase()}</div>
                            <div className="text-[0.65rem] font-normal text-muted-foreground font-mono">
                              ({roleKey})
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ERP_MODULES.filter(
                        (m) =>
                          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((mod) => (
                        <TableRow key={mod.id} className="hover:bg-muted/30">
                          <TableCell className="font-semibold text-xs py-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                <Building className="size-3.5" />
                              </span>
                              <span>{mod.name}</span>
                            </div>
                          </TableCell>
                          {Object.entries(roleProfiles).map(([roleKey, rp]) => {
                            const base = getBasePermissions(roleKey as LoginRole, mod.id);
                            return (
                              <TableCell key={roleKey} className="text-center py-3">
                                <div className="flex justify-center gap-1">
                                  {(["read", "create", "update", "delete", "approve"] as const).map(
                                    (act) => {
                                      const isAllowed = base[act];
                                      return (
                                        <span
                                          key={act}
                                          title={`${act.toUpperCase()}: ${isAllowed ? "Allowed" : "Denied"} (${base.scope} scope)`}
                                          className={`size-5 rounded flex items-center justify-center text-[0.65rem] font-bold font-mono border transition-all ${
                                            isAllowed
                                              ? "bg-primary/15 text-primary border-primary/30"
                                              : "bg-muted/40 text-muted-foreground/40 border-transparent opacity-40"
                                          }`}
                                        >
                                          {act[0].toUpperCase()}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                                <div className="text-[0.6rem] text-muted-foreground font-mono mt-1 uppercase">
                                  Scope: {base.scope}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel
                title="Formula Evaluator"
                description="Interactively calculate permissions based on the enterprise RBAC engine formula."
              >
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center font-mono font-bold text-primary">
                    PERMISSION ENGINE FORMULA
                    <div className="text-[0.68rem] text-muted-foreground font-sans font-normal mt-0.5">
                      Role + Privilege + Module + Action + Scope
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">1. Login Role</Label>
                    <select
                      value={calcRole}
                      onChange={(e) => setCalcRole(e.target.value as LoginRole)}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {Object.entries(roleProfiles).map(([roleKey, rp]) => (
                        <option key={roleKey} value={roleKey}>{rp.label || rp.personaName || roleKey} ({roleKey})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">2. Responsibility Privilege Flag</Label>
                    <select
                      value={calcPrivilege}
                      onChange={(e) => setCalcPrivilege(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="none">None (Standard Role Default)</option>
                      {RESPONSIBILITY_FLAGS.map((f) => (
                        <option key={f.key} value={f.key}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">3. Module Target</Label>
                    <select
                      value={calcModule}
                      onChange={(e) => setCalcModule(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {ERP_MODULES.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">4. Action Required</Label>
                    <div className="grid grid-cols-5 gap-1">
                      {(["read", "create", "update", "delete", "approve"] as const).map((act) => (
                        <Button
                          key={act}
                          type="button"
                          variant={calcAction === act ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCalcAction(act)}
                          className="h-7 text-[0.68rem] uppercase font-mono p-0"
                        >
                          {act}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1.5 ${
                    calcResult.allowed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <Shield className="size-4" /> Evaluator Decision
                      </span>
                      <Badge className={calcResult.allowed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}>
                        {calcResult.allowed ? "ALLOWED" : "DENIED"}
                      </Badge>
                    </div>
                    <p className="text-[0.72rem] leading-relaxed">{calcResult.reason}</p>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: LICENSING & FEATURE FLAGS */}
        <TabsContent value="features" className="space-y-4">
          <Panel title="Global Feature Flags" description="Enable or disable modular enterprise subsystems live.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(featureFlags).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card">
                  <div>
                    <p className="font-semibold text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-[0.68rem] text-muted-foreground font-mono">{key}</p>
                  </div>
                  <Switch checked={enabled} onCheckedChange={() => toggleFeatureFlag(key)} />
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 3: APPROVAL WORKFLOWS */}
        <TabsContent value="workflows" className="space-y-4">
          <Panel title="Approval Workflows Engine" description="Configure multi-step approval pipelines per institutional action.">
            <div className="space-y-4">
              {workflows.map((wf) => (
                <div key={wf.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm flex items-center gap-2">
                      <GitBranch className="size-4 text-primary" /> {wf.name}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddWorkflowStep(wf.id)}
                      className="h-7 text-xs gap-1"
                    >
                      <Plus className="size-3" /> Add Step
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {wf.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border font-medium">
                          <span className="size-4 rounded-full bg-primary/20 text-primary text-[0.65rem] font-bold flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                          {wf.steps.length > 1 && (
                            <button
                              onClick={() => handleRemoveWorkflowStep(wf.id, idx)}
                              className="text-muted-foreground hover:text-rose-500 ml-1"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          )}
                        </div>
                        {idx < wf.steps.length - 1 && <ArrowRight className="size-3.5 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 4: INSTITUTION SETTINGS */}
        <TabsContent value="institution" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Institutional Profile" description="Basic campus details.">
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label>Institution Name</Label>
                  <Input defaultValue="State Institute of Technology" />
                </div>
                <div className="space-y-1">
                  <Label>Campus Code / ID</Label>
                  <Input defaultValue="SIT-HYD-MAIN" />
                </div>
                <div className="space-y-1">
                  <Label>Academic Year</Label>
                  <Input defaultValue="2026 - 2027" />
                </div>
                <Button className="mt-2 bg-primary text-white text-xs h-8">Save Profile</Button>
              </div>
            </Panel>

            <Panel title="Academic Terms" description="Configure semesters and breaks.">
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-border flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Autumn Semester 2026</p>
                    <p className="text-muted-foreground text-[0.7rem]">Aug 01, 2026 - Dec 20, 2026</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600">Active</Badge>
                </div>
                <div className="p-3 rounded-xl border border-border flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Spring Semester 2027</p>
                    <p className="text-muted-foreground text-[0.7rem]">Jan 05, 2027 - May 20, 2027</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
            </Panel>
          </div>
        </TabsContent>

        {/* TAB 5: SECURITY & SESSION */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Authentication Settings" description="MFA & SSO credentials configurations.">
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <h4 className="font-semibold">Enforce Multi-Factor Authentication (MFA)</h4>
                    <p className="text-muted-foreground">Require app-based OTP for administrative accounts.</p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <h4 className="font-semibold">Single Sign-On (SSO)</h4>
                    <p className="text-muted-foreground">Allow login via Microsoft Azure AD or Google Workspace.</p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Session Timeout</h4>
                    <p className="text-muted-foreground">Log out users after 30 minutes of inactivity.</p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
              </div>
            </Panel>

            <Panel title="API Credentials" description="External webhook integrations keys.">
              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-border p-3">
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
          <Panel title="Branding Configuration" description="Customize platform logos, accent colors and titles.">
            <div className="space-y-4 max-w-lg text-xs">
              <div className="space-y-2">
                <h4 className="font-semibold">Accent Theme Palette</h4>
                <div className="flex gap-2">
                  {["#1d4ed8", "#4f46e5", "#06b6d4", "#10b981", "#ec4899"].map((color) => (
                    <div
                      key={color}
                      className="size-8 rounded-full cursor-pointer border border-border flex items-center justify-center"
                      style={{ backgroundColor: color }}
                      onClick={() => toast.success(`Primary color set to ${color}`)}
                    >
                      {color === "#1d4ed8" && <Check className="size-4 text-white" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Institution Name</Label>
                <Input defaultValue="State Institute of Technology" />
              </div>

              <div className="space-y-1.5">
                <Label>Support Contact Email</Label>
                <Input defaultValue="support@sit.edu" />
              </div>

              <Button className="bg-brand-gradient text-white text-xs h-9 px-5 shadow-glow">Save Branding</Button>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 7: AUDIT LOGS */}
        <TabsContent value="audit" className="space-y-4">
          <Panel title="System Audit Logs" description="Traceable actions captured by the access control engine.">
            <div className="overflow-x-auto border border-border rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
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
                      <TableCell className="font-mono text-muted-foreground">{log.time}</TableCell>
                      <TableCell className="font-semibold">{log.user}</TableCell>
                      <TableCell>{log.role}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Badge variant={log.status.includes("Denied") ? "destructive" : "secondary"}>
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

  if (withLayout) {
    return <DashboardLayout>{mainContent}</DashboardLayout>;
  }

  return mainContent;
}
