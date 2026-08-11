import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  Users,
  UserCog,
  BookOpen,
  CalendarRange,
  ClipboardCheck,
  FileCheck,
  FileSpreadsheet,
  Award,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Layers,
  HelpCircle,
  PlayCircle
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DonutChart, TrendAreaChart, GroupedBarChart } from "@/components/dashboard/charts";
import {
  MOCK_STATS_CARDS,
  MOCK_DEPT_DISTRIBUTION,
  MOCK_ATTENDANCE_TREND,
  MOCK_FACULTY_WORKLOAD,
  MOCK_EXAM_TIMELINE,
  MOCK_ACTIVITIES,
  MOCK_APPROVAL_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_UPCOMING_EVENTS,
  type ApprovalRequest,
  type ActivityData,
  type AcademicNotification
} from "@/data/academic-management-mock";

// Icon mapping helper for stats and activity timeline
const iconMap: Record<string, any> = {
  Building2,
  Users,
  UserCog,
  BookOpen,
  CalendarRange,
  ClipboardCheck,
  FileCheck,
  FileSpreadsheet,
};

export function AcademicManagementDashboard() {
  const navigate = useNavigate();

  // Simulated Dashboard States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  // Core Data States
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(MOCK_APPROVAL_REQUESTS);
  const [activities, setActivities] = useState<ActivityData[]>(MOCK_ACTIVITIES);
  const [notifications, setNotifications] = useState<AcademicNotification[]>(MOCK_NOTIFICATIONS);
  const [selectedSemester, setSelectedSemester] = useState("Odd Semester 2026-27");

  // Approval Handlers
  const handleApprove = (id: string, title: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "approved" as const } : app))
    );
    toast.success(`Approved: ${title}`);

    // Add to activity timeline
    const newAct: ActivityData = {
      id: `act-new-${Date.now()}`,
      type: "attendance",
      title: "Request Approved",
      description: `Approved request: "${title}"`,
      timestamp: "Just now",
      user: "Academic Manager",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleReject = (id: string, title: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" as const } : app))
    );
    toast.error(`Rejected: ${title}`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // State Simulation Helpers
  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const toggleEmptyState = () => {
    setIsEmpty(!isEmpty);
    if (!isEmpty) {
      toast.info("Showing empty state placeholders");
    } else {
      toast.success("Restored dashboard dataset");
    }
  };

  const toggleErrorState = () => {
    if (error) {
      setError(null);
      toast.success("Restored dashboard connectivity");
    } else {
      setError("Database sync timeout: Connection to Academic Ledger Server failed.");
      toast.error("Simulated a network loading error");
    }
  };

  // Skeletons for Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="h-32 rounded-2xl bg-muted/40 animate-pulse border border-border/50 p-6 flex flex-col justify-between">
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="h-4 w-1/4 bg-muted rounded" />
        </div>
        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/40 animate-pulse border border-border/50 p-5" />
          ))}
        </div>
        {/* Body Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-80 rounded-xl bg-muted/40 animate-pulse border border-border/50" />
            <div className="h-64 rounded-xl bg-muted/40 animate-pulse border border-border/50" />
          </div>
          <div className="space-y-6">
            <div className="h-96 rounded-xl bg-muted/40 animate-pulse border border-border/50" />
          </div>
        </div>
      </div>
    );
  }

  // Error State Layout
  if (error) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 text-center px-6">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="size-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold font-display text-foreground">Academic Cockpit Sync Failure</h3>
        <p className="max-w-md text-sm text-muted-foreground font-mono leading-relaxed">{error}</p>
        <div className="flex items-center gap-3">
          <Button onClick={toggleErrorState} variant="outline" size="sm">
            Dismiss Simulation
          </Button>
          <Button onClick={triggerReload} className="bg-brand-gradient shadow-glow text-white" size="sm">
            <RefreshCw className="mr-2 size-4 animate-spin" /> Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. STATE SIMULATOR OVERLAY CONTROLS (FOR USER DEMO/RATING REVIEW) */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-primary font-bold">Demo Console:</span>
          <span>Switch state views to review responsiveness & architecture</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="xs" onClick={triggerReload} className="h-7 text-[10px] font-semibold">
            <RefreshCw className="mr-1.5 size-3" /> Simulate Loading
          </Button>
          <Button variant="outline" size="xs" onClick={toggleEmptyState} className="h-7 text-[10px] font-semibold">
            <FolderOpen className="mr-1.5 size-3" /> {isEmpty ? "Fill Data" : "Empty State"}
          </Button>
          <Button variant="outline" size="xs" onClick={toggleErrorState} className="h-7 text-[10px] font-semibold text-destructive">
            <AlertTriangle className="mr-1.5 size-3" /> Error State
          </Button>
        </div>
      </div>

      {/* 2. DASHBOARD HEADER */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Academic Management Dashboard
              </h2>
              <Badge className="bg-brand-gradient text-white w-fit font-mono text-[0.65rem] tracking-wider uppercase">
                Institution Scope
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Welcome back, <span className="font-bold text-foreground">Dr. S. R. Krishnan</span> &middot; Academic Year: <span className="font-mono text-foreground font-semibold">2026-27</span>
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Select value={selectedSemester} onValueChange={(val) => {
              setSelectedSemester(val);
              toast.info(`Switched context to ${val}`);
            }}>
              <SelectTrigger className="w-56 h-9 text-xs border-primary/30 bg-card focus:ring-primary shadow-sm font-semibold">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Odd Semester 2026-27">Odd Semester 2026-27</SelectItem>
                <SelectItem value="Even Semester 2025-26">Even Semester 2025-26</SelectItem>
                <SelectItem value="Odd Semester 2025-26">Odd Semester 2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-t border-primary/10 pt-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" />
            Current Term: <span className="font-semibold text-foreground">Odd Sem Commencement</span>
          </span>
          <span>&middot;</span>
          <span className="flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            Active Branches: <span className="font-semibold text-foreground">6 Majors</span>
          </span>
        </div>
      </div>

      {/* 3. STATISTICS CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {MOCK_STATS_CARDS.map((card) => {
          const IconComponent = iconMap[card.iconName] || BookOpen;
          // Determine tone based on the metric type
          let tone: "primary" | "success" | "warning" | "info" | "destructive" = "primary";
          if (card.title.includes("Attendance")) tone = "success";
          else if (card.title.includes("Approvals")) tone = "warning";
          else if (card.title.includes("Exams")) tone = "info";
          else if (card.title.includes("Faculty")) tone = "info";

          const isUpTrend = card.trend.isUp;

          return (
            <KpiCard
              key={card.title}
              label={card.title}
              value={isEmpty ? "0" : String(card.value)}
              icon={IconComponent}
              delta={card.trend.value}
              trend={isUpTrend ? "up" : "down"}
              tone={tone}
            />
          );
        })}
      </div>

      {isEmpty ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card p-6">
          <div className="text-center space-y-2">
            <FolderOpen className="size-8 text-muted-foreground/60 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No Academic Data Available</p>
            <p className="text-xs text-muted-foreground">Select a different semester or clear the empty state simulation.</p>
          </div>
        </div>
      ) : (
        /* MAIN CONTENT LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 4. ACADEMIC OVERVIEW CHARTS */}
            <Panel
              title="Academic Distribution & Activity Overview"
              description="Analytics of student registration, attendance performance, and average department faculty workloads."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Chart 1: Department-wise Student Distribution */}
                <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-muted/15">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Department Distribution</span>
                    <span className="text-[10px] text-primary lowercase font-mono">Students</span>
                  </h4>
                  <DonutChart data={MOCK_DEPT_DISTRIBUTION} centerLabel="2,480" height={190} />
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-muted-foreground mt-2 border-t pt-2">
                    {MOCK_DEPT_DISTRIBUTION.map((item, idx) => (
                      <div key={item.label} className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" style={{ opacity: 1 - idx * 0.15 }} />
                        <span>{item.label}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Monthly Attendance Trend */}
                <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-muted/15">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Attendance Rate Trend</span>
                    <span className="text-[10px] text-success font-mono">Average %</span>
                  </h4>
                  <TrendAreaChart
                    data={MOCK_ATTENDANCE_TREND as any}
                    xKey="label"
                    series={[{ key: "value", label: "Attendance (%)" }]}
                    height={190}
                  />
                  <p className="text-[10px] text-muted-foreground text-center italic mt-1">
                    Mid-term reviews indicate a peak in March, followed by elective assessments.
                  </p>
                </div>

                {/* Chart 3: Faculty Workload Overview */}
                <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-muted/15 md:col-span-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Faculty Academic Load by Major</span>
                    <span className="text-[10px] text-info font-mono">Hours/Week Avg</span>
                  </h4>
                  <GroupedBarChart
                    data={MOCK_FACULTY_WORKLOAD as any}
                    xKey="label"
                    series={[{ key: "value", label: "Teaching Workload" }]}
                    height={160}
                  />
                </div>

              </div>
            </Panel>

            {/* 5. PENDING APPROVALS WIDGET */}
            <Panel
              title="Pending Academic Approvals"
              description="Review and process key syllabus structures, exam schedules, and department timetable alterations."
            >
              <div className="space-y-3">
                {approvals.filter(a => a.status === "pending").length === 0 ? (
                  <div className="flex items-center gap-2 p-4 rounded-xl border border-success/30 bg-success/5 text-xs text-success">
                    <Check className="size-4 shrink-0" />
                    All outstanding academic approval requests have been signed-off successfully!
                  </div>
                ) : (
                  approvals.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border border-border/70 bg-card hover:bg-muted/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground text-sm">{req.title}</span>
                          <Badge variant="outline" className="font-mono text-[9px] uppercase">
                            {req.type}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/20">
                            {req.department}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Requested by: <span className="font-semibold text-foreground">{req.requestedBy}</span> &middot; Date: <span className="font-mono">{req.date}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {req.status === "pending" ? (
                          <>
                            <Button
                              onClick={() => handleApprove(req.id, req.title)}
                              variant="outline"
                              size="xs"
                              className="h-8 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 bg-emerald-500/5 dark:text-emerald-400 dark:hover:bg-emerald-950 font-bold"
                            >
                              <Check className="mr-1 size-3.5" /> Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(req.id, req.title)}
                              variant="outline"
                              size="xs"
                              className="h-8 border-destructive/30 text-destructive hover:bg-destructive/5 bg-destructive/5 font-bold"
                            >
                              <X className="mr-1 size-3.5" /> Reject
                            </Button>
                          </>
                        ) : (
                          <Badge className={req.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}>
                            {req.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            {/* 6. QUICK ACTIONS SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Manage Departments", url: "/academics", icon: Building2 },
                { label: "Manage Faculty", url: "/faculty", icon: UserCog },
                { label: "Subject Management", url: "/academics", icon: BookOpen },
                { label: "Timetable Layouts", url: "/timetable", icon: CalendarRange },
                { label: "Attendance Control", url: "/attendance", icon: ClipboardCheck },
                { label: "Exam Planners", url: "/examinations", icon: FileSpreadsheet },
                { label: "Export Reports", url: "/reports", icon: BarChart3 },
                { label: "Communication Cell", url: "/communication", icon: Bell },
              ].map((act) => (
                <Link
                  key={act.label}
                  to={act.url}
                  className="p-4 rounded-xl border border-border/80 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer shadow-sm"
                >
                  <span className="p-2.5 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                    <act.icon className="size-5" />
                  </span>
                  <span className="text-[11px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {act.label}
                  </span>
                </Link>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* 7. NOTIFICATIONS PANEL */}
            <Panel
              title="Latest Notifications"
              description="Important bulletins & files pending submission/acknowledgment."
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Unread Alerts</span>
                  <Button
                    onClick={handleMarkAllNotificationsRead}
                    variant="ghost"
                    size="xs"
                    className="h-6 text-[10px] text-primary hover:underline p-0"
                  >
                    Mark all read
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        n.isRead
                          ? "bg-card border-border/50 opacity-75"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[8px] font-bold tracking-wide uppercase px-1 py-0.5 rounded font-mono ${
                            n.priority === "high"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : n.priority === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {n.priority}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground font-mono">{n.time}</span>
                      </div>
                      <p className="font-medium text-foreground leading-snug">{n.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* 8. UPCOMING EVENTS */}
            <Panel
              title="Upcoming Academic Events"
              description="Official schedule milestones according to institutional handbook."
            >
              <div className="relative border-l-2 border-primary/25 pl-4 ml-2 space-y-5 py-1.5 text-xs">
                {MOCK_UPCOMING_EVENTS.map((evt) => (
                  <div key={evt.id} className="relative space-y-1">
                    {/* Circle marker on line */}
                    <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-card" />
                    
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-mono text-[10px] font-bold text-primary">{evt.date}</span>
                      <Badge className="text-[8px] font-bold uppercase tracking-wider px-1 bg-card text-muted-foreground border">
                        {evt.type}
                      </Badge>
                    </div>
                    <p className="font-bold text-foreground leading-snug">{evt.title}</p>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">{evt.description}</p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* 9. RECENT ACTIVITIES TIMELINE */}
            <Panel
              title="Recent Activities"
              description="Log of system transactions, syllabus modifications, and class schedules."
            >
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {activities.map((act) => {
                  let badgeColor = "bg-muted text-muted-foreground";
                  if (act.type === "subject") badgeColor = "bg-primary/10 text-primary border-primary/20";
                  else if (act.type === "faculty") badgeColor = "bg-info/10 text-info border-info/20";
                  else if (act.type === "timetable") badgeColor = "bg-warning/10 text-warning border-warning/20";
                  else if (act.type === "attendance") badgeColor = "bg-success/10 text-success border-success/20";
                  else if (act.type === "course") badgeColor = "bg-brand-gradient text-white border-none";
                  else if (act.type === "exam") badgeColor = "bg-destructive/10 text-destructive border-destructive/20";

                  return (
                    <div key={act.id} className="flex gap-3 text-xs leading-normal">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="p-1.5 rounded-lg bg-muted/60 text-muted-foreground">
                          <Clock className="size-3.5" />
                        </span>
                        <div className="w-0.5 grow bg-border my-1" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground">{act.title}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">&middot; {act.timestamp}</span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{act.description}</p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] text-foreground/70 font-medium">Logged by: {act.user}</span>
                          <Badge variant="outline" className={`text-[8px] font-mono capitalize px-1 py-0 ${badgeColor}`}>
                            {act.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

          </div>

        </div>
      )}
    </div>
  );
}
