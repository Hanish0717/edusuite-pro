import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Bell,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Search,
  RefreshCw,
  Download,
  Plus,
  Eye,
  Edit,
  Copy,
  Archive,
  ChevronRight,
  Filter,
  X,
  BarChart3,
  Sparkles,
  Printer,
  ShieldCheck,
  MessageSquare,
  Mail,
  Smartphone,
  Share2,
  CheckCircle,
  AlertCircle,
  Settings,
  Layers,
  Zap,
  Trash2,
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  MOCK_NOTIFICATIONS,
  MOCK_TEMPLATES,
  MOCK_SCHEDULED_ITEMS,
  MOCK_ACTIVITY_LOGS,
  CATEGORY_DISTRIBUTION_CHART,
  DEPARTMENT_NOTIFICATIONS_CHART,
  type AcademicNotification,
  type CommunicationTemplate,
  type ScheduledItem,
  type NotificationCategory,
  type TargetAudience,
  type NotificationPriority,
  type NotificationStatus,
  type DeliveryMethod,
} from "@/data/communication-center-mock";

function priorityBadgeClass(priority: NotificationPriority) {
  switch (priority) {
    case "Emergency":
    case "Urgent":
      return "text-destructive border-destructive/20 bg-destructive/5";
    case "High":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Normal":
      return "text-primary border-primary/20 bg-primary/5";
    case "Low":
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
}

function statusBadgeClass(status: NotificationStatus) {
  switch (status) {
    case "Delivered":
      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Sending":
      return "text-primary border-primary/20 bg-primary/5";
    case "Scheduled":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Failed":
      return "text-destructive border-destructive/20 bg-destructive/5";
    case "Draft":
    case "Archived":
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
}

export function CommunicationCenterModuleView() {
  // ── States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<AcademicNotification[]>(MOCK_NOTIFICATIONS);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>(MOCK_TEMPLATES);
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>(MOCK_SCHEDULED_ITEMS);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "broadcasts" | "templates" | "scheduled" | "analytics" | "activity"
  >("broadcasts");

  // Details Dialog State
  const [selectedNotification, setSelectedNotification] = useState<AcademicNotification | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Create Notification Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    category: "Academic Announcement" as NotificationCategory,
    priority: "Normal" as NotificationPriority,
    targetAudience: "Entire Institution" as TargetAudience,
    department: "All Depts",
    message: "",
    deliveryMethod: "In-App Notification" as DeliveryMethod,
    scheduledAt: "",
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
    toast.success("Filters reset successfully.");
  };

  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 600);
  };

  // ── Filter Computations ─────────────────────────────────────
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => {
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = categoryFilter === "all" || n.category === categoryFilter;
        const matchesPri = priorityFilter === "all" || n.priority === priorityFilter;
        const matchesStat = statusFilter === "all" || n.status === statusFilter;
        return matchesSearch && matchesCat && matchesPri && matchesStat;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        if (sortBy === "oldest") return a.id.localeCompare(b.id);
        return 0;
      });
  }, [notifications, searchQuery, categoryFilter, priorityFilter, statusFilter, sortBy]);

  // ── Metrics Computation ─────────────────────────────────────
  const metrics = useMemo(() => {
    const totalNotifications = notifications.length;
    const sentToday = notifications.filter((n) => n.status === "Delivered").length;
    const scheduledCount = scheduledItems.length;
    const unreadCount = 340;
    const deliverySuccess = 99.4;
    const failedCount = notifications.reduce((acc, n) => acc + n.failedCount, 0);
    const draftCount = notifications.filter((n) => n.status === "Draft").length;
    const activeTemplates = templates.length;

    return { totalNotifications, sentToday, scheduledCount, unreadCount, deliverySuccess, failedCount, draftCount, activeTemplates };
  }, [notifications, scheduledItems, templates]);

  // ── Handlers ────────────────────────────────────────────────
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title.trim() || !newForm.message.trim()) {
      toast.error("Please enter both title and message body.");
      return;
    }

    const newNotif: AcademicNotification = {
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      title: newForm.title,
      category: newForm.category,
      priority: newForm.priority,
      targetAudience: newForm.targetAudience,
      department: newForm.department,
      program: "All Programs",
      semester: "All Semesters",
      message: newForm.message,
      deliveryMethod: newForm.deliveryMethod,
      createdBy: "Dr. S. R. Krishnan (Academic Manager)",
      createdAt: "Just now",
      scheduledAt: newForm.scheduledAt || null,
      status: newForm.scheduledAt ? "Scheduled" : "Delivered",
      deliveryStatus: newForm.scheduledAt ? "Queued" : "100% Success (2,450 / 2,450)",
      readCount: 0,
      failedCount: 0,
      totalRecipients: 2450,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setIsCreateModalOpen(false);
    toast.success(newForm.scheduledAt ? "Notification scheduled successfully!" : "Notification dispatched across all target channels!");
    setNewForm({
      title: "",
      category: "Academic Announcement",
      priority: "Normal",
      targetAudience: "Entire Institution",
      department: "All Depts",
      message: "",
      deliveryMethod: "In-App Notification",
      scheduledAt: "",
    });
  };

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
        <h3 className="text-base font-bold text-foreground">Failed to load notification center</h3>
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
            <Bell className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Notifications & Communication Center
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Communication Center</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Create, schedule, manage, and monitor academic announcements and communications across the institution.
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm" onClick={triggerReload} className="h-9 gap-1.5 font-semibold text-xs">
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("templates")}
            className="h-9 gap-1.5 font-semibold text-xs border-border"
          >
            <FileText className="size-3.5" /> Communication Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exported institutional communication logs to Excel!")}
            className="h-9 gap-1.5 font-semibold text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <Download className="size-3.5" /> Export Logs
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-3.5" /> Create Notification
          </Button>
        </div>
      </div>

      {/* ── 2. SUMMARY DASHBOARD KPI CARDS ─────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Total Notifications" value={String(metrics.totalNotifications)} icon={Bell} tone="primary" />
        <KpiCard label="Sent Today" value={String(metrics.sentToday)} icon={Send} tone="success" />
        <KpiCard label="Scheduled Items" value={String(metrics.scheduledCount)} icon={Calendar} tone="warning" />
        <KpiCard label="Unread Feed" value={String(metrics.unreadCount)} icon={Clock} tone="info" />
        <KpiCard label="Delivery Success" value={`${metrics.deliverySuccess}%`} icon={CheckCircle2} tone="success" delta="High SLA" trend="up" />
        <KpiCard label="Failed Deliveries" value={String(metrics.failedCount)} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Draft Items" value={String(metrics.draftCount)} icon={FileText} tone="warning" />
        <KpiCard label="Active Templates" value={String(metrics.activeTemplates)} icon={Layers} tone="info" />
      </div>

      {/* ── 3. MAIN TAB NAVIGATION ─────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {[
            { id: "broadcasts", label: "Broadcasts Roster", icon: Bell },
            { id: "templates", label: "Templates Library", icon: FileText },
            { id: "scheduled", label: `Scheduled Calendar (${metrics.scheduledCount})`, icon: Calendar },
            { id: "analytics", label: "Delivery Analytics", icon: BarChart3 },
            { id: "activity", label: "Activity Logs", icon: Clock },
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
          onClick={() => setIsCreateModalOpen(true)}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Plus className="size-3.5" /> Quick Broadcast
        </Button>
      </div>

      {/* ── 4. SEARCH & FILTERS TOOLBAR ───────────────────── */}
      <div className="flex items-center justify-between border rounded-2xl bg-card p-3 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search title, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-[180px]"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Academic Announcement">Academic Announcement</SelectItem>
              <SelectItem value="Low Attendance Warning">Low Attendance Warning</SelectItem>
              <SelectItem value="Examination Notification">Examination Notification</SelectItem>
              <SelectItem value="Holiday Notice">Holiday Notice</SelectItem>
              <SelectItem value="Placement Notification">Placement Notification</SelectItem>
              <SelectItem value="System Maintenance">System Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Urgent">Urgent / Emergency</SelectItem>
              <SelectItem value="High">High Priority</SelectItem>
              <SelectItem value="Normal">Normal Priority</SelectItem>
              <SelectItem value="Low">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
            <X className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
            {filteredNotifications.length} Broadcasts Listed
          </Badge>
        </div>
      </div>

      {/* ── 5. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: Master Broadcast Roster Table */}
      {activeTab === "broadcasts" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Bell className="size-5 text-primary" /> Institutional Broadcasts & Announcements Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Notification ID</th>
                  <th className="py-2.5 px-3">Announcement Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Target Audience</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3 text-center">Recipients</th>
                  <th className="py-2.5 px-3">Delivery Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((n) => (
                  <tr key={n.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{n.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground">{n.title}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{n.createdAt}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold">{n.category}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[9px] font-mono">{n.targetAudience}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px]">{n.deliveryMethod}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${priorityBadgeClass(n.priority)}`}>
                        {n.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{n.totalRecipients}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(n.status)}`}>
                        {n.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedNotification(n); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer font-semibold">
                        <Eye className="size-3.5 mr-1" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Templates Library */}
      {activeTab === "templates" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <FileText className="size-5 text-primary" /> Pre-Approved Communication Templates Library
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="p-4 border rounded-xl space-y-3 bg-muted/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{tmpl.name}</h4>
                    <span className="text-[9px] font-mono text-muted-foreground">{tmpl.category} &middot; Last used {tmpl.lastUsed}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono text-primary">Template</Badge>
                </div>
                <div className="p-2.5 border rounded-lg bg-card text-[10px] space-y-1">
                  <span className="font-bold text-foreground block">{tmpl.title}</span>
                  <p className="text-muted-foreground">{tmpl.message}</p>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Template ${tmpl.name} copied to editor!`)} className="h-7 text-[10px]">
                    <Copy className="size-3 mr-1" /> Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Scheduled Calendar */}
      {activeTab === "scheduled" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Calendar className="size-5 text-primary" /> Scheduled Broadcasts & Calendar Agenda
          </h3>

          <div className="space-y-3">
            {scheduledItems.map((sch) => (
              <div key={sch.id} className="p-4 border rounded-xl flex items-center justify-between bg-amber-50/30 border-amber-200 dark:bg-amber-500/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] font-mono text-amber-600 border-amber-300">{sch.scheduledTime}</Badge>
                    <span className="font-bold text-xs text-foreground">{sch.title}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{sch.category} &middot; Target: {sch.targetAudience} &middot; Channel: {sch.channel}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Rescheduled broadcast ${sch.id}`)} className="h-7 text-[10px]">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.error(`Cancelled scheduled broadcast ${sch.id}`)} className="h-7 text-[10px]">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Delivery Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Department Broadcast Volume</h4>
            <GroupedBarChart
              data={DEPARTMENT_NOTIFICATIONS_CHART as any}
              xKey="name"
              series={[{ key: "Notifications", label: "Broadcasts Sent" }]}
              height={200}
            />
          </div>

          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Distribution</h4>
            <DonutChart data={CATEGORY_DISTRIBUTION_CHART} height={180} centerLabel="Categories" />
            <ChartLegend items={CATEGORY_DISTRIBUTION_CHART} />
          </div>
        </div>
      )}

      {/* TAB 5: Activity Logs */}
      {activeTab === "activity" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Clock className="size-5 text-primary" /> Institutional Communication Activity Feed
          </h3>

          <div className="space-y-3">
            {MOCK_ACTIVITY_LOGS.map((log) => (
              <div key={log.id} className="p-3.5 border rounded-xl flex items-start gap-3 bg-muted/10">
                <div className="mt-0.5 size-4 shrink-0 rounded-full flex items-center justify-center text-primary">
                  <CheckCircle className="size-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{log.action}</p>
                  <span className="text-[10px] text-muted-foreground font-mono">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. CREATE NOTIFICATION MODAL ──────────────────── */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl text-xs leading-normal max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display flex items-center gap-2">
              <Send className="size-5 text-primary" /> Create Institutional Notification
            </DialogTitle>
            <DialogDescription>Compose and broadcast messages across institution channels.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendNotification} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="nt-title">Announcement Title*</Label>
              <Input id="nt-title" placeholder="e.g. Autumn Semester Exam Timetable" value={newForm.title} onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nt-cat">Notification Category</Label>
                <Select value={newForm.category} onValueChange={(v) => setNewForm((p) => ({ ...p, category: v as NotificationCategory }))}>
                  <SelectTrigger id="nt-cat"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic Announcement">Academic Announcement</SelectItem>
                    <SelectItem value="Low Attendance Warning">Low Attendance Warning</SelectItem>
                    <SelectItem value="Examination Notification">Examination Notification</SelectItem>
                    <SelectItem value="Holiday Notice">Holiday Notice</SelectItem>
                    <SelectItem value="Placement Notification">Placement Notification</SelectItem>
                    <SelectItem value="System Maintenance">System Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="nt-pri">Priority Level</Label>
                <Select value={newForm.priority} onValueChange={(v) => setNewForm((p) => ({ ...p, priority: v as NotificationPriority }))}>
                  <SelectTrigger id="nt-pri"><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nt-aud">Target Audience</Label>
                <Select value={newForm.targetAudience} onValueChange={(v) => setNewForm((p) => ({ ...p, targetAudience: v as TargetAudience }))}>
                  <SelectTrigger id="nt-aud"><SelectValue placeholder="Audience" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entire Institution">Entire Institution</SelectItem>
                    <SelectItem value="Students">Students Only</SelectItem>
                    <SelectItem value="Faculty">Faculty Only</SelectItem>
                    <SelectItem value="HODs">HODs & Deans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="nt-ch">Delivery Channel</Label>
                <Select value={newForm.deliveryMethod} onValueChange={(v) => setNewForm((p) => ({ ...p, deliveryMethod: v as DeliveryMethod }))}>
                  <SelectTrigger id="nt-ch"><SelectValue placeholder="Channel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-App Notification">In-App Notification</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Push Notification">Push Notification</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Multiple Channels">Multiple Channels (All)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="nt-msg">Message Body Content*</Label>
              <Textarea id="nt-msg" rows={4} placeholder="Type official notice details..." value={newForm.message} onChange={(e) => setNewForm((p) => ({ ...p, message: e.target.value }))} required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="nt-sch">Schedule Date & Time (Optional)</Label>
              <Input id="nt-sch" type="datetime-local" value={newForm.scheduledAt} onChange={(e) => setNewForm((p) => ({ ...p, scheduledAt: e.target.value }))} />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold shadow-glow">
                {newForm.scheduledAt ? "Schedule Broadcast" : "Send Broadcast Now"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 7. DETAILS DIALOG ─────────────────────────────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{selectedNotification.id}</Badge>
                  <Badge variant="outline" className={`text-[9px] uppercase ${priorityBadgeClass(selectedNotification.priority)}`}>
                    {selectedNotification.priority}
                  </Badge>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">{selectedNotification.title}</DialogTitle>
                <DialogDescription>{selectedNotification.category} &middot; {selectedNotification.createdAt}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 pt-2">
                <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Message Content</span>
                  <p className="text-foreground leading-relaxed">{selectedNotification.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 border rounded-xl p-3 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Target Audience</span>
                    <p className="font-bold text-foreground mt-0.5">{selectedNotification.targetAudience}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Recipients</span>
                    <p className="font-bold font-mono text-primary mt-0.5">{selectedNotification.totalRecipients} Users</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Delivery Channel</span>
                    <p className="font-bold font-mono mt-0.5">{selectedNotification.deliveryMethod}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Delivery Status</span>
                    <p className="font-bold text-emerald-600 font-mono mt-0.5">{selectedNotification.deliveryStatus}</p>
                  </div>
                </div>
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
