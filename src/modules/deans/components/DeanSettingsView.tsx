import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Calendar,
  Download,
  FileText,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Lock,
  Smartphone,
  Laptop,
  Check,
  Globe,
  Upload,
  RefreshCw,
  Clock,
  Layers,
  Award,
  BookOpen,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileCheck,
  CreditCard,
  Building,
  Key,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeanHeader } from "./DeanHeader";

export type DeanRoleType =
  | "academic_dean"
  | "student_dean"
  | "iqac_dean"
  | "ima_dean"
  | "research_dean"
  | "finance_dean"
  | "examination_dean"
  | "placement_dean";

interface DeanProfileData {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  mobile: string;
  officeLocation: string;
  avatarUrl?: string;
}

const DEAN_PROFILES: Record<DeanRoleType, DeanProfileData> = {
  academic_dean: {
    name: "Prof. Anand Kumar",
    employeeId: "EMP-ACAD-001",
    designation: "Dean of Academic Affairs",
    department: "Academic Administration",
    email: "academic_dean@college.com",
    mobile: "+91 98765 43210",
    officeLocation: "Admin Block - Room 204",
  },
  student_dean: {
    name: "Prof. Student Dean",
    employeeId: "EMP-STU-002",
    designation: "Dean of Student Affairs",
    department: "Student Welfare & Affairs",
    email: "student_dean@college.com",
    mobile: "+91 98765 43211",
    officeLocation: "Student Center - Room 102",
  },
  iqac_dean: {
    name: "Prof. IQAC Dean",
    employeeId: "EMP-IQAC-003",
    designation: "Dean of Internal Quality Assurance",
    department: "Quality Assurance Cell",
    email: "iqac_dean@college.com",
    mobile: "+91 98765 43212",
    officeLocation: "IQAC Directorate - Room 301",
  },
  ima_dean: {
    name: "Prof. IMA Dean",
    employeeId: "EMP-IMA-004",
    designation: "Dean of Infrastructure & Asset Mgt",
    department: "Infrastructure & Labs",
    email: "ima_dean@college.com",
    mobile: "+91 98765 43213",
    officeLocation: "Tech Block B - Room 105",
  },
  research_dean: {
    name: "Prof. Research Dean",
    employeeId: "EMP-RND-005",
    designation: "Dean of Research & Development",
    department: "R&D Directorate",
    email: "research_dean@college.com",
    mobile: "+91 98765 43214",
    officeLocation: "Research Innovation Hub - Room 402",
  },
  finance_dean: {
    name: "Prof. Finance Dean",
    employeeId: "EMP-FIN-006",
    designation: "Dean of Financial Operations",
    department: "Finance & Accounts",
    email: "finance_dean@college.com",
    mobile: "+91 98765 43215",
    officeLocation: "Finance Block - Room 101",
  },
  examination_dean: {
    name: "Prof. Examination Dean",
    employeeId: "EMP-EXAM-007",
    designation: "Dean of Examinations",
    department: "Examination Branch",
    email: "examination_dean@college.com",
    mobile: "+91 98765 43216",
    officeLocation: "Exam Building - Ground Floor",
  },
  placement_dean: {
    name: "Prof. Placement Dean",
    employeeId: "EMP-TPO-008",
    designation: "Dean of Placement & Training",
    department: "Career Development Cell",
    email: "placement_dean@college.com",
    mobile: "+91 98765 43217",
    officeLocation: "Placement Cell - Block C",
  },
};

interface DeanSettingsViewProps {
  role: DeanRoleType;
  title: string;
  subtitle: string;
}

export function DeanSettingsView({ role, title, subtitle }: DeanSettingsViewProps) {
  const initialProfile = DEAN_PROFILES[role];
  const [profile, setProfile] = useState<DeanProfileData>(initialProfile);
  const [isDirty, setIsDirty] = useState(false);

  // Common Notification Toggles
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    system: true,
    meetings: true,
    approvals: true,
    deadlines: true,
  });

  // Security & Appearance
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [theme, setTheme] = useState("light");
  const [sidebarMode, setSidebarMode] = useState("expanded");
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("en-US");

  // Calendar
  const [workingDays, setWorkingDays] = useState("Mon-Fri");
  const [officeHours, setOfficeHours] = useState("09:00 - 17:00");
  const [meetingAvailability, setMeetingAvailability] = useState("appointment");
  const [syncAcademicCal, setSyncAcademicCal] = useState(true);

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Role-Specific State
  const [roleSettings, setRoleSettings] = useState(() => getInitialRoleSettings(role));

  const handleProfileChange = (key: keyof DeanProfileData, val: string) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleRoleSettingChange = (key: string, val: any) => {
    setRoleSettings((prev: any) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    toast.success("Settings saved successfully!");
    setIsDirty(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleReset = () => {
    setProfile(initialProfile);
    setRoleSettings(getInitialRoleSettings(role));
    setIsDirty(false);
    toast.info("Settings reset to default values.");
  };

  return (
    <div className="space-y-6 pb-12">
      <DeanHeader
        activeDeanId={role.replace("_", "-")}
        title={title}
        subtitle={subtitle}
        badge="SETTINGS"
      />

      {/* UNSAVED CHANGES BANNER */}
      {isDirty && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <RefreshCw className="size-4 animate-spin" />
            <span>You have unsaved changes in your settings configuration.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleReset} className="h-8 text-xs cursor-pointer">
              <RotateCcw className="size-3.5 mr-1" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave} className="h-8 text-xs bg-primary text-primary-foreground font-bold cursor-pointer">
              <Save className="size-3.5 mr-1" /> Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* SETTINGS TABS */}
      <Tabs defaultValue="role_specific" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="role_specific" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sliders className="size-3.5" /> Role-Specific Settings
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="size-3.5" /> Executive Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="size-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="size-3.5" /> Security & Access
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="size-3.5" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="size-3.5" /> Calendar & Hours
          </TabsTrigger>
          <TabsTrigger value="import_export" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Download className="size-3.5" /> Import / Export
          </TabsTrigger>
          <TabsTrigger value="activity_logs" className="text-xs font-bold gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="size-3.5" /> Activity Logs
          </TabsTrigger>
        </TabsList>

        {/* 1. ROLE-SPECIFIC SETTINGS TAB */}
        <TabsContent value="role_specific" className="space-y-6">
          <RenderRoleSpecificSettings
            role={role}
            roleSettings={roleSettings}
            onChange={handleRoleSettingChange}
          />
        </TabsContent>

        {/* 2. EXECUTIVE PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Panel title="Executive Profile Information" description="Update personal and official administrative details.">
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="size-16 rounded-full bg-primary/10 border-2 border-primary grid place-items-center font-bold text-primary text-xl">
                  {profile.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{profile.name}</h3>
                  <p className="text-xs text-muted-foreground">{profile.designation}</p>
                  <Badge className="mt-1 bg-primary/10 text-primary font-mono text-[0.65rem]">
                    {profile.employeeId}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Full Name & Title</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Employee ID</Label>
                  <Input
                    value={profile.employeeId}
                    disabled
                    className="h-9 text-xs bg-muted font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Official Designation</Label>
                  <Input
                    value={profile.designation}
                    onChange={(e) => handleProfileChange("designation", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Administrative Department</Label>
                  <Input
                    value={profile.department}
                    onChange={(e) => handleProfileChange("department", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Official Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Mobile Number</Label>
                  <Input
                    value={profile.mobile}
                    onChange={(e) => handleProfileChange("mobile", e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Office Location / Dean Secretariat</Label>
                  <Input
                    value={profile.officeLocation}
                    onChange={(e) => handleProfileChange("officeLocation", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Password Management" description="Change your account security password.">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Current Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* 3. NOTIFICATION PREFERENCES TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Panel title="Notification Channel Preferences" description="Configure alerts across email, mobile, and system.">
            <div className="space-y-4">
              {[
                { key: "email", title: "Email Notifications", desc: "Receive summary reports and critical portal updates via official email." },
                { key: "sms", title: "SMS Notifications", desc: "Receive urgent emergency & high-priority SMS alerts." },
                { key: "push", title: "Push Notifications", desc: "Real-time browser notifications for workflow approvals." },
                { key: "system", title: "System Notifications", desc: "In-app notification bell alerts." },
                { key: "meetings", title: "Meeting Reminders", desc: "Alerts 15 minutes prior to scheduled council & BOS meetings." },
                { key: "approvals", title: "Approval Alerts", desc: "Instant notifications when new requests require Dean signature." },
                { key: "deadlines", title: "Deadline Alerts", desc: "Automated reminders for pending accreditation and budget deadlines." },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-accent/20 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[item.key]}
                    onChange={(e) => {
                      setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }));
                      setIsDirty(true);
                    }}
                    className="size-4 accent-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* 4. SECURITY & ACCESS TAB */}
        <TabsContent value="security" className="space-y-6">
          <Panel title="Security & Multi-Factor Authentication" description="Manage session security and active devices.">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <Key className="size-4 text-primary" /> Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Require OTP verification on mobile phone during login.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => {
                    setTwoFactor(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="size-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Session Timeout Duration</Label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => {
                    setSessionTimeout(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="15">15 Minutes (High Security)</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">1 Hour</option>
                  <option value="240">4 Hours</option>
                </select>
              </div>

              <div>
                <h4 className="text-xs font-bold mb-3">Active Session Devices</h4>
                <div className="space-y-2">
                  <div className="p-3 border border-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Laptop className="size-5 text-primary" />
                      <div>
                        <p className="font-bold">Windows PC — Chrome Browser (Current Session)</p>
                        <p className="text-[11px] text-muted-foreground font-mono">IP: 182.73.19.45 • Hyderabad, India</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Active Now</Badge>
                  </div>

                  <div className="p-3 border border-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Smartphone className="size-5 text-muted-foreground" />
                      <div>
                        <p className="font-bold">iPhone 15 Pro — EduSuite Mobile App</p>
                        <p className="text-[11px] text-muted-foreground font-mono">IP: 49.207.12.88 • 2 Hours Ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-[0.65rem] text-destructive hover:bg-destructive/10">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* 5. APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-6">
          <Panel title="Portal Display & Theme Preferences" description="Customize interface theme and font scaling.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Theme Mode</Label>
                <select
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="light">Light Theme (Default ERP)</option>
                  <option value="dark">Dark Slate Theme</option>
                  <option value="system">System Synchronized</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Sidebar Mode</Label>
                <select
                  value={sidebarMode}
                  onChange={(e) => {
                    setSidebarMode(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="expanded">Expanded Default</option>
                  <option value="collapsed">Icon Only Collapsed</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Font Scaling</Label>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="small">Compact (12px)</option>
                  <option value="medium">Standard (14px)</option>
                  <option value="large">Comfortable (16px)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Interface Language</Label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-UK">English (United Kingdom)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* 6. CALENDAR & HOURS TAB */}
        <TabsContent value="calendar" className="space-y-6">
          <Panel title="Academic Calendar & Office Availability" description="Set Dean office hours and calendar sync rules.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Working Days</Label>
                <select
                  value={workingDays}
                  onChange={(e) => {
                    setWorkingDays(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="Mon-Fri">Monday to Friday (5 Days)</option>
                  <option value="Mon-Sat">Monday to Saturday (6 Days)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Office Hours</Label>
                <input
                  type="text"
                  value={officeHours}
                  onChange={(e) => {
                    setOfficeHours(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Meeting Availability</Label>
                <select
                  value={meetingAvailability}
                  onChange={(e) => {
                    setMeetingAvailability(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="appointment">By Appointment Only</option>
                  <option value="open">Open Door Hours (14:00 - 16:00)</option>
                  <option value="restricted">Restricted / Emergency Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-xl mt-6">
                <div>
                  <h4 className="text-xs font-bold">Academic Calendar Sync</h4>
                  <p className="text-[11px] text-muted-foreground">Auto-sync holidays & exam dates with Dean calendar.</p>
                </div>
                <input
                  type="checkbox"
                  checked={syncAcademicCal}
                  onChange={(e) => {
                    setSyncAcademicCal(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="size-4 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* 7. IMPORT / EXPORT TAB */}
        <TabsContent value="import_export" className="space-y-6">
          <Panel title="Configuration Backup & Data Export" description="Export configuration files or download module logs.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border border-border rounded-xl space-y-3 bg-card">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Download className="size-4 text-primary" /> Export Portal Configuration
                </h4>
                <p className="text-[11px] text-muted-foreground">Download current settings and role preferences as JSON file.</p>
                <Button
                  size="sm"
                  onClick={() => toast.success("Configuration exported successfully!")}
                  className="text-xs bg-primary text-primary-foreground font-bold cursor-pointer"
                >
                  Export Settings JSON
                </Button>
              </div>

              <div className="p-4 border border-border rounded-xl space-y-3 bg-card">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Upload className="size-4 text-primary" /> Import Configuration
                </h4>
                <p className="text-[11px] text-muted-foreground">Restore portal settings from a previously saved JSON file.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Select configuration JSON file to upload.")}
                  className="text-xs cursor-pointer"
                >
                  Import Configuration File
                </Button>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* 8. ACTIVITY LOGS TAB */}
        <TabsContent value="activity_logs" className="space-y-6">
          <Panel title="Dean Activity & Configuration History" description="Audit log of recent system modifications and approvals.">
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action Description</th>
                    <th className="p-3">User IP Address</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-mono text-muted-foreground">2026-08-06 11:45:10</td>
                    <td className="p-3 font-bold text-foreground">Updated Notification Preferences</td>
                    <td className="p-3 font-mono text-muted-foreground">182.73.19.45</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Success</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-mono text-muted-foreground">2026-08-05 16:20:04</td>
                    <td className="p-3 font-bold text-foreground">Saved Role Configuration Rules</td>
                    <td className="p-3 font-mono text-muted-foreground">182.73.19.45</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Success</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-mono text-muted-foreground">2026-08-04 09:12:33</td>
                    <td className="p-3 font-bold text-foreground">Successful Portal Login</td>
                    <td className="p-3 font-mono text-muted-foreground">49.207.12.88</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Success</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={handleReset} className="text-xs cursor-pointer">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} className="text-xs bg-primary text-primary-foreground font-bold cursor-pointer gap-1.5">
          <Save className="size-4" /> Save All Settings
        </Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HELPER: INITIAL ROLE SPECIFIC VALUES
// ----------------------------------------------------------------------
function getInitialRoleSettings(role: DeanRoleType) {
  switch (role) {
    case "academic_dean":
      return {
        academicYear: "2025-2026",
        semester: "Odd Semester (Jul - Dec)",
        curriculumFramework: "NEP 2020 & CBCS",
        minCreditsBtech: "160",
        facultyWorkloadHours: "16",
        attendanceThreshold: "75",
        timetableSlotsPerDay: "8",
        gradeScale: "10-Point Relative Scale",
      };
    case "student_dean":
      return {
        scholarshipScheme: "Merit-Cum-Means & State NSP",
        grievanceSLA: "48 Hours Tier-1 Resolution",
        disciplinePolicy: "Zero Tolerance Code 2025",
        counsellingHours: "14:00 - 17:00 Daily",
        hostelCurfew: "22:00 PM Biometric Lockout",
        studentClubsCount: "24 Recognized Clubs",
        certificateSLA: "24 Hours Automated Sign",
      };
    case "iqac_dean":
      return {
        naacTargetGrade: "Grade A++ (Cycle 3)",
        nbaAccreditedDepts: "6 Engineering Programs",
        aqarSubmissionDate: "2025-11-30",
        ssrVerificationWorkflow: "Double Tier Faculty Review",
        coPoAttainmentTarget: "70% Minimum Threshold",
        internalAuditFrequency: "Quarterly Audits",
      };
    case "ima_dean":
      return {
        activeLaboratories: "48 Advanced Labs",
        equipmentMaintenanceInterval: "Monthly Preventive Check",
        empanelledVendorsCount: "35 Approved OEMs",
        maxDirectPurchaseLimit: "₹5,00,000",
        amcRenewalCycle: "Annual December Renewal",
      };
    case "research_dean":
      return {
        activeFundingAgencies: "DST-SERB, AICTE, ISRO, DRDO",
        patentFilingReimbursement: "100% Institutional Support",
        approvedJournalIndices: "Scopus, Web of Science, IEEE",
        seedMoneyMaxGrant: "₹2,00,000 per Faculty",
        phdProgressReviewInterval: "Bi-Annual DRC Meetings",
      };
    case "finance_dean":
      return {
        btechTuitionFee: "₹1,25,000 / Academic Year",
        financialYearCycle: "FY 2025-2026 (Apr - Mar)",
        vendorPaymentTerms: "Net-30 Days NEFT/RTGS",
        taxExemptionStatus: "12A & 80G Educational Exemption",
        paymentGatewayProvider: "Razorpay / HDFC Integrated",
      };
    case "examination_dean":
      return {
        endSemExamDuration: "3 Hours (70 Marks)",
        hallTicketAttendanceMin: "75% Attendance Required",
        revaluationWindowDays: "15 Days Post Results",
        invigilatorStudentRatio: "1 : 30 Candidates",
        supplementaryExamRule: "Instant Supply for Final Year",
      };
    case "placement_dean":
      return {
        placementSeason: "2026–2027",
        eligibilityCgpa: "7.0",
        maxStandingBacklogs: "1",
        academicMinPercentage: "60%",
        interviewMode: "Hybrid (Online & Offline)",
        superDreamCtc: "₹15,00,000+ LPA",
        dreamCtc: "₹8,00,000 - ₹15,00,000 LPA",
        coreCtc: "₹4,50,000 - ₹8,00,000 LPA",
        massCtc: "₹3,50,000 - ₹4,50,000 LPA",
        overallPlacementTarget: "95%",
        coreBranchTarget: "100%",
        internshipDuration: "6 Months Final Semester",
        minStipendThreshold: "₹15,000 / Month",
        offerAcceptanceSLA: "48 Hours",
        singleOfferPolicy: true,
        mockInterviewRequirement: "2 Mandatory Mock Rounds",
        aptitudeCutoffPercent: "60%",
        codingCutoffPercent: "70%",
        topRecruiters: "TCS, Infosys, Accenture, Cognizant, Capgemini, Wipro, Deloitte, Microsoft, Amazon, Google",
        recruiterHospitality: "VIP Guest House & Executive Dining",
        alumniReferralPriority: true,
        industryMoUsCount: "35 Active Corporate MoUs",
        resumeVerificationSLA: "24 Hours (AI + TPO Sign)",
        driveWorkflowStages: "Registration → Aptitude → Technical → HR → Offer",
        notificationTemplate: "Dear Student, Drive for {Company} scheduled on {Date}. Register before {Deadline}.",
        emailTemplate: "Dear Recruiter, Welcome to Anurag University Campus Drive 2026-2027.",
      };
  }
}

// ----------------------------------------------------------------------
// HELPER: RENDER ROLE-SPECIFIC PANEL
// ----------------------------------------------------------------------
function RenderRoleSpecificSettings({
  role,
  roleSettings,
  onChange,
}: {
  role: DeanRoleType;
  roleSettings: any;
  onChange: (key: string, val: any) => void;
}) {
  switch (role) {
    case "academic_dean":
      return (
        <Panel title="Academic Configuration & Regulation Rules" description="Define university curriculum, credit structure, and academic rules.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Academic Calendar Year</Label>
              <Input value={roleSettings.academicYear} onChange={(e) => onChange("academicYear", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Active Semester Cycle</Label>
              <Input value={roleSettings.semester} onChange={(e) => onChange("semester", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Curriculum Framework</Label>
              <Input value={roleSettings.curriculumFramework} onChange={(e) => onChange("curriculumFramework", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Minimum Credit Requirement (B.Tech)</Label>
              <Input value={roleSettings.minCreditsBtech} onChange={(e) => onChange("minCreditsBtech", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Faculty Teaching Workload (Hours/Week)</Label>
              <Input value={roleSettings.facultyWorkloadHours} onChange={(e) => onChange("facultyWorkloadHours", e.target.value)} className="h-9 text-xs font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mandatory Attendance Threshold (%)</Label>
              <Input value={roleSettings.attendanceThreshold} onChange={(e) => onChange("attendanceThreshold", e.target.value)} className="h-9 text-xs font-mono text-emerald-600 font-bold" />
            </div>
          </div>
        </Panel>
      );

    case "student_dean":
      return (
        <Panel title="Student Administration & Welfare Configuration" description="Set scholarship rules, grievance SLAs, and student conduct guidelines.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Active Scholarship Schemes</Label>
              <Input value={roleSettings.scholarshipScheme} onChange={(e) => onChange("scholarshipScheme", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Grievance Resolution SLA</Label>
              <Input value={roleSettings.grievanceSLA} onChange={(e) => onChange("grievanceSLA", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Disciplinary Conduct Code</Label>
              <Input value={roleSettings.disciplinePolicy} onChange={(e) => onChange("disciplinePolicy", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hostel Curfew Lockout Time</Label>
              <Input value={roleSettings.hostelCurfew} onChange={(e) => onChange("hostelCurfew", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
            </div>
          </div>
        </Panel>
      );

    case "iqac_dean":
      return (
        <Panel title="Quality Assurance & Accreditation Settings" description="Define NAAC targets, NBA metrics, and internal audit schedules.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">NAAC Cycle Target Grade</Label>
              <Input value={roleSettings.naacTargetGrade} onChange={(e) => onChange("naacTargetGrade", e.target.value)} className="h-9 text-xs font-extrabold text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">NBA Accredited Programs</Label>
              <Input value={roleSettings.nbaAccreditedDepts} onChange={(e) => onChange("nbaAccreditedDepts", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">AQAR Submission Deadline</Label>
              <Input value={roleSettings.aqarSubmissionDate} onChange={(e) => onChange("aqarSubmissionDate", e.target.value)} className="h-9 text-xs font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">CO-PO Target Attainment (%)</Label>
              <Input value={roleSettings.coPoAttainmentTarget} onChange={(e) => onChange("coPoAttainmentTarget", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
            </div>
          </div>
        </Panel>
      );

    case "ima_dean":
      return (
        <Panel title="Infrastructure & Lab Asset Settings" description="Configure laboratory inventories, equipment maintenance, and purchase limits.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Active Laboratories Count</Label>
              <Input value={roleSettings.activeLaboratories} onChange={(e) => onChange("activeLaboratories", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Direct Purchase Approval Limit</Label>
              <Input value={roleSettings.maxDirectPurchaseLimit} onChange={(e) => onChange("maxDirectPurchaseLimit", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Maintenance Schedule Interval</Label>
              <Input value={roleSettings.equipmentMaintenanceInterval} onChange={(e) => onChange("equipmentMaintenanceInterval", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
          </div>
        </Panel>
      );

    case "research_dean":
      return (
        <Panel title="Research & Innovation Settings" description="Configure research grants, patent filing support, and journal indexes.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Approved Funding Agencies</Label>
              <Input value={roleSettings.activeFundingAgencies} onChange={(e) => onChange("activeFundingAgencies", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Faculty Seed Money Grant Limit</Label>
              <Input value={roleSettings.seedMoneyMaxGrant} onChange={(e) => onChange("seedMoneyMaxGrant", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Journal Index Requirements</Label>
              <Input value={roleSettings.approvedJournalIndices} onChange={(e) => onChange("approvedJournalIndices", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
          </div>
        </Panel>
      );

    case "finance_dean":
      return (
        <Panel title="Financial Structure & Payment Configuration" description="Set tuition fee rules, budget cycles, and payment gateway rules.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">B.Tech Annual Tuition Fee</Label>
              <Input value={roleSettings.btechTuitionFee} onChange={(e) => onChange("btechTuitionFee", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Financial Year Cycle</Label>
              <Input value={roleSettings.financialYearCycle} onChange={(e) => onChange("financialYearCycle", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vendor Payment Terms</Label>
              <Input value={roleSettings.vendorPaymentTerms} onChange={(e) => onChange("vendorPaymentTerms", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
          </div>
        </Panel>
      );

    case "examination_dean":
      return (
        <Panel title="Examination Administration Settings" description="Configure exam durations, hall ticket criteria, and grading policy.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">End-Semester Exam Duration</Label>
              <Input value={roleSettings.endSemExamDuration} onChange={(e) => onChange("endSemExamDuration", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hall Ticket Attendance Cutoff</Label>
              <Input value={roleSettings.hallTicketAttendanceMin} onChange={(e) => onChange("hallTicketAttendanceMin", e.target.value)} className="h-9 text-xs font-mono font-bold text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Revaluation Application Window</Label>
              <Input value={roleSettings.revaluationWindowDays} onChange={(e) => onChange("revaluationWindowDays", e.target.value)} className="h-9 text-xs font-semibold" />
            </div>
          </div>
        </Panel>
      );

    case "placement_dean":
      return (
        <div className="space-y-6">
          <Panel title="Placement Configuration & Campus Drive Rules" description="Executive management of corporate drives, CTC bands, student eligibility, and recruiter management.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Placement Season</Label>
                <Input value={roleSettings.placementSeason || "2026–2027"} onChange={(e) => onChange("placementSeason", e.target.value)} className="h-9 text-xs font-bold text-primary" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Minimum Eligibility CGPA</Label>
                <Input value={roleSettings.eligibilityCgpa || "7.0"} onChange={(e) => onChange("eligibilityCgpa", e.target.value)} className="h-9 text-xs font-mono font-bold text-emerald-600" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Maximum Standing Backlogs Allowed</Label>
                <Input value={roleSettings.maxStandingBacklogs || "1"} onChange={(e) => onChange("maxStandingBacklogs", e.target.value)} className="h-9 text-xs font-mono" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Minimum Academic 10th/12th/UG Cutoff</Label>
                <Input value={roleSettings.academicMinPercentage || "60%"} onChange={(e) => onChange("academicMinPercentage", e.target.value)} className="h-9 text-xs font-mono" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Interview Mode</Label>
                <select
                  value={roleSettings.interviewMode || "Hybrid (Online & Offline)"}
                  onChange={(e) => onChange("interviewMode", e.target.value)}
                  className="w-full h-9 text-xs rounded-xl border border-input bg-card px-3 font-semibold"
                >
                  <option value="Online">Online / Remote Only</option>
                  <option value="Offline">Offline / On-Campus Only</option>
                  <option value="Hybrid (Online & Offline)">Hybrid (Online & Offline)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mandatory Internship Duration</Label>
                <Input value={roleSettings.internshipDuration || "6 Months Final Semester"} onChange={(e) => onChange("internshipDuration", e.target.value)} className="h-9 text-xs font-semibold" />
              </div>
            </div>
          </Panel>

          <Panel title="Company Categories & CTC Package Bands" description="Configure salary tier cutoffs and tier-wise recruitment rules.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Super Dream CTC Cutoff</Label>
                <Input value={roleSettings.superDreamCtc || "₹15,00,000+ LPA"} onChange={(e) => onChange("superDreamCtc", e.target.value)} className="h-9 text-xs font-mono font-extrabold text-purple-600" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Dream Category CTC Range</Label>
                <Input value={roleSettings.dreamCtc || "₹8,00,000 - ₹15,00,000 LPA"} onChange={(e) => onChange("dreamCtc", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Core Category CTC Range</Label>
                <Input value={roleSettings.coreCtc || "₹4,50,000 - ₹8,00,000 LPA"} onChange={(e) => onChange("coreCtc", e.target.value)} className="h-9 text-xs font-mono font-bold text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mass Recruiter CTC Range</Label>
                <Input value={roleSettings.massCtc || "₹3,50,000 - ₹4,50,000 LPA"} onChange={(e) => onChange("massCtc", e.target.value)} className="h-9 text-xs font-mono" />
              </div>
            </div>
          </Panel>

          <Panel title="Recruiter Management & Partner Companies" description="Top corporate hiring partners and empanelment protocols.">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Top Empanelled Recruiters</Label>
                <Input value={roleSettings.topRecruiters || "TCS, Infosys, Accenture, Cognizant, Capgemini, Wipro, Deloitte, Microsoft, Amazon, Google"} onChange={(e) => onChange("topRecruiters", e.target.value)} className="h-9 text-xs font-medium" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["TCS", "Infosys", "Accenture", "Cognizant", "Capgemini", "Wipro", "Deloitte", "Microsoft", "Amazon", "Google"].map((co) => (
                  <Badge key={co} className="bg-primary/10 text-primary font-mono text-[0.65rem] px-2 py-0.5">
                    ✓ {co}
                  </Badge>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Assessment & Selection Stage Rules" description="Configure test cutoffs, mock interviews, and evaluation weightages.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Aptitude Test Cutoff (%)</Label>
                <Input value={roleSettings.aptitudeCutoffPercent || "60%"} onChange={(e) => onChange("aptitudeCutoffPercent", e.target.value)} className="h-9 text-xs font-mono font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Technical Assessment Cutoff (%)</Label>
                <Input value={roleSettings.codingCutoffPercent || "70%"} onChange={(e) => onChange("codingCutoffPercent", e.target.value)} className="h-9 text-xs font-mono font-bold text-primary" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mock Interview Requirements</Label>
                <Input value={roleSettings.mockInterviewRequirement || "2 Mandatory Mock Rounds"} onChange={(e) => onChange("mockInterviewRequirement", e.target.value)} className="h-9 text-xs font-semibold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Resume Verification SLA</Label>
                <Input value={roleSettings.resumeVerificationSLA || "24 Hours (AI + TPO Sign)"} onChange={(e) => onChange("resumeVerificationSLA", e.target.value)} className="h-9 text-xs font-mono" />
              </div>
            </div>
          </Panel>

          <Panel title="Placement Targets & Workflow Rules" description="Define institutional targets, offer SLAs, and notification templates.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Overall Placement Target (%)</Label>
                <Input value={roleSettings.overallPlacementTarget || "95%"} onChange={(e) => onChange("overallPlacementTarget", e.target.value)} className="h-9 text-xs font-mono font-extrabold text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Core Branch Target (%)</Label>
                <Input value={roleSettings.coreBranchTarget || "100%"} onChange={(e) => onChange("coreBranchTarget", e.target.value)} className="h-9 text-xs font-mono font-extrabold text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Student Offer Acceptance SLA</Label>
                <Input value={roleSettings.offerAcceptanceSLA || "48 Hours"} onChange={(e) => onChange("offerAcceptanceSLA", e.target.value)} className="h-9 text-xs font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Corporate MoUs Count</Label>
                <Input value={roleSettings.industryMoUsCount || "35 Active Corporate MoUs"} onChange={(e) => onChange("industryMoUsCount", e.target.value)} className="h-9 text-xs font-semibold" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Placement Drive Workflow Stages</Label>
                <Input value={roleSettings.driveWorkflowStages || "Registration → Aptitude → Technical → HR → Offer"} onChange={(e) => onChange("driveWorkflowStages", e.target.value)} className="h-9 text-xs font-mono" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Student Drive Notification Template</Label>
                <Input value={roleSettings.notificationTemplate || "Dear Student, Drive for {Company} scheduled on {Date}. Register before {Deadline}."} onChange={(e) => onChange("notificationTemplate", e.target.value)} className="h-9 text-xs font-mono" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Recruiter Email Invitation Template</Label>
                <Input value={roleSettings.emailTemplate || "Dear Recruiter, Welcome to Anurag University Campus Drive 2026-2027."} onChange={(e) => onChange("emailTemplate", e.target.value)} className="h-9 text-xs font-mono" />
              </div>
            </div>
          </Panel>
        </div>
      );
  }
}
