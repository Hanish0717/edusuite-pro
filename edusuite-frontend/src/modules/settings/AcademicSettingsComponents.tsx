import React, { useState } from "react";
import { toast } from "sonner";
import {
  Settings,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  Bell,
  Search,
  RefreshCw,
  Download,
  Save,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Sparkles,
  Lock,
  Database,
  Printer,
  Globe,
  Sliders,
  Server,
  Zap,
  BookOpen,
  GraduationCap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { KpiCard } from "@/components/dashboard/kpi-card";

import {
  DEFAULT_ACADEMIC_YEAR,
  MOCK_SEMESTER_CONFIGS,
  MOCK_REGULATIONS,
  DEFAULT_CREDIT_CONFIG,
  MOCK_GRADING_TABLE,
  DEFAULT_ATTENDANCE_POLICY,
  DEFAULT_PROMOTION_RULES,
  DEFAULT_EXAM_RULES,
  MOCK_SETTINGS_HISTORY,
  type GradeRow,
  type SemesterConfig,
} from "@/data/academic-settings-mock";

export function AcademicSettingsModuleView() {
  // ── States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Menu Section State
  const [activeSection, setActiveSection] = useState<
    | "academic-year"
    | "semesters"
    | "regulations"
    | "credits"
    | "grading"
    | "attendance"
    | "promotion"
    | "exams"
    | "results"
    | "workflow"
    | "notifications"
    | "reports"
    | "general"
    | "security"
    | "backup"
    | "history"
    | "status"
  >("academic-year");

  // Editable Form States
  const [academicYear, setAcademicYear] = useState(DEFAULT_ACADEMIC_YEAR);
  const [semesters] = useState<SemesterConfig[]>(MOCK_SEMESTER_CONFIGS);
  const [creditConfig, setCreditConfig] = useState(DEFAULT_CREDIT_CONFIG);
  const [gradingTable, setGradingTable] = useState<GradeRow[]>(MOCK_GRADING_TABLE);
  const [attendancePolicy, setAttendancePolicy] = useState(DEFAULT_ATTENDANCE_POLICY);
  const [promotionRules, setPromotionRules] = useState(DEFAULT_PROMOTION_RULES);
  const [examRules, setExamRules] = useState(DEFAULT_EXAM_RULES);

  const [notificationToggles, setNotificationToggles] = useState({
    email: true,
    sms: true,
    push: true,
    attendanceAlerts: true,
    examAlerts: true,
    resultAlerts: true,
  });

  const [generalPref, setGeneralPref] = useState({
    language: "English (US)",
    timezone: "UTC+05:30 (IST)",
    dateFormat: "DD/MM/YYYY",
    academicTheme: "EduSuite Dark Glassmorphism",
  });

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  const handleSaveChanges = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Institutional academic configuration saved successfully!");
    }, 600);
  };

  const handleResetSettings = () => {
    setAcademicYear(DEFAULT_ACADEMIC_YEAR);
    setCreditConfig(DEFAULT_CREDIT_CONFIG);
    setGradingTable(MOCK_GRADING_TABLE);
    setAttendancePolicy(DEFAULT_ATTENDANCE_POLICY);
    setPromotionRules(DEFAULT_PROMOTION_RULES);
    setExamRules(DEFAULT_EXAM_RULES);
    toast.info("Settings reset to institutional defaults.");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <div className="h-96 bg-muted/40 animate-pulse rounded-xl" />
          <div className="h-96 col-span-3 bg-muted/40 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 border rounded-2xl bg-card text-center space-y-4 shadow-sm">
        <AlertTriangle className="size-10 text-destructive mx-auto" />
        <h3 className="text-base font-bold text-foreground">Failed to load academic settings</h3>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={() => setError(null)} className="bg-brand-gradient text-white font-semibold">
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
            <Settings className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Academic Settings & System Configuration
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Master System Module
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">System Configuration</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Configure institution-wide academic settings, policies, grading systems, regulations, semesters, attendance rules, and examination policies.
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm" onClick={handleResetSettings} className="h-9 gap-1.5 font-semibold text-xs border-border">
            <RotateCcw className="size-3.5" /> Reset Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exported full academic configuration to JSON format.")}
            className="h-9 gap-1.5 font-semibold text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <Download className="size-3.5" /> Export Configuration
          </Button>
          <Button
            onClick={handleSaveChanges}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Save className="size-3.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* ── 2. MAIN LAYOUT: SIDEBAR + CONTENT ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT SETTINGS NAVIGATION SIDEBAR */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search configuration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="border rounded-2xl bg-card p-2 shadow-sm space-y-1 font-semibold text-xs">
            {[
              { id: "academic-year", label: "Academic Year", icon: Calendar },
              { id: "semesters", label: "Semester Configuration", icon: Layers },
              { id: "regulations", label: "Programs & Regulations", icon: BookOpen },
              { id: "credits", label: "Credit System", icon: GraduationCap },
              { id: "grading", label: "Grading System", icon: Award },
              { id: "attendance", label: "Attendance Policies", icon: CheckCircle2 },
              { id: "promotion", label: "Promotion Rules", icon: GraduationCap },
              { id: "exams", label: "Examination Rules", icon: FileText },
              { id: "results", label: "Result Settings", icon: Award },
              { id: "workflow", label: "Approval Workflow", icon: SlidersHorizontal },
              { id: "notifications", label: "Notification Settings", icon: Bell },
              { id: "reports", label: "Report Configuration", icon: Printer },
              { id: "general", label: "General Preferences", icon: Globe },
              { id: "security", label: "Security Settings", icon: Lock },
              { id: "backup", label: "Data Backup", icon: Database },
              { id: "history", label: "Settings History", icon: Clock },
              { id: "status", label: "System Status", icon: Server },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveSection(menu.id as any)}
                className={`w-full px-3 py-2 rounded-xl transition-colors flex items-center gap-2 text-left ${
                  activeSection === menu.id
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                <menu.icon className="size-3.5 shrink-0" />
                <span className="truncate">{menu.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT CONFIGURATION CONTENT PANEL */}
        <div className="lg:col-span-3 space-y-6">

          {/* SECTION 1: ACADEMIC YEAR */}
          {activeSection === "academic-year" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <Calendar className="size-5 text-primary" /> Academic Year Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="curr-ay">Current Active Academic Year</Label>
                  <Input id="curr-ay" value={academicYear.currentYear} onChange={(e) => setAcademicYear((p) => ({ ...p, currentYear: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="upc-ay">Upcoming Academic Year</Label>
                  <Input id="upc-ay" value={academicYear.upcomingYear} onChange={(e) => setAcademicYear((p) => ({ ...p, upcomingYear: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ay-start">Academic Start Date</Label>
                  <Input id="ay-start" type="date" value={academicYear.startDate} onChange={(e) => setAcademicYear((p) => ({ ...p, startDate: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ay-end">Academic End Date</Label>
                  <Input id="ay-end" type="date" value={academicYear.endDate} onChange={(e) => setAcademicYear((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button size="sm" onClick={handleSaveChanges} className="bg-brand-gradient text-white font-semibold">
                  Update Academic Year
                </Button>
              </div>
            </div>
          )}

          {/* SECTION 2: SEMESTER CONFIGURATION */}
          {activeSection === "semesters" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <Layers className="size-5 text-primary" /> Institutional Semester Configuration
              </h3>

              <div className="space-y-3">
                {semesters.map((sem) => (
                  <div key={sem.id} className="p-4 border rounded-xl flex items-center justify-between bg-muted/10">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{sem.semesterName}</h4>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {sem.startDate} to {sem.endDate} &middot; Registration Deadline: {sem.registrationDeadline}
                      </span>
                    </div>
                    <Badge variant="outline" className={`text-[9px] uppercase ${sem.status === "Active" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-amber-500 border-amber-200 bg-amber-50"}`}>
                      {sem.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: CREDIT SYSTEM */}
          {activeSection === "credits" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" /> Credit System & Graduation Requirements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="cr-min">Min Credits / Semester</Label>
                  <Input id="cr-min" type="number" value={creditConfig.minCreditsPerSem} onChange={(e) => setCreditConfig((p) => ({ ...p, minCreditsPerSem: Number(e.target.value) }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cr-max">Max Credits / Semester</Label>
                  <Input id="cr-max" type="number" value={creditConfig.maxCreditsPerSem} onChange={(e) => setCreditConfig((p) => ({ ...p, maxCreditsPerSem: Number(e.target.value) }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cr-tot">Total Graduation Credits</Label>
                  <Input id="cr-tot" type="number" value={creditConfig.totalGraduationCredits} onChange={(e) => setCreditConfig((p) => ({ ...p, totalGraduationCredits: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: GRADING SYSTEM */}
          {activeSection === "grading" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <Award className="size-5 text-primary" /> Institutional 10-Point Grading System Matrix
              </h3>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-[11px] font-medium text-foreground">
                  <thead className="bg-muted/30">
                    <tr className="text-muted-foreground font-semibold border-b">
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3 text-center">Grade Point</th>
                      <th className="py-2.5 px-3">Marks Percentage Range</th>
                      <th className="py-2.5 px-3">Result Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradingTable.map((g) => (
                      <tr key={g.grade} className="border-b border-border/40 hover:bg-muted/5">
                        <td className="py-3 px-3 font-mono font-bold text-primary">{g.grade}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{g.gradePoint}</td>
                        <td className="py-3 px-3 font-mono">{g.marksRange}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className={`text-[9px] uppercase ${g.resultStatus === "Fail" ? "text-destructive border-destructive/20 bg-destructive/5" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
                            {g.resultStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: ATTENDANCE POLICY */}
          {activeSection === "attendance" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" /> Institutional Attendance Policy Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="att-min">Minimum Attendance % Required</Label>
                  <Input id="att-min" type="number" value={attendancePolicy.minAttendancePct} onChange={(e) => setAttendancePolicy((p) => ({ ...p, minAttendancePct: Number(e.target.value) }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="att-warn">Defaulter Warning Threshold %</Label>
                  <Input id="att-warn" type="number" value={attendancePolicy.warningPct} onChange={(e) => setAttendancePolicy((p) => ({ ...p, warningPct: Number(e.target.value) }))} />
                </div>

                <div className="space-y-1 col-span-2">
                  <Label htmlFor="att-det">Detention Policy Rule</Label>
                  <Textarea id="att-det" rows={2} value={attendancePolicy.detentionRule} onChange={(e) => setAttendancePolicy((p) => ({ ...p, detentionRule: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PROMOTION RULES */}
          {activeSection === "promotion" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" /> Student Semester Promotion Criteria
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="pr-cgpa">Min CGPA Required</Label>
                  <Input id="pr-cgpa" type="number" step="0.1" value={promotionRules.minCgpaRequired} onChange={(e) => setPromotionRules((p) => ({ ...p, minCgpaRequired: Number(e.target.value) }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pr-back">Max Backlogs Allowed</Label>
                  <Input id="pr-back" type="number" value={promotionRules.maxBacklogsAllowed} onChange={(e) => setPromotionRules((p) => ({ ...p, maxBacklogsAllowed: Number(e.target.value) }))} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pr-cr">Min Earned Credits</Label>
                  <Input id="pr-cr" type="number" value={promotionRules.minCreditsToPromote} onChange={(e) => setPromotionRules((p) => ({ ...p, minCreditsToPromote: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: NOTIFICATION SETTINGS */}
          {activeSection === "notifications" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <Bell className="size-5 text-primary" /> Channel Broadcast & Alert Preferences
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  { key: "email", label: "Email Notifications Channel" },
                  { key: "sms", label: "SMS Gateway Integration" },
                  { key: "push", label: "Mobile Push Notifications" },
                  { key: "attendanceAlerts", label: "Automated Defaulter Attendance Alerts" },
                  { key: "examAlerts", label: "Examination Timetable Announcements" },
                  { key: "resultAlerts", label: "Result Publication Broadcasts" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-xl bg-muted/10">
                    <span className="font-semibold text-xs text-foreground">{item.label}</span>
                    <Switch
                      checked={(notificationToggles as any)[item.key]}
                      onCheckedChange={(val) => setNotificationToggles((p) => ({ ...p, [item.key]: val }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: SETTINGS HISTORY */}
          {activeSection === "history" && (
            <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
                <Clock className="size-5 text-primary" /> Institutional Configuration Change History
              </h3>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-[11px] font-medium text-foreground">
                  <thead className="bg-muted/30">
                    <tr className="text-muted-foreground font-semibold border-b">
                      <th className="py-2.5 px-3">Setting Name</th>
                      <th className="py-2.5 px-3 font-mono">Old Value</th>
                      <th className="py-2.5 px-3 font-mono">New Value</th>
                      <th className="py-2.5 px-3">Updated By</th>
                      <th className="py-2.5 px-3">Updated Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SETTINGS_HISTORY.map((h) => (
                      <tr key={h.id} className="border-b border-border/40 hover:bg-muted/5">
                        <td className="py-3 px-3 font-bold text-foreground">{h.settingName}</td>
                        <td className="py-3 px-3 font-mono text-destructive">{h.oldValue}</td>
                        <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{h.newValue}</td>
                        <td className="py-3 px-3 font-semibold">{h.updatedBy}</td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">{h.updatedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER SECTIONS */}
          {!["academic-year", "semesters", "credits", "grading", "attendance", "promotion", "notifications", "history"].includes(activeSection) && (
            <div className="border rounded-2xl bg-card p-8 text-center space-y-3 shadow-sm">
              <SlidersHorizontal className="size-10 text-primary mx-auto" />
              <h3 className="text-base font-bold text-foreground uppercase tracking-wide">{activeSection.replace("-", " ")} Configuration</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Institutional configuration settings for {activeSection} are active and operating under standard Academic Management policies.
              </p>
              <Button onClick={handleSaveChanges} className="bg-brand-gradient text-white font-semibold">
                Save Preferences
              </Button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
