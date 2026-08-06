import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
  Download,
  Search,
  Filter,
  Users,
  Building2,
  UserCheck,
  AlertCircle,
  Eye,
  CalendarDays,
  FileUp,
  TrendingUp,
  UserCog,
  Briefcase,
  Plane,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { useRole } from "@/context/role-context";

import {
  fetchLeaveApplications,
  fetchLeaveBalances,
  applyForLeave,
  updateLeaveStatus,
  MOCK_HOLIDAYS_AND_EVENTS,
  type LeaveApplication,
  type LeaveBalance,
  type HolidayEvent,
} from "./LeaveService";

// Helper function for CSS classes conditionally
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function LeaveModuleView() {
  const { profile } = useRole();
  const department = profile?.department || "CSE";
  const applicantName = profile?.personaName || "Dr. Ravi Kumar";
  const applicantRole = profile?.personaMeta || "Associate Professor - CSE Department";

  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedYear, setSelectedYear] = useState("AY 2026-27");

  // Selected date details (Calendar click)
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<HolidayEvent | LeaveApplication | null>(null);

  // Dialog States
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);

  // Form State for Leave Application
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFields, setFormFields] = useState({
    leaveType: "Casual" as LeaveApplication["leaveType"],
    startDate: new Date().toISOString().split("T")[0] || "",
    endDate: new Date().toISOString().split("T")[0] || "",
    isHalfDay: false,
    reason: "",
    emergencyContact: "",
    remarks: "",
    attachmentName: "" as string | undefined,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate real asynchronous latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      const [historyData, balancesData] = await Promise.all([
        fetchLeaveApplications(department),
        fetchLeaveBalances(department),
      ]);
      setLeaves(historyData);
      setBalances(balancesData);
    } catch (err) {
      setError("Failed to synchronize Leave Management data records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  // Synchronize local search / filter logic
  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const matchesSearch =
        l.reason.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.applicantName.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType === "All Types" || l.leaveType.toLowerCase() === selectedType.toLowerCase();

      const matchesStatus =
        selectedStatus === "All Status" || l.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [leaves, search, selectedType, selectedStatus]);

  // Statistics calculation for Summary Cards
  const stats = useMemo(() => {
    const casual = balances.find((b) => b.leaveType.includes("Casual"));
    const sick = balances.find((b) => b.leaveType.includes("Sick"));
    const earned = balances.find((b) => b.leaveType.includes("Earned"));
    const duty = balances.find((b) => b.leaveType.includes("Duty"));

    const pendingCount = leaves.filter((l) => l.status === "Pending").length;
    const upcoming = leaves.find((l) => l.status === "Approved" && new Date(l.startDate) > new Date());

    return {
      casualText: casual ? `${casual.remaining} / ${casual.total} Days` : "8 / 12 Days",
      sickText: sick ? `${sick.remaining} / ${sick.total} Days` : "12 / 15 Days",
      earnedText: earned ? `${earned.remaining} / ${earned.total} Days` : "6 / 10 Days",
      dutyText: duty ? `${duty.remaining} Remaining` : "2 Remaining",
      pendingText: `${pendingCount} Request${pendingCount !== 1 ? "s" : ""}`,
      upcomingText: upcoming
        ? new Date(upcoming.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : "No upcoming leaves",
    };
  }, [balances, leaves]);

  // Calendar configuration (August 2026)
  const currentMonthName = "August 2026";
  const calendarDays = useMemo(() => {
    const days = [];
    const totalDaysInAugust = 31;
    // August 2026 starts on a Saturday (index 6, assuming Sunday is 0)
    const startOffset = 6;

    // Fill offset days
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ dayNumber: 31 - i, isCurrentMonth: false });
    }

    // Fill current month days
    for (let d = 1; d <= totalDaysInAugust; d++) {
      const dateString = `2026-08-${String(d).padStart(2, "0")}`;

      // Check for holiday or event
      const holiday = MOCK_HOLIDAYS_AND_EVENTS.find((h) => h.date === dateString);

      // Check for leaves
      const leave = leaves.find(
        (l) =>
          dateString >= l.startDate &&
          dateString <= l.endDate &&
          l.status !== "Cancelled" &&
          l.status !== "Draft"
      );

      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateString,
        holiday,
        leave,
      });
    }

    // Pad remaining grid spaces
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ dayNumber: i, isCurrentMonth: false });
    }

    return days;
  }, [leaves]);

  // Form Reset
  const handleFormReset = () => {
    setFormFields({
      leaveType: "Casual",
      startDate: new Date().toISOString().split("T")[0] || "",
      endDate: new Date().toISOString().split("T")[0] || "",
      isHalfDay: false,
      reason: "",
      emergencyContact: "",
      remarks: "",
      attachmentName: "",
    });
  };

  // Submit Leave Action
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.reason.trim()) {
      toast.error("Please provide a reason for the leave request.");
      return;
    }
    if (!formFields.emergencyContact.trim()) {
      toast.error("Emergency contact details are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 850));
      const newLeave = await applyForLeave({
        leaveType: formFields.leaveType,
        startDate: formFields.startDate,
        endDate: formFields.endDate,
        isHalfDay: formFields.isHalfDay,
        reason: formFields.reason,
        emergencyContact: formFields.emergencyContact,
        applicantName,
        applicantRole,
        department,
        ...(formFields.remarks ? { remarks: formFields.remarks } : {}),
        ...(formFields.attachmentName ? { attachmentName: formFields.attachmentName } : {}),
      });
      setLeaves((prev) => [newLeave, ...prev]);
      toast.success(`Leave request ${newLeave.id} submitted for approval successfully!`);
      handleFormReset();
    } catch (err) {
      toast.error("Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action Cancel Leave
  const handleCancelLeave = async (id: string) => {
    if (confirm("Are you sure you want to cancel this leave application?")) {
      try {
        await updateLeaveStatus(id, "Cancelled");
        setLeaves((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: "Cancelled" } : l))
        );
        toast.success(`Leave request ${id} cancelled successfully.`);
      } catch (err) {
        toast.error("Failed to cancel leave request.");
      }
    }
  };

  // Export CSV Action
  const handleExportCSV = () => {
    const headers = ["Leave ID", "Leave Type", "Applied Date", "From", "To", "Days", "Reason", "Approver", "Status"];
    const rows = filteredLeaves.map((l) => [
      l.id,
      l.leaveType,
      l.appliedOn,
      l.startDate,
      l.endDate,
      l.days,
      `"${l.reason}"`,
      l.approver,
      l.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leave_History_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded Leave History CSV Report.");
  };

  // Mock File Upload drag & drop click simulator
  const handleMockAttachment = () => {
    const fileNames = ["Medical_Certificate_A.pdf", "Wedding_Invitation.pdf", "Duty_Conference_Approval.pdf"];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    setFormFields((prev) => ({ ...prev, attachmentName: randomName }));
    toast.info(`Mock attachment "${randomName}" uploaded.`);
  };

  // Timeline render for HOD/Principal review of selected leave
  const activeApprovalTimelineLeave = useMemo(() => {
    const pendingOrRecent = leaves.find((l) => l.status === "Pending") || leaves[0];
    return pendingOrRecent || null;
  }, [leaves]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-fade-up">
      {/* Leave Header & Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <CalendarIcon className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Leave & Absence Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Department: {department}
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Submit leave requests, check balance quotas, and track review status dynamically.
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-auto w-full xl:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search ID, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-xs rounded-xl"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs bg-card border-border">
              <Filter className="size-3.5 mr-1 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              {["All Types", "Casual", "Sick", "Earned", "Duty Leave", "Comp-Off"].map((t) => (
                <SelectItem key={t} value={t} className="text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs bg-card border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {["All Status", "Pending", "Approved", "Rejected", "Cancelled"].map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-full sm:w-[120px] text-xs bg-card border-border font-mono">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {["AY 2026-27", "AY 2025-26"].map((y) => (
                <SelectItem key={y} value={y} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-9 gap-1.5 text-xs font-semibold border-border hover:bg-accent cursor-pointer"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs font-semibold border-border hover:bg-accent cursor-pointer"
          >
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      </div>

      {loading ? (
        /* Loading skeleton state */
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/60 animate-pulse rounded-2xl border border-border/80" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-[250px] bg-muted/60 animate-pulse rounded-2xl border border-border/80" />
              <div className="h-[300px] bg-muted/60 animate-pulse rounded-2xl border border-border/80" />
            </div>
            <div className="space-y-6">
              <div className="h-[200px] bg-muted/60 animate-pulse rounded-2xl border border-border/80" />
              <div className="h-[350px] bg-muted/60 animate-pulse rounded-2xl border border-border/80" />
            </div>
          </div>
        </div>
      ) : error ? (
        /* Error panel state */
        <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={loadData} className="ml-auto text-xs border-destructive/20 hover:bg-destructive/10">
            Try Again
          </Button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {[
              { label: "Casual Leave", val: stats.casualText, icon: Plane, bg: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
              { label: "Sick Leave", val: stats.sickText, icon: Heart, bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
              { label: "Earned Leave", val: stats.earnedText, icon: UserCog, bg: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
              { label: "Duty Leave", val: stats.dutyText, icon: Briefcase, bg: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
              { label: "Pending Approvals", val: stats.pendingText, icon: Clock, bg: "bg-rose-500/10 text-rose-600 border-rose-500/10" },
              { label: "Upcoming Leave", val: stats.upcomingText, icon: CalendarDays, bg: "bg-sky-500/10 text-sky-600 border-sky-500/10" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-sm space-y-1 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>{card.label}</span>
                    <span className={cn("p-1 rounded-lg shrink-0", card.bg)}>
                      <Icon className="size-3.5" />
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold text-foreground mt-1.5">{card.val}</p>
                </div>
              );
            })}
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (2/3 width on Desktop) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Leave Balance Overview progress bars */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-sm md:text-base text-foreground flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" /> Leave Quota Balances
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">Academic Year 2026-27</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {balances.map((bal, idx) => {
                    const percent = Math.min(100, Math.round((bal.used / bal.total) * 100));
                    return (
                      <div key={idx} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-foreground">{bal.leaveType}</span>
                          <span className="text-muted-foreground font-mono">
                            {bal.remaining} Left &middot; {bal.used} Used
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-500", bal.color)} style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground font-medium font-mono">
                          <span>{bal.total} Days Max Limit</span>
                          <span>{percent}% Used</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm md:text-base text-foreground border-b border-border/60 pb-3">
                  Quick Operations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Apply Leave Request", desc: "Open Application Form", link: "#apply-form", icon: Plus, color: "text-blue-500 bg-blue-500/10" },
                    { label: "View History Log", desc: "Read Leave Records", link: "#history-table", icon: FileText, color: "text-emerald-500 bg-emerald-500/10" },
                    { label: "Holiday Calendar", desc: "View Gazetted Days", link: "#calendar-view", icon: CalendarIcon, color: "text-indigo-500 bg-indigo-500/10" },
                    { label: "Approval Timelines", desc: "Check Pending Reviews", link: "#timeline", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
                    { label: "Download CSV Report", desc: "Export Roster Ledger", link: "#", onClick: handleExportCSV, icon: Download, color: "text-rose-500 bg-rose-500/10" },
                    { label: "Leave HR Policy", desc: "Read Regulations Docs", link: "#", icon: ShieldCheck, color: "text-violet-500 bg-violet-500/10" },
                  ].map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <a
                        key={i}
                        href={act.link}
                        onClick={act.onClick}
                        className="p-3.5 rounded-xl border border-border/60 hover:border-primary/40 bg-card hover:bg-muted/10 text-left transition-all duration-300 block space-y-1 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn("p-1.5 rounded-lg shrink-0", act.color)}>
                            <Icon className="size-4" />
                          </span>
                        </div>
                        <p className="text-xs font-bold text-foreground mt-2 line-clamp-1">{act.label}</p>
                        <p className="text-[0.65rem] text-muted-foreground line-clamp-1">{act.desc}</p>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Leave Calendar View */}
              <div id="calendar-view" className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-sm md:text-base text-foreground flex items-center gap-2">
                    <CalendarIcon className="size-4 text-primary" /> Monthly Attendance & Leave Calendar
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs font-bold font-mono">{currentMonthName}</span>
                    <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Legend indicators */}
                <div className="flex flex-wrap gap-2 text-[0.65rem] text-muted-foreground border-b border-border/40 pb-2">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> Approved Leave</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" /> Pending Leave</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500" /> Holidays</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-rose-500" /> Exam Days</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-teal-500" /> Department Events</span>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-[0.68rem] font-bold text-muted-foreground py-1 bg-muted/30 rounded-lg">
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((cell, idx) => {
                    const isSelected = !!(selectedCalendarEvent && (
                      (cell.holiday && "title" in selectedCalendarEvent && selectedCalendarEvent.title === cell.holiday.title) ||
                      (cell.leave && "id" in selectedCalendarEvent && selectedCalendarEvent.id === cell.leave.id)
                    ));

                    return (
                      <button
                        key={idx}
                        disabled={!cell.isCurrentMonth}
                        onClick={() => {
                          if (cell.holiday) setSelectedCalendarEvent(cell.holiday);
                          else if (cell.leave) setSelectedCalendarEvent(cell.leave);
                          else setSelectedCalendarEvent(null);
                        }}
                        className={cn(
                          "min-h-12 md:min-h-16 p-1.5 border border-border/40 rounded-xl relative flex flex-col items-start transition-all hover:bg-muted/30 select-none w-full text-left",
                          !cell.isCurrentMonth && "opacity-25 bg-muted/10 cursor-not-allowed",
                          isSelected ? "ring-2 ring-primary ring-offset-1 bg-primary/5 border-primary/20" : "",
                          cell.holiday && "bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/10",
                          cell.leave && cell.leave.status === "Approved" && "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10",
                          cell.leave && cell.leave.status === "Pending" && "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/10"
                        )}
                      >
                        <span className="text-[0.7rem] font-semibold text-muted-foreground">{cell.dayNumber}</span>
                        
                        {/* Event tags inside cell */}
                        {cell.holiday && (
                          <div className={cn(
                            "text-[0.55rem] font-bold px-1 py-0.5 rounded mt-1 truncate w-full",
                            cell.holiday.type === "National" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" :
                            cell.holiday.type === "Exam" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" :
                            "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          )}>
                            {cell.holiday.title}
                          </div>
                        )}

                        {cell.leave && (
                          <div className={cn(
                            "text-[0.55rem] font-bold px-1 py-0.5 rounded mt-1 truncate w-full",
                            cell.leave.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          )}>
                            {cell.leave.leaveType}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Selected Date Inspector */}
                {selectedCalendarEvent && (
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 animate-fade-in text-xs space-y-1.5">
                    <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                      <span className="font-bold text-foreground">Selected Date Activity</span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedCalendarEvent(null)} className="h-6 px-1.5 text-[0.65rem] hover:bg-muted font-bold text-red-500">
                        Clear
                      </Button>
                    </div>
                    {"title" in selectedCalendarEvent ? (
                      <div>
                        <p className="font-semibold text-primary">{selectedCalendarEvent.title}</p>
                        <p className="text-muted-foreground text-[0.68rem]">{selectedCalendarEvent.details}</p>
                        <Badge variant="outline" className="text-[0.6rem] font-mono mt-1 bg-card">
                          Category: {selectedCalendarEvent.type}
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-foreground">Leave ID: {selectedCalendarEvent.id} &middot; {selectedCalendarEvent.leaveType} Leave</p>
                        <p className="text-muted-foreground text-[0.68rem]">Reason: {selectedCalendarEvent.reason}</p>
                        <p className="text-[0.68rem] font-medium text-muted-foreground">Duration: {selectedCalendarEvent.startDate} to {selectedCalendarEvent.endDate} ({selectedCalendarEvent.days} days)</p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/20">
                          <span className="text-[0.68rem] text-muted-foreground">Approver: {selectedCalendarEvent.approver}</span>
                          <Badge className={selectedCalendarEvent.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                            {selectedCalendarEvent.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Apply Leave Form */}
              <div id="apply-form" className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm md:text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                  <FileText className="size-4 text-primary" /> Apply Leave Application
                </h3>

                <form onSubmit={handleApplySubmit} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Leave Category</Label>
                      <Select
                        value={formFields.leaveType}
                        onValueChange={(val) => setFormFields({ ...formFields, leaveType: val as any })}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Leave Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Casual", "Sick", "Earned", "Duty Leave", "Comp-Off"].map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">
                              {t} Leave
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 flex items-end">
                      <label className="flex items-center gap-2 text-xs font-semibold border border-border bg-muted/10 p-2.5 rounded-xl h-9 w-full cursor-pointer hover:bg-muted/20 select-none">
                        <input
                          type="checkbox"
                          checked={formFields.isHalfDay}
                          onChange={(e) => setFormFields({ ...formFields, isHalfDay: e.target.checked })}
                          className="rounded cursor-pointer"
                        />
                        <span>Apply as Half-Day Session</span>
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Start Date</Label>
                      <Input
                        type="date"
                        required
                        value={formFields.startDate}
                        onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">End Date</Label>
                      <Input
                        type="date"
                        required
                        value={formFields.endDate}
                        onChange={(e) => setFormFields({ ...formFields, endDate: e.target.value })}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Emergency Contact Number</Label>
                      <Input
                        required
                        value={formFields.emergencyContact}
                        placeholder="+91 XXXXX XXXXX"
                        onChange={(e) => setFormFields({ ...formFields, emergencyContact: e.target.value })}
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Documents Attachment (Optional)</Label>
                      <div
                        onClick={handleMockAttachment}
                        className="border border-dashed border-border/80 hover:border-primary/60 bg-muted/10 hover:bg-muted/30 p-2 rounded-xl h-9 flex items-center justify-center gap-1 text-[0.68rem] font-semibold text-muted-foreground cursor-pointer transition-all truncate"
                      >
                        <FileUp className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{formFields.attachmentName || "Select file upload..."}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Reason for Absence</Label>
                    <Textarea
                      required
                      placeholder="Please provide explanation for leaving classes / duty..."
                      value={formFields.reason}
                      onChange={(e) => setFormFields({ ...formFields, reason: e.target.value })}
                      className="text-xs min-h-[64px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Remarks (Alternate Handover, etc.)</Label>
                    <Input
                      placeholder="e.g. Syllabus adjustments handed over to Ms. Ananya Verma"
                      value={formFields.remarks}
                      onChange={(e) => setFormFields({ ...formFields, remarks: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" type="button" onClick={handleFormReset} className="h-9 text-xs rounded-xl cursor-pointer">
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" type="button" className="h-9 text-xs rounded-xl cursor-pointer">
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-9 bg-brand-gradient text-white text-xs font-semibold shadow-glow rounded-xl hover:opacity-95 cursor-pointer shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="size-3 animate-spin mr-1" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Leave"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Leave History Table */}
              <div id="history-table" className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="font-bold text-sm md:text-base text-foreground flex items-center gap-2">
                    <FileText className="size-4 text-primary" /> Leave History Log
                  </h3>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {filteredLeaves.length} Records
                  </Badge>
                </div>

                {filteredLeaves.length === 0 ? (
                  /* Empty state */
                  <div className="py-10 text-center space-y-2 border border-dashed border-border rounded-xl">
                    <AlertCircle className="size-6 text-muted-foreground mx-auto" />
                    <p className="text-xs font-bold">No leave requests found.</p>
                    <p className="text-[0.68rem] text-muted-foreground max-w-xs mx-auto">
                      There are no registered leave applications that match your search filters.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/60">
                    {/* Desktop table view */}
                    <table className="w-full text-left text-xs hidden md:table">
                      <thead className="bg-muted/40 text-muted-foreground font-mono text-[0.68rem] uppercase border-b border-border/60">
                        <tr>
                          <th className="py-3 px-3.5">Leave ID</th>
                          <th className="py-3 px-3.5">Leave Category</th>
                          <th className="py-3 px-3.5">Applied Date</th>
                          <th className="py-3 px-3.5">Duration</th>
                          <th className="py-3 px-3.5">Days</th>
                          <th className="py-3 px-3.5">Reason</th>
                          <th className="py-3 px-3.5">Approver</th>
                          <th className="py-3 px-3.5">Status</th>
                          <th className="py-3 px-3.5 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredLeaves.map((l) => (
                          <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-3.5 font-mono font-bold text-foreground">{l.id}</td>
                            <td className="py-3 px-3.5 font-semibold text-foreground">{l.leaveType} Leave</td>
                            <td className="py-3 px-3.5 text-muted-foreground font-mono">{l.appliedOn}</td>
                            <td className="py-3 px-3.5 text-muted-foreground font-mono">
                              {l.startDate} to {l.endDate}
                            </td>
                            <td className="py-3 px-3.5 font-bold font-mono text-primary">{l.days}</td>
                            <td className="py-3 px-3.5 text-muted-foreground truncate max-w-[120px]">{l.reason}</td>
                            <td className="py-3 px-3.5 text-foreground">{l.approver}</td>
                            <td className="py-3 px-3.5">
                              <Badge
                                className={cn(
                                  l.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem]" :
                                  l.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.65rem]" :
                                  l.status === "Rejected" ? "bg-red-500/10 text-red-600 border-red-500/20 text-[0.65rem]" :
                                  "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[0.65rem]"
                                )}
                              >
                                {l.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-3.5 text-right pr-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedLeave(l);
                                    setIsViewDialogOpen(true);
                                  }}
                                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="size-3.5" />
                                </Button>
                                {l.status === "Pending" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCancelLeave(l.id)}
                                    className="size-7 rounded-lg text-muted-foreground hover:text-red-500 cursor-pointer"
                                    title="Cancel Leave"
                                  >
                                    <XCircle className="size-3.5" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile Card Roster View */}
                    <div className="block md:hidden divide-y divide-border/60">
                      {filteredLeaves.map((l) => (
                        <div key={l.id} className="p-3.5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-foreground">{l.id}</span>
                            <Badge
                              className={cn(
                                l.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                l.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                l.status === "Rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              )}
                            >
                              {l.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{l.leaveType} Leave &middot; {l.days} Day(s)</p>
                            <p className="text-[0.68rem] text-muted-foreground font-mono">
                              Duration: {l.startDate} to {l.endDate}
                            </p>
                            <p className="text-muted-foreground font-medium">Reason: {l.reason}</p>
                            <p className="text-[0.68rem] text-muted-foreground">Approver: {l.approver}</p>
                          </div>
                          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/30 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedLeave(l);
                                setIsViewDialogOpen(true);
                              }}
                              className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="size-3.5 mr-1" /> View Details
                            </Button>
                            {l.status === "Pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelLeave(l.id)}
                                className="h-7 text-xs text-red-500 hover:text-red-600"
                              >
                                <XCircle className="size-3.5 mr-1" /> Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Leave Analytics Mock Charts Section */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm md:text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" /> Leave Consumption Analytics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                  {/* Monthly Leave trend Bar Chart */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground text-center">Monthly Leaves Count (2026)</p>
                    <div className="h-44 border border-border/40 bg-muted/10 rounded-xl p-3.5 flex items-end justify-between gap-1.5 relative">
                      {/* Gridlines */}
                      <div className="absolute inset-x-0 top-1/4 border-t border-border/20" />
                      <div className="absolute inset-x-0 top-2/4 border-t border-border/20" />
                      <div className="absolute inset-x-0 top-3/4 border-t border-border/20" />

                      {[
                        { label: "Mar", value: 3 },
                        { label: "Apr", value: 5 },
                        { label: "May", value: 2 },
                        { label: "Jun", value: 7 },
                        { label: "Jul", value: 4 },
                        { label: "Aug", value: 6 },
                      ].map((item, idx) => {
                        const heightPct = Math.round((item.value / 8) * 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end z-10">
                            <div className="w-6 bg-brand-gradient text-[0.62rem] font-bold text-white text-center rounded-t-md hover:opacity-90 transition-all cursor-pointer relative group flex justify-center items-start pt-1.5" style={{ height: `${heightPct}%` }}>
                              <span className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-foreground text-background px-1.5 py-0.5 rounded text-[0.6rem] font-mono transition-opacity pointer-events-none">
                                {item.value}d
                              </span>
                            </div>
                            <span className="text-[0.68rem] font-semibold text-muted-foreground">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Leave Distribution Pie Chart */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground text-center">Leave Category Distribution</p>
                    <div className="h-44 border border-border/40 bg-muted/10 rounded-xl p-3.5 flex flex-col items-center justify-center gap-3">
                      <div className="flex items-center gap-4">
                        {/* Custom Circular Donut SVG */}
                        <div className="size-20 relative shrink-0">
                          <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                            {/* Casual 35% */}
                            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="35 100" strokeDashoffset="0" />
                            {/* Sick 30% */}
                            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-35" />
                            {/* Earned 25% */}
                            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-65" />
                            {/* Duty 10% */}
                            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-90" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-bold text-[0.7rem] text-foreground">
                            18d Total
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="text-[0.68rem] space-y-1">
                          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-blue-500 shrink-0" /> Casual Leave: 35%</div>
                          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500 shrink-0" /> Sick Leave: 30%</div>
                          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-violet-500 shrink-0" /> Earned Leave: 25%</div>
                          <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-500 shrink-0" /> Duty Leave: 10%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width on Desktop) */}
            <div className="space-y-6">
              {/* Approval status Timeline workflow panel */}
              {activeApprovalTimelineLeave && (
                <div id="timeline" className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm md:text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-1.5">
                    <Clock className="size-4 text-primary shrink-0" /> Active Request Timeline
                  </h3>

                  <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold font-mono text-primary">{activeApprovalTimelineLeave.id}</span>
                      <Badge variant="outline" className="text-[0.6rem] bg-card uppercase tracking-wide">
                        {activeApprovalTimelineLeave.leaveType} Leave
                      </Badge>
                    </div>
                    <p className="text-[0.68rem] text-muted-foreground truncate">Reason: {activeApprovalTimelineLeave.reason}</p>
                    <p className="text-[0.68rem] text-muted-foreground font-mono">{activeApprovalTimelineLeave.startDate} to {activeApprovalTimelineLeave.endDate} ({activeApprovalTimelineLeave.days} days)</p>
                  </div>

                  <div className="relative pl-5 border-l-2 border-border/60 ml-2.5 space-y-5 py-1 pt-2">
                    {activeApprovalTimelineLeave.approvalSteps.map((step, idx) => {
                      const isCompleted = step.status === "Completed";
                      const isCurrent = step.status === "Current";

                      return (
                        <div key={idx} className="relative">
                          {/* Circle dot marker */}
                          <span className={cn(
                            "absolute -left-[27px] top-1 rounded-full border-2 bg-card size-3.5 z-10 flex items-center justify-center",
                            isCompleted ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" :
                            isCurrent ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20 animate-pulse" :
                            "border-border text-muted-foreground bg-muted"
                          )}>
                            {isCompleted && <span className="size-1.5 rounded-full bg-emerald-500" />}
                            {isCurrent && <span className="size-1.5 rounded-full bg-amber-500" />}
                          </span>

                          <div className="text-xs">
                            <div className="flex items-center justify-between">
                              <p className={cn("font-bold", isCompleted ? "text-foreground" : isCurrent ? "text-amber-600" : "text-muted-foreground")}>
                                {step.name}
                              </p>
                              {step.date && <span className="text-[0.68rem] text-muted-foreground font-mono">{step.date}</span>}
                            </div>
                            {step.approver && <p className="text-[0.68rem] text-muted-foreground mt-0.5">Actor: {step.approver}</p>}
                            {step.remarks && <p className="text-[0.68rem] text-primary/80 mt-1 bg-primary/5 px-2 py-1 rounded border border-primary/10 italic">"{step.remarks}"</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Approval status panel right side details */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm md:text-base text-foreground border-b border-border/60 pb-3">
                  Approval Summary cockpit
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { label: "Approved Leaves (Total)", value: leaves.filter(l => l.status === "Approved").length, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Pending Review Items", value: leaves.filter(l => l.status === "Pending").length, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
                    { label: "Rejected Requests", value: leaves.filter(l => l.status === "Rejected").length, color: "text-red-600 bg-red-500/10 border-red-500/20" },
                    { label: "Cancelled Leaves", value: leaves.filter(l => l.status === "Cancelled").length, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
                  ].map((sum, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/10">
                      <span className="text-muted-foreground font-medium">{sum.label}</span>
                      <span className={cn("px-2 py-0.5 rounded-md font-bold font-mono text-center", sum.color)}>{sum.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holiday & Event Timeline Panel */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm md:text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-primary shrink-0" /> Academic & Holiday Schedule
                </h3>

                <div className="space-y-3.5">
                  {MOCK_HOLIDAYS_AND_EVENTS.map((event, idx) => {
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-muted/10 hover:border-primary/20 transition-colors">
                        <div className="flex flex-col items-center justify-center p-1.5 bg-card border border-border rounded-lg text-center shrink-0 w-12 h-12 font-mono">
                          <span className="text-[0.62rem] font-bold text-primary uppercase">
                            {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                          </span>
                          <span className="text-sm font-extrabold text-foreground mt-0.5">
                            {new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit" })}
                          </span>
                        </div>
                        <div className="text-xs space-y-0.5">
                          <p className="font-bold text-foreground">{event.title}</p>
                          <p className="text-[0.68rem] text-muted-foreground line-clamp-1">{event.details}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[0.6rem] font-mono",
                              event.type === "National" ? "bg-purple-500/5 text-purple-600 border-purple-500/20" :
                              event.type === "Exam" ? "bg-rose-500/5 text-rose-600 border-rose-500/20" :
                              "bg-blue-500/5 text-blue-600 border-blue-500/20"
                            )}
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW DOSSIER DIALOG */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-4 text-primary shrink-0" /> Leave Application {selectedLeave?.id}
            </DialogTitle>
            <DialogDescription>Submitted by {selectedLeave?.applicantName} on {selectedLeave?.appliedOn}</DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4 text-xs pt-2">
              <div className="grid grid-cols-2 gap-3.5 p-3 bg-muted/40 rounded-xl">
                <div>
                  <span className="text-[0.68rem] text-muted-foreground block">Leave Category</span>
                  <span className="font-bold text-foreground">{selectedLeave.leaveType} Leave</span>
                </div>
                <div>
                  <span className="text-[0.68rem] text-muted-foreground block">Duration</span>
                  <span className="font-bold text-foreground font-mono">{selectedLeave.days} Day(s)</span>
                </div>
                <div>
                  <span className="text-[0.68rem] text-muted-foreground block">Start Date</span>
                  <span className="font-bold text-foreground font-mono">{selectedLeave.startDate}</span>
                </div>
                <div>
                  <span className="text-[0.68rem] text-muted-foreground block">End Date</span>
                  <span className="font-bold text-foreground font-mono">{selectedLeave.endDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[0.68rem] text-muted-foreground block">Reason for absence</span>
                <p className="font-medium text-foreground bg-muted/10 p-2.5 rounded-lg border border-border/40">
                  {selectedLeave.reason}
                </p>
              </div>

              {selectedLeave.remarks && (
                <div className="space-y-1">
                  <span className="text-[0.68rem] text-muted-foreground block">Alternate substitution remarks</span>
                  <p className="text-muted-foreground bg-muted/10 p-2.5 rounded-lg border border-border/40">
                    {selectedLeave.remarks}
                  </p>
                </div>
              )}

              {selectedLeave.attachmentName && (
                <div className="space-y-1">
                  <span className="text-[0.68rem] text-muted-foreground block">Uploaded File</span>
                  <div className="flex items-center gap-1.5 p-2 bg-primary/5 rounded-lg border border-primary/10">
                    <FileText className="size-4 text-primary" />
                    <span className="font-mono text-[0.68rem] text-foreground truncate">{selectedLeave.attachmentName}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-muted-foreground font-medium">Emergency Contact: <span className="font-mono font-bold text-foreground">{selectedLeave.emergencyContact}</span></span>
                <Badge
                  className={cn(
                    selectedLeave.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                    selectedLeave.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                    selectedLeave.status === "Rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                    "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  )}
                >
                  {selectedLeave.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="pt-2">
            <Button onClick={() => setIsViewDialogOpen(false)} className="rounded-xl cursor-pointer bg-brand-gradient text-white text-xs font-semibold px-4 py-2">
              Close Window
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
