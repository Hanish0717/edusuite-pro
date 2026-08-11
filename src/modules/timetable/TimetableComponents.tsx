import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  UserCheck,
  Send,
  SlidersHorizontal,
  Workflow,
  PlusCircle,
  AlertOctagon,
  BarChart3,
  ListTodo
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
import { Panel } from "@/components/dashboard/panel";
import { DonutChart, GroupedBarChart } from "@/components/dashboard/charts";

import {
  MOCK_TIMETABLE_SLOTS,
  MOCK_FACULTY_AVAILABILITY,
  MOCK_CLASSROOMS,
  MOCK_LABORATORIES,
  MOCK_CONFLICTS,
  type TimetableSlot,
  type FacultyAvailability,
  type Classroom,
  type Laboratory,
  type TimetableConflict
} from "@/data/timetable-management-mock";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const PERIODS = [
  { id: 1, label: "Period 1", time: "09:30 AM - 10:30 AM" },
  { id: 2, label: "Period 2", time: "10:30 AM - 11:30 AM" },
  { id: 99, label: "Short Break", time: "11:30 AM - 11:45 AM", isBreak: true },
  { id: 3, label: "Period 3", time: "11:45 AM - 12:45 PM" },
  { id: 4, label: "Period 4", time: "12:45 PM - 01:30 PM" },
  { id: 100, label: "Lunch Break", time: "01:30 PM - 02:15 PM", isBreak: true },
  { id: 5, label: "Period 5", time: "02:15 PM - 03:15 PM" },
  { id: 6, label: "Period 6", time: "03:15 PM - 04:15 PM" },
  { id: 7, label: "Period 7", time: "04:15 PM - 05:00 PM" }
];

import {
  getCentralizedMasterTimetable,
  addMasterTimetableEntry,
  deleteMasterTimetableEntry,
  validateTimetableConflicts,
  type TimetableEntry,
  type DayOfWeek,
} from "@/services/master-timetable-service";

import { WeeklyGrid } from "@/components/dashboard/timetable/weekly-grid-master";

export function TimetableModuleView() {
  // Simulated Loading/Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View Mode State
  const [viewMode, setViewMode] = useState<"institution" | "department" | "faculty" | "room" | "lab" | "section">("institution");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("all");
  const [secFilter, setSecFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection & Modal States
  const [activeTab, setActiveTab] = useState<"weekly" | "builder" | "conflicts" | "faculty" | "classrooms" | "labs" | "analytics">("weekly");
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [isSlotDetailsOpen, setIsSlotDetailsOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAutoGenerateOpen, setIsAutoGenerateOpen] = useState(false);

  // Manual builder state
  const [builderForm, setBuilderForm] = useState<any>({
    department: "CSE",
    semester: "Semester V",
    section: "CSE-A",
    subjectCode: "CS501",
    subject: "Computer Networks",
    faculty: "Dr. K. Sai Teja",
    facultyId: "fac-101",
    room: "LH-302",
    day: "Monday",
    period: 1,
    status: "Draft",
    credits: 3
  });

  // Core entities state
  const [facultyList, setFacultyList] = useState<FacultyAvailability[]>(MOCK_FACULTY_AVAILABILITY);
  const [classroomsList, setClassroomsList] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [labsList, setLabsList] = useState<Laboratory[]>(MOCK_LABORATORIES);
  const [conflictsList, setConflictsList] = useState<TimetableConflict[]>(MOCK_CONFLICTS);

  // Master entries from centralized single source of truth
  const [masterEntries, setMasterEntries] = useState<TimetableEntry[]>(getCentralizedMasterTimetable());

  // Normalized compatibility derived list for components referencing timetableSlots
  const timetableSlots = useMemo(() => {
    return (masterEntries || []).map((e) => ({
      id: e.id,
      academicYear: e.academicYear,
      department: e.deptCode || e.department,
      program: e.program,
      semester: e.semester,
      section: e.section,
      day: e.day as any,
      period: e.period,
      subject: e.subjectName,
      subjectCode: e.subjectCode,
      faculty: e.facultyName,
      facultyId: e.facultyId,
      room: e.room,
      startTime: e.startTime,
      endTime: e.endTime,
      status: (e.status === "Scheduled" ? "Approved" : e.status) as any,
      credits: e.credits,
    }));
  }, [masterEntries]);

  const setTimetableSlots = (updater: any) => {
    if (typeof updater === "function") {
      setMasterEntries((prev: any) => updater(prev));
    } else {
      setMasterEntries(updater);
    }
  };

  // Dynamic conflicts validation
  const conflicts = useMemo(() => {
    return validateTimetableConflicts(masterEntries);
  }, [masterEntries]);

  // Dynamic filtering based on active view mode and filter selections
  const filteredMasterEntries = useMemo(() => {
    return masterEntries.filter((e) => {
      // View Mode restrictions
      if (viewMode === "department" && deptFilter !== "all" && e.deptCode !== deptFilter) return false;
      if (viewMode === "faculty" && facultyFilter !== "all" && e.facultyId !== facultyFilter && !e.facultyName.includes(facultyFilter)) return false;
      if (viewMode === "room" && roomFilter !== "all" && e.room !== roomFilter) return false;
      if (viewMode === "lab" && (e.lectureType !== "Lab" && !e.room.toLowerCase().includes("lab"))) return false;
      if (viewMode === "section" && secFilter !== "all" && e.section !== secFilter) return false;

      // General Filters
      if (deptFilter !== "all" && e.deptCode !== deptFilter) return false;
      if (semFilter !== "all" && e.semester !== semFilter) return false;
      if (secFilter !== "all" && e.section !== secFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (dayFilter !== "all" && e.day.toLowerCase() !== dayFilter.toLowerCase()) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesSubject = e.subjectName.toLowerCase().includes(q) || e.subjectCode.toLowerCase().includes(q);
        const matchesFaculty = e.facultyName.toLowerCase().includes(q);
        const matchesRoom = e.room.toLowerCase().includes(q);
        const matchesSec = e.section.toLowerCase().includes(q);
        return matchesSubject || matchesFaculty || matchesRoom || matchesSec;
      }

      return true;
    });
  }, [masterEntries, viewMode, deptFilter, semFilter, secFilter, facultyFilter, roomFilter, statusFilter, dayFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDeptFilter("all");
    setSemFilter("all");
    setSecFilter("all");
    setFacultyFilter("all");
    setRoomFilter("all");
    setDayFilter("all");
    setStatusFilter("all");
    setViewMode("institution");
    toast.success("Filters reset successfully");
  };

  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  // Conflict Resolution handler
  const handleResolveConflict = (id: string, message: string) => {
    setConflictsList((prev) => prev.filter((c) => c.id !== id));
    toast.success(`Conflict resolved successfully: ${message}`);
  };

  // Auto Generate Timetable
  const handleAutoGenerateTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAutoGenerateOpen(false);
      toast.success("AI Optimizer successfully generated timetable baseline with zero critical conflicts!");
    }, 1500);
  };

  // Publish Timetable
  const handlePublishTimetable = () => {
    setTimetableSlots((prev: any[]) => (prev || []).map((s: any) => ({ ...s, status: "Published" as const })));
    setIsPublishModalOpen(false);
    toast.success("All draft and pending timetables have been published institution-wide!");
  };

  // Add slot from Manual Builder
  const handleAddBuilderSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const startTimeStr = PERIODS.find((p) => p.id === builderForm.period)?.time.split(" - ")[0] || "09:30 AM";
    const endTimeStr = PERIODS.find((p) => p.id === builderForm.period)?.time.split(" - ")[1] || "10:30 AM";

    // Client-side conflict checker
    const hasRoomConflict = (timetableSlots || []).some(
      (s) => s.day === builderForm.day && s.period === builderForm.period && s.room === builderForm.room
    );

    const hasFacultyConflict = (timetableSlots || []).some(
      (s) => s.day === builderForm.day && s.period === builderForm.period && s.facultyId === builderForm.facultyId
    );

    if (hasRoomConflict) {
      toast.error(`Critical Conflict: Room ${builderForm.room} is already occupied during Period ${builderForm.period}!`);
      return;
    }

    if (hasFacultyConflict) {
      toast.error(`Critical Conflict: Faculty ${builderForm.faculty} is already teaching during Period ${builderForm.period}!`);
      return;
    }

    const newSlot: TimetableSlot = {
      id: `tt-${Date.now()}`,
      academicYear: "2026-27",
      department: builderForm.department,
      program: "B.Tech",
      semester: builderForm.semester,
      section: builderForm.section,
      day: builderForm.day as any,
      period: builderForm.period,
      subject: builderForm.subject,
      subjectCode: builderForm.subjectCode,
      faculty: builderForm.faculty,
      facultyId: builderForm.facultyId,
      room: builderForm.room,
      startTime: startTimeStr,
      endTime: endTimeStr,
      status: "Draft",
      credits: builderForm.credits,
      duration: "1 hour"
    };

    setTimetableSlots((prev: any[]) => [...(prev || []), newSlot]);
    toast.success(`Successfully added ${newSlot.subjectCode} scheduling slot!`);
  };

  // Delete/Cancel Slot
  const handleDeleteSlot = (id: string, name: string) => {
    setTimetableSlots((prev: any[]) => (prev || []).filter((s: any) => s.id !== id));
    toast.warning(`Cancelled scheduled class: ${name}`);
  };

  // Filter slots
  const filteredSlots = useMemo(() => {
    return (timetableSlots || []).filter((slot) => {
      const matchesSearch =
        slot.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.room.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = deptFilter === "all" || slot.department === deptFilter;
      const matchesSem = semFilter === "all" || slot.semester === semFilter;
      const matchesSec = secFilter === "all" || slot.section === secFilter;
      const matchesStatus = statusFilter === "all" || slot.status === statusFilter;

      return matchesSearch && matchesDept && matchesSem && matchesSec && matchesStatus;
    });
  }, [timetableSlots, searchQuery, deptFilter, semFilter, secFilter, statusFilter]);

  // Index timetable by [Day][Period] for Weekly view
  const weeklyGridData = useMemo(() => {
    const grid: Record<string, Record<number, TimetableSlot[]>> = {};

    DAYS_OF_WEEK.forEach((day) => {
      grid[day] = {};
      PERIODS.forEach((p) => {
        grid[day]![p.id] = [];
      });
    });

    filteredSlots.forEach((slot) => {
      if (grid[slot.day] && grid[slot.day]![slot.period]) {
        grid[slot.day]![slot.period]!.push(slot);
      }
    });

    return grid;
  }, [filteredSlots]);

  // Analytics Utilization numbers
  const classroomOccupancyChart = [
    { name: "LH-302 (Block A)", value: 75 },
    { name: "LH-204 (Block B)", value: 40 },
    { name: "SH-101 (Seminar)", value: 20 }
  ];

  const facultyHoursChart = [
    { name: "Dr. K. Sai Teja", Hours: 14 },
    { name: "Dr. S. K. Gupta", Hours: 18 },
    { name: "Dr. Rajesh Sharma", Hours: 10 },
    { name: "Dr. Meera Rao", Hours: 12 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted/40 animate-pulse rounded-xl border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-xs leading-normal">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Calendar className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Timetable Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Create, manage, and monitor institution-wide class schedules with automated conflict resolution.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerReload}
            className="h-9 gap-1.5 font-semibold text-xs animate-none"
          >
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoGenerateOpen(true)}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sparkles className="size-3.5" /> Generate Timetable
          </Button>
          <Button
            onClick={() => setIsPublishModalOpen(true)}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Send className="size-3.5" /> Publish Timetable
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY KPI STATS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-8">
        <KpiCard label="Total Timetables" value={String((timetableSlots || []).length)} icon={Calendar} tone="primary" />
        <KpiCard label="Active Status" value="Live" icon={CheckCircle} tone="success" />
        <KpiCard label="Scheduled Today" value="8 Classes" icon={Clock} tone="info" />
        <KpiCard label="Pending Approval" value="2 Slots" icon={Workflow} tone="warning" />
        <KpiCard label="Faculty Conflicts" value={String(conflictsList.filter((c) => c.type === "Faculty Conflict").length)} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Room Conflicts" value={String(conflictsList.filter((c) => c.type === "Room Conflict").length)} icon={AlertOctagon} tone="destructive" />
        <KpiCard label="Lab Occupied" value={String(labsList.filter((l) => l.status === "Occupied").length)} icon={Building2} tone="info" />
        <KpiCard label="Unassigned Classes" value="1 Course" icon={ListTodo} tone="warning" />
      </div>

      {/* 3. MULTIPLE VIEW MODE TABS */}
      <div className="flex justify-between items-center border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "weekly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-3.5" /> Weekly View Grid
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "builder" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="size-3.5" /> Manual Editor Builder
          </button>
          <button
            onClick={() => setActiveTab("conflicts")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "conflicts" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="size-3.5" /> Conflicts ledger ({conflictsList.length})
          </button>
          <button
            onClick={() => setActiveTab("faculty")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "faculty" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="size-3.5" /> Faculty Availability
          </button>
          <button
            onClick={() => setActiveTab("classrooms")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "classrooms" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3.5" /> Classroom Allocations
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "analytics" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-3.5" /> Utilization Analytics
          </button>
        </div>
      </div>

      {/* 4. TAB PANELS */}

      {/* TAB 1: Weekly Grid */}
      {activeTab === "weekly" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3 mb-2 flex-wrap gap-2">
            <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-primary" /> Institution Weekly Grid Matrix
            </h3>
            <div className="flex gap-2">
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-8 text-xs w-[120px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-xl no-scrollbar">
            <table className="w-full border-collapse text-left table-fixed min-w-[1000px] xl:min-w-[1100px]">
              <thead>
                <tr className="bg-muted/40 font-semibold text-muted-foreground border-b text-[10px]">
                  <th className="py-2.5 px-3 border-r w-[140px]">Periods / Times</th>
                  {DAYS_OF_WEEK.map((day) => (
                    <th key={day} className="py-2.5 px-3 border-r w-[140px] sm:w-auto">{day}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {PERIODS.map((p) => {
                  if (p.isBreak) {
                    return (
                      <tr key={p.label} className="bg-muted/20 border-b">
                        <td className="py-2 px-3 border-r font-mono text-[9px] font-bold text-muted-foreground">
                          {p.time}
                        </td>
                        <td colSpan={6} className="py-2 text-center text-muted-foreground italic font-semibold tracking-wider text-[9px] uppercase">
                          ☕ {p.label} &middot; {p.time}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={p.id} className="border-b">
                      <td className="py-4 px-3 border-r font-mono">
                        <p className="font-bold text-foreground">{p.label}</p>
                        <span className="text-[9px] text-muted-foreground">{p.time}</span>
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const slots = weeklyGridData[day]?.[p.id] || [];
                        return (
                          <td key={day} className="py-3 px-2.5 border-r align-top hover:bg-muted/10 transition-colors">
                            {slots.length > 0 ? (
                              <div className="space-y-1">
                                {slots.map((s) => (
                                  <div
                                    key={s.id}
                                    onClick={() => {
                                      setSelectedSlot(s);
                                      setIsSlotDetailsOpen(true);
                                    }}
                                    className="p-2 border rounded-lg bg-primary/5 hover:bg-primary/10 border-primary/20 cursor-pointer space-y-0.5"
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <span className="font-mono font-bold text-[10px] text-primary">{s.subjectCode}</span>
                                      <Badge variant="outline" className="text-[8px] py-0 px-1 font-mono">
                                        {s.section}
                                      </Badge>
                                    </div>
                                    <p className="font-bold text-[10px] leading-tight text-foreground truncate">{s.subject}</p>
                                    <p className="text-[9px] text-muted-foreground truncate">{s.faculty}</p>
                                    <div className="flex items-center gap-1 text-[8px] text-muted-foreground mt-0.5">
                                      <MapPin className="size-2 shrink-0" />
                                      <span>{s.room}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[9px] text-muted-foreground/30 italic block py-4 text-center">Empty</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Manual Builder Form */}
      {activeTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Form */}
          <div className="lg:col-span-1 border rounded-2xl bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display text-foreground border-b pb-2 mb-2 flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" /> Timetable Scheduler
            </h3>

            <form onSubmit={handleAddBuilderSlot} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="build-dept">Academic Department</Label>
                <Select
                  value={builderForm.department}
                  onValueChange={(val: any) => setBuilderForm((prev: any) => ({ ...prev, department: val }))}
                >
                  <SelectTrigger id="build-dept">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="build-sem">Semester</Label>
                  <Input
                    id="build-sem"
                    value={builderForm.semester}
                    onChange={(e) => setBuilderForm((prev: any) => ({ ...prev, semester: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="build-sec">Section</Label>
                  <Input
                    id="build-sec"
                    value={builderForm.section}
                    onChange={(e) => setBuilderForm((prev: any) => ({ ...prev, section: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="build-subcode">Subject Code</Label>
                  <Input
                    id="build-subcode"
                    value={builderForm.subjectCode}
                    onChange={(e) => setBuilderForm((prev: any) => ({ ...prev, subjectCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="build-subname">Subject Name</Label>
                  <Input
                    id="build-subname"
                    value={builderForm.subject}
                    onChange={(e) => setBuilderForm((prev: any) => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="build-fac">Faculty Name</Label>
                  <Input
                    id="build-fac"
                    value={builderForm.faculty}
                    onChange={(e) => setBuilderForm((prev: any) => ({ ...prev, faculty: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="build-room">Classroom Room</Label>
                  <Input
                    id="build-room"
                    value={builderForm.room}
                    onChange={(e) => setBuilderForm((prev: any) => ({ ...prev, room: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="build-day">Day of Week</Label>
                  <Select
                    value={builderForm.day}
                    onValueChange={(val: any) => setBuilderForm((prev: any) => ({ ...prev, day: val }))}
                  >
                    <SelectTrigger id="build-day">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="build-period">Period Number</Label>
                  <Select
                    value={String(builderForm.period)}
                    onValueChange={(val: any) => setBuilderForm((prev: any) => ({ ...prev, period: parseInt(val) }))}
                  >
                    <SelectTrigger id="build-period">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <SelectItem key={num} value={String(num)}>Period {num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-brand-gradient text-white font-semibold gap-1.5 h-9">
                <Plus className="size-4" /> Add Slot to Schedule
              </Button>
            </form>
          </div>

          {/* Active Manual Listings */}
          <div className="lg:col-span-2 border rounded-2xl bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" /> Active Scheduling Drafts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-medium text-foreground">
                <thead>
                  <tr className="text-muted-foreground font-semibold border-b">
                    <th className="py-2">Subject / Code</th>
                    <th className="py-2">Schedule Detail</th>
                    <th className="py-2">Faculty Assignments</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(timetableSlots || []).map((slot) => (
                    <tr key={slot.id} className="border-b border-border/40">
                      <td className="py-3">
                        <p className="font-bold text-foreground">{slot.subject}</p>
                        <span className="font-mono text-[9px] text-muted-foreground">{slot.subjectCode}</span>
                      </td>
                      <td className="py-3">
                        <p className="font-bold">{slot.day} &middot; Period {slot.period}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{slot.startTime} - {slot.endTime}</span>
                      </td>
                      <td className="py-3 font-semibold text-primary">
                        <p>{slot.faculty}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{slot.room}</span>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-[9px] uppercase">
                          {slot.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id, slot.subject)}
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Conflicts Panel */}
      {activeTab === "conflicts" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <AlertTriangle className="size-5 text-primary" /> Active System Collision & Conflict Warnings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conflictsList.map((conflict) => (
              <div
                key={conflict.id}
                className={`p-4 border rounded-xl space-y-2 flex flex-col justify-between ${
                  conflict.severity === "critical"
                    ? "bg-destructive/5 border-destructive/20 text-destructive"
                    : "bg-warning/5 border-warning/20 text-warning"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span className="font-bold font-mono text-[10px] uppercase tracking-wider">{conflict.type}</span>
                  </div>
                  <p className="font-bold text-foreground text-xs mt-1.5 leading-relaxed">{conflict.message}</p>
                </div>
                <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                  <Badge variant="outline" className="text-[9px] py-0 tracking-wide font-mono uppercase">
                    {conflict.severity}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveConflict(conflict.id, conflict.message)}
                    className="h-7 text-[10px] font-semibold border-primary/20 text-primary hover:bg-primary/5 cursor-pointer"
                  >
                    Resolve Alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Faculty Availability */}
      {activeTab === "faculty" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <UserCheck className="size-5 text-primary" /> Faculty Workload & Unavailable Blocks Checklist
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead>
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2">Faculty Member</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Workload Limit</th>
                  <th className="py-2">Unavailable Slots</th>
                  <th className="py-2 text-right">Workload Status</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((fac) => (
                  <tr key={fac.facultyId} className="border-b border-border/40">
                    <td className="py-3 font-bold text-foreground">{fac.facultyName}</td>
                    <td className="py-3">{fac.department}</td>
                    <td className="py-3 font-mono font-bold">
                      {fac.weeklyWorkload} / {fac.maxWorkload} Hours
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {fac.unavailableSlots.map((slot, idx) => (
                          <Badge key={idx} variant="outline" className="text-[9px] font-mono py-0 text-destructive border-destructive/20 bg-destructive/5">
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase ${
                          fac.status === "Overloaded"
                            ? "text-destructive border-destructive/20 bg-destructive/5"
                            : "text-emerald-600 border-emerald-200 bg-emerald-50"
                        }`}
                      >
                        {fac.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Classroom Allocation */}
      {activeTab === "classrooms" && (
        <div className="space-y-4 border rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Building2 className="size-5 text-primary" /> Classroom Capacity & Allocations Directory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classroomsList.map((room) => (
              <div key={room.roomId} className="p-4 border rounded-xl space-y-2 flex flex-col justify-between bg-card hover:bg-muted/10 transition-colors">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-mono font-bold text-xs text-primary">{room.roomNumber}</span>
                    <Badge variant="outline" className="text-[9px]">
                      {room.roomType}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{room.building}</p>
                  <p className="font-bold text-foreground text-xs mt-2">Capacity: {room.capacity} students</p>
                  {room.currentSchedule && (
                    <p className="text-[9px] text-muted-foreground mt-1 font-mono italic">
                      Current: {room.currentSchedule}
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase ${
                      room.status === "Occupied" ? "text-amber-500 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"
                    }`}
                  >
                    {room.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px] font-semibold text-primary cursor-pointer">
                    View Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Faculty Utilization Hours */}
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Faculty Utilization Hours</span>
              <span className="text-[10px] text-primary lowercase font-mono">Weekly workload distribution</span>
            </h4>
            <GroupedBarChart
              data={facultyHoursChart as any}
              xKey="name"
              series={[{ key: "Hours", label: "Hours" }]}
              height={180}
            />
          </div>

          {/* Classroom Room Occupancy */}
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Classroom Room Occupancy</span>
              <span className="text-[10px] text-success font-mono">Capacity % percentage</span>
            </h4>
            <DonutChart data={classroomOccupancyChart} centerLabel="Occupancy" height={180} />
          </div>
        </div>
      )}

      {/* 5. DRAFT RESOLUTION MODAL */}
      <Dialog open={isSlotDetailsOpen} onOpenChange={setIsSlotDetailsOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedSlot && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">
                    {selectedSlot.subjectCode}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{selectedSlot.section}</span>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">
                  {selectedSlot.subject}
                </DialogTitle>
                <DialogDescription>
                  Review course credits, assigned instructor, room schedule, and status.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2.5">
                <div className="grid grid-cols-2 gap-3.5 border rounded-xl p-3 bg-muted/20">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Day & Period</span>
                    <p className="font-bold mt-0.5">{selectedSlot.day} &middot; Period {selectedSlot.period}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Time Slot</span>
                    <p className="font-bold mt-0.5 font-mono">{selectedSlot.startTime} - {selectedSlot.endTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Classroom Room</span>
                    <p className="font-bold mt-0.5">{selectedSlot.room}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Credits Level</span>
                    <p className="font-bold mt-0.5">{selectedSlot.credits || 3} Credits</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[10px]">Primary Instructor</span>
                  <p className="font-bold text-foreground text-xs">{selectedSlot.faculty}</p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsSlotDetailsOpen(false)}>Close Details</Button>
                <Button
                  onClick={() => {
                    handleDeleteSlot(selectedSlot.id, selectedSlot.subject);
                    setIsSlotDetailsOpen(false);
                  }}
                  variant="destructive"
                  className="font-semibold"
                >
                  Cancel Class Slot
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. AUTO GENERATOR OPTIMIZATION MODAL */}
      <Dialog open={isAutoGenerateOpen} onOpenChange={setIsAutoGenerateOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display flex items-center gap-2">
              <Sparkles className="size-5 text-primary" /> AI Timetable Optimizer
            </DialogTitle>
            <DialogDescription>
              Generate optimized schedules across all departments based on curriculum requirements, room availability, and faculty constraints.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAutoGenerateTimetable} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="gen-year">Academic Year</Label>
                <Select defaultValue="2026-27">
                  <SelectTrigger id="gen-year">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026-27">2026-27</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="gen-reg">Regulation</Label>
                <Select defaultValue="R25">
                  <SelectTrigger id="gen-reg">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R25">R25</SelectItem>
                    <SelectItem value="R22">R22</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="gen-desc">AI Optimizer Instructions</Label>
                <Textarea
                  id="gen-desc"
                  placeholder="e.g. Optimize faculty blocks to prevent afternoon slots."
                  className="min-h-[70px] text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAutoGenerateOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Generate Timetables</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. PUBLISH WARNING DIALOG */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Publish Institutional Timetable?</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish the timetable baseline? This will update schedules for all departments, faculty members, and student rosters.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsPublishModalOpen(false)}>Cancel</Button>
            <Button onClick={handlePublishTimetable} className="bg-brand-gradient text-white font-semibold">Publish Timetable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
