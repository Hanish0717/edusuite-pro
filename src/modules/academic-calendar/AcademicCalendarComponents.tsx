import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  RefreshCw,
  Download,
  Upload,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  BadgeCheck,
  ChevronRight,
  Filter,
  X,
  CalendarDays,
  List,
  Layers,
  MapPin,
  Tag,
  Grid,
  BarChart3,
  Bell,
  Sparkles,
  Printer,
  ChevronLeft,
  FileSpreadsheet,
  Flag,
  ArrowRight,
  BookmarkCheck,
  ShieldCheck,
  HelpCircle,
  AlertCircle
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
  MOCK_ACADEMIC_EVENTS,
  MOCK_HOLIDAYS,
  MOCK_EXAM_CALENDAR,
  MOCK_DEADLINES,
  MOCK_ACADEMIC_MILESTONES,
  MOCK_CALENDAR_NOTIFICATIONS,
  EVENTS_BY_CATEGORY,
  MONTHLY_EVENT_DISTRIBUTION,
  DEPT_PARTICIPATION_CHART,
  type AcademicEvent,
  type Holiday,
  type ExamEvent,
  type EventCategory,
} from "@/data/academic-calendar-mock";

const EVENT_CATEGORIES_LIST: EventCategory[] = [
  "Semester Start",
  "Semester End",
  "Holiday",
  "Mid Examination",
  "End Semester Examination",
  "Laboratory Examination",
  "Project Review",
  "Industrial Visit",
  "Workshop",
  "Seminar",
  "Guest Lecture",
  "Hackathon",
  "Placement Drive",
  "Sports Event",
  "Cultural Event",
  "Faculty Meeting",
  "Academic Council Meeting",
  "Accreditation Visit",
  "Convocation",
];

export function AcademicCalendarModuleView() {
  // ── States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [eventsList, setEventsList] = useState<AcademicEvent[]>(MOCK_ACADEMIC_EVENTS);
  const [holidaysList] = useState<Holiday[]>(MOCK_HOLIDAYS);
  const [examsList] = useState<ExamEvent[]>(MOCK_EXAM_CALENDAR);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "calendar" | "events" | "timeline" | "holidays" | "exams" | "deadlines" | "analytics" | "reports"
  >("calendar");

  // Calendar Sub-View Mode
  const [calendarViewMode, setCalendarViewMode] = useState<"monthly" | "weekly" | "daily" | "agenda" | "timeline">("monthly");

  // Selection & Details state
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [eventForm, setEventForm] = useState<Partial<AcademicEvent>>({});

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("upcoming");

  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("upcoming");
    toast.success("Filters reset successfully.");
  };

  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 600);
  };

  // ── Filter Computation ──────────────────────────────────────
  const filteredEvents = useMemo(() => {
    return eventsList
      .filter((evt) => {
        const matchesSearch =
          evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.venue.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = deptFilter === "all" || evt.department.includes(deptFilter) || evt.department === "All Departments";
        const matchesCat = categoryFilter === "all" || evt.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || evt.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || evt.priority === priorityFilter;

        return matchesSearch && matchesDept && matchesCat && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === "upcoming") return a.startDate.localeCompare(b.startDate);
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return 0;
      });
  }, [eventsList, searchQuery, deptFilter, categoryFilter, statusFilter, priorityFilter, sortBy]);

  // ── Metrics Computation ─────────────────────────────────────
  const metrics = useMemo(() => {
    const totalEvents = eventsList.length;
    const upcomingEvents = eventsList.filter((e) => e.status === "Upcoming" || e.status === "Scheduled").length;
    const upcomingHolidays = holidaysList.length;
    const upcomingExams = examsList.length;
    const completedEvents = eventsList.filter((e) => e.status === "Completed").length;
    const pendingApprovals = eventsList.filter((e) => e.approvalStatus === "Pending Approval" || e.approvalStatus === "Draft").length;

    return { totalEvents, upcomingEvents, upcomingHolidays, upcomingExams, completedEvents, pendingApprovals };
  }, [eventsList, holidaysList, examsList]);

  // ── Handlers ────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setFormMode("add");
    setEventForm({
      title: "",
      category: "Workshop",
      department: "CSE",
      organizer: "Dr. K. Sai Teja",
      venue: "Lab 5",
      description: "",
      startDate: "2026-08-20",
      endDate: "2026-08-20",
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      priority: "Medium",
      status: "Scheduled",
      academicYear: "2026-27",
      semester: "Semester VI",
      participantsCount: 50,
      approvalStatus: "Approved",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt: AcademicEvent) => {
    setFormMode("edit");
    setEventForm(evt);
    setIsFormOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title?.trim()) return toast.error("Please enter event title.");

    if (formMode === "add") {
      const newEvt: AcademicEvent = {
        ...(eventForm as AcademicEvent),
        id: `EVT-${Date.now().toString().slice(-3)}`,
      };
      setEventsList((prev) => [newEvt, ...prev]);
      toast.success(`Created event: ${newEvt.title}`);
    } else {
      setEventsList((prev) =>
        prev.map((item) => (item.id === eventForm.id ? ({ ...item, ...eventForm } as AcademicEvent) : item))
      );
      toast.success(`Updated event: ${eventForm.title}`);
    }
    setIsFormOpen(false);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    setEventsList((prev) => prev.filter((item) => item.id !== id));
    toast.warning(`Deleted event: ${title}`);
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
        <h3 className="text-base font-bold text-foreground">Failed to load academic calendar</h3>
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
            <CalendarIcon className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Academic Calendar & Event Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Calendar & Events</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Plan and manage the institution's academic schedule, semesters, examinations, holidays, and academic events.
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
            onClick={() => toast.info("Importing institutional ICS calendar file...")}
            className="h-9 gap-1.5 font-semibold text-xs border-border"
          >
            <Upload className="size-3.5" /> Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Academic Calendar exported to ICS format.")}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Download className="size-3.5" /> Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Academic Calendar published to student & faculty portals!")}
            className="h-9 gap-1.5 font-semibold text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <Send className="size-3.5" /> Publish Calendar
          </Button>
          <Button
            onClick={handleOpenAdd}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-3.5" /> Create Event
          </Button>
        </div>
      </div>

      {/* ── 2. SUMMARY DASHBOARD KPI CARDS ─────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Academic Year" value="2026-27" icon={CalendarIcon} tone="primary" />
        <KpiCard label="Current Semester" value="Sem VI" icon={BookmarkCheck} tone="info" />
        <KpiCard label="Total Events" value={String(metrics.totalEvents)} icon={Layers} tone="primary" />
        <KpiCard label="Upcoming Events" value={String(metrics.upcomingEvents)} icon={Clock} tone="info" />
        <KpiCard label="Upcoming Holidays" value={String(metrics.upcomingHolidays)} icon={CalendarDays} tone="success" />
        <KpiCard label="Upcoming Exams" value={String(metrics.upcomingExams)} icon={FileText} tone="warning" />
        <KpiCard label="Completed Events" value={String(metrics.completedEvents)} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Approvals" value={String(metrics.pendingApprovals)} icon={AlertTriangle} tone="warning" />
      </div>

      {/* ── 3. MAIN TAB NAVIGATION ─────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {[
            { id: "calendar", label: "Interactive Calendar", icon: CalendarIcon },
            { id: "events", label: "Events Directory", icon: List },
            { id: "timeline", label: "Academic Milestones", icon: Flag },
            { id: "holidays", label: "Holidays", icon: CalendarDays },
            { id: "exams", label: "Exam Schedules", icon: FileText },
            { id: "deadlines", label: "Deadlines Widget", icon: Clock },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "reports", label: "Reports", icon: Printer },
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
          onClick={handleOpenAdd}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Plus className="size-3.5" /> Create Event
        </Button>
      </div>

      {/* ── 4. SEARCH & FILTERS TOOLBAR ───────────────────── */}
      <div className="flex items-center justify-between border rounded-2xl bg-card p-3 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search event title, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-[180px]"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 text-xs w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EVENT_CATEGORIES_LIST.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="AI&DS">AI&DS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
            <X className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
            {filteredEvents.length} Events Listed
          </Badge>
        </div>
      </div>

      {/* ── 5. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: Interactive Calendar View (Monthly / Weekly / Daily / Agenda / Timeline) */}
      {activeTab === "calendar" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <CalendarIcon className="size-5 text-primary" /> August 2026 Academic Calendar
              </h3>
            </div>

            {/* View Mode Switcher */}
            <div className="flex rounded-lg bg-muted/30 p-1 border text-[11px] font-semibold">
              {(["monthly", "weekly", "daily", "agenda", "timeline"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalendarViewMode(mode)}
                  className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                    calendarViewMode === mode ? "bg-card text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Views */}
          {calendarViewMode === "monthly" && (
            <div className="space-y-2">
              {/* Month Grid Header */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-muted-foreground uppercase py-2 bg-muted/20 rounded-xl">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              {/* Month Grid Cells Placeholder */}
              <div className="grid grid-cols-7 gap-1.5">
                {[...Array(31)].map((_, idx) => {
                  const day = idx + 1;
                  const dayEvents = eventsList.filter((e) => e.startDate === `2026-08-${day < 10 ? `0${day}` : day}`);
                  const isHoliday = holidaysList.some((h) => h.startDate === `2026-08-${day < 10 ? `0${day}` : day}`);

                  return (
                    <div
                      key={day}
                      className={`min-h-[75px] p-2 border rounded-xl flex flex-col justify-between transition-colors ${
                        isHoliday ? "bg-emerald-50/40 border-emerald-200" : dayEvents.length ? "bg-card border-primary/20" : "bg-card/50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-mono font-bold text-xs ${day === 15 ? "text-emerald-600" : "text-foreground"}`}>
                          {day}
                        </span>
                        {isHoliday && (
                          <Badge variant="outline" className="text-[8px] text-emerald-600 border-emerald-200 bg-emerald-50 px-1 py-0">
                            Holiday
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((evt) => (
                          <div
                            key={evt.id}
                            onClick={() => { setSelectedEvent(evt); setIsDetailsOpen(true); }}
                            className="p-1 rounded bg-primary/10 border border-primary/20 text-primary text-[9px] font-semibold truncate cursor-pointer hover:bg-primary/20"
                          >
                            {evt.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {calendarViewMode === "agenda" && (
            <div className="space-y-3">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="p-3 border rounded-xl flex items-center justify-between bg-muted/5 hover:bg-muted/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary font-mono text-center min-w-[50px]">
                      <span className="text-[10px] block text-muted-foreground uppercase">Aug</span>
                      <span className="font-bold text-sm">{evt.startDate.split("-")[2]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{evt.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{evt.startTime} - {evt.endTime} &middot; {evt.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] uppercase">{evt.category}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => { setSelectedEvent(evt); setIsDetailsOpen(true); }} className="h-7 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(calendarViewMode === "weekly" || calendarViewMode === "daily" || calendarViewMode === "timeline") && (
            <div className="p-8 border border-dashed rounded-xl text-center space-y-2 bg-muted/10">
              <CalendarIcon className="size-8 text-muted-foreground/40 mx-auto" />
              <p className="font-bold text-xs text-foreground">{calendarViewMode.toUpperCase()} Calendar View Active</p>
              <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">
                Displaying full schedule for August 2026. Switch to Monthly or Agenda for full event rosters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Events Directory Table */}
      {activeTab === "events" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <List className="size-5 text-primary" /> Master Institutional Academic Events Directory
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Event ID</th>
                  <th className="py-2.5 px-3">Event Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Organizer</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{evt.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">
                      {evt.title}
                      <span className="block text-[9px] text-muted-foreground font-mono font-normal">{evt.semester}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold">{evt.category}</td>
                    <td className="py-3 px-3 text-muted-foreground">{evt.organizer}</td>
                    <td className="py-3 px-3">{evt.department}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold">{evt.startDate}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{evt.startTime} - {evt.endTime}</span>
                    </td>
                    <td className="py-3 px-3 font-mono">{evt.venue}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          evt.status === "Completed" ? "text-emerald-600 border-emerald-200 bg-emerald-50" :
                          evt.status === "Upcoming" ? "text-primary border-primary/20 bg-primary/5" :
                          "text-amber-500 border-amber-200 bg-amber-50"
                        }`}
                      >
                        {evt.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedEvent(evt); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(evt)} className="h-7 text-muted-foreground hover:bg-muted cursor-pointer">
                          <Edit className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(evt.id, evt.title)} className="h-7 text-destructive hover:bg-destructive/10 cursor-pointer">
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
      )}

      {/* TAB 3: Academic Timeline Milestones */}
      {activeTab === "timeline" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Flag className="size-5 text-primary" /> Visual Academic Year 2026-27 Milestone Progression
          </h3>

          <div className="space-y-4 pt-2 max-w-2xl mx-auto">
            {MOCK_ACADEMIC_MILESTONES.map((ms, i) => (
              <div key={ms.id} className="flex items-start gap-4 relative">
                <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  ms.status === "Completed" ? "bg-emerald-500 text-white" : ms.status === "Current" ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <div className="p-3.5 border rounded-xl bg-card flex-1 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{ms.title}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">{ms.startDate} to {ms.endDate}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] uppercase ${ms.status === "Completed" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ms.status === "Current" ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground"}`}>
                    {ms.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Holiday Management */}
      {activeTab === "holidays" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <CalendarDays className="size-5 text-emerald-600" /> Official Institutional Holidays & Vacations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidaysList.map((hol) => (
              <div key={hol.id} className="p-4 border rounded-xl space-y-2 bg-emerald-50/30 border-emerald-200 dark:bg-emerald-500/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{hol.holidayName}</h4>
                    <span className="text-[9px] font-mono text-muted-foreground">{hol.id}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-200 bg-emerald-50">
                    {hol.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-2 bg-card text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Start Date</span>
                    <p className="font-bold font-mono text-foreground">{hol.startDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End Date</span>
                    <p className="font-bold font-mono text-foreground">{hol.endDate}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">Applicable: {hol.applicableTo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Exam Calendar */}
      {activeTab === "exams" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <FileText className="size-5 text-primary" /> Examination Calendar & Timetable Matrix
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Exam ID</th>
                  <th className="py-2.5 px-3">Examination Name</th>
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {examsList.map((ex) => (
                  <tr key={ex.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{ex.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{ex.examName}</td>
                    <td className="py-3 px-3">{ex.semester}</td>
                    <td className="py-3 px-3">{ex.department}</td>
                    <td className="py-3 px-3 font-mono font-bold">{ex.date}</td>
                    <td className="py-3 px-3 font-mono">{ex.time}</td>
                    <td className="py-3 px-3 font-mono text-primary">{ex.venue}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[9px] uppercase text-primary border-primary/20">
                        {ex.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Academic Deadlines Widget */}
      {activeTab === "deadlines" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Clock className="size-5 text-warning" /> Academic Submission Deadlines & SLA Countdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DEADLINES.map((dld) => (
              <div key={dld.id} className={`p-4 border rounded-xl flex items-center justify-between ${dld.status === "Urgent" ? "border-amber-200 bg-amber-50/50" : "bg-card"}`}>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{dld.title}</h4>
                  <span className="text-[10px] text-muted-foreground">Category: {dld.category} &middot; Due: {dld.dueDate}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold font-mono text-amber-600 text-sm">{dld.daysLeft} Days Left</p>
                  <Badge variant="outline" className="text-[8px] uppercase">{dld.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Events by Category</h4>
            <DonutChart data={EVENTS_BY_CATEGORY} height={180} centerLabel="Events" />
            <ChartLegend items={EVENTS_BY_CATEGORY} />
          </div>

          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Event Distribution</h4>
            <GroupedBarChart
              data={MONTHLY_EVENT_DISTRIBUTION as any}
              xKey="name"
              series={[{ key: "Events", label: "Events Count" }]}
              height={200}
            />
          </div>
        </div>
      )}

      {/* TAB 8: Reports */}
      {activeTab === "reports" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Printer className="size-5 text-primary" /> Calendar & Event Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              "Academic Calendar Report",
              "Holiday List Report",
              "Event Participation Report",
              "Department Event Report",
              "Semester Timeline Report",
              "Academic Activity Report",
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

      {/* ── 6. CREATE / EDIT EVENT MODAL ──────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              {formMode === "add" ? "Create Academic Event" : "Edit Event Settings"}
            </DialogTitle>
            <DialogDescription>Fill in event schedule, venue, and participating departments.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEvent} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="evt-title">Event Title*</Label>
              <Input id="evt-title" value={eventForm.title || ""} onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="evt-cat">Category</Label>
                <Select value={eventForm.category || "Workshop"} onValueChange={(v: any) => setEventForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger id="evt-cat"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES_LIST.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="evt-dept">Department</Label>
                <Input id="evt-dept" value={eventForm.department || "CSE"} onChange={(e) => setEventForm((p) => ({ ...p, department: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="evt-start">Start Date*</Label>
                <Input id="evt-start" type="date" value={eventForm.startDate || "2026-08-20"} onChange={(e) => setEventForm((p) => ({ ...p, startDate: e.target.value }))} required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="evt-end">End Date*</Label>
                <Input id="evt-end" type="date" value={eventForm.endDate || "2026-08-20"} onChange={(e) => setEventForm((p) => ({ ...p, endDate: e.target.value }))} required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="evt-venue">Venue</Label>
                <Input id="evt-venue" value={eventForm.venue || "Main Auditorium"} onChange={(e) => setEventForm((p) => ({ ...p, venue: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="evt-org">Organizer</Label>
                <Input id="evt-org" value={eventForm.organizer || "Academic Office"} onChange={(e) => setEventForm((p) => ({ ...p, organizer: e.target.value }))} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Save Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 7. EVENT DETAILS DIALOG ───────────────────────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{selectedEvent.id}</Badge>
                  <Badge variant="outline" className="text-[9px] uppercase">{selectedEvent.category}</Badge>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">{selectedEvent.title}</DialogTitle>
                <DialogDescription>{selectedEvent.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 border rounded-xl p-3 bg-muted/20">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Organizer</span>
                    <p className="font-bold text-foreground mt-0.5">{selectedEvent.organizer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Venue</span>
                    <p className="font-bold text-primary font-mono mt-0.5">{selectedEvent.venue}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Dates</span>
                    <p className="font-bold font-mono mt-0.5">{selectedEvent.startDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Participants</span>
                    <p className="font-bold font-mono mt-0.5">{selectedEvent.participantsCount} Expected</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                <Button onClick={() => { handleDeleteEvent(selectedEvent.id, selectedEvent.title); setIsDetailsOpen(false); }} variant="destructive">
                  Delete Event
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
