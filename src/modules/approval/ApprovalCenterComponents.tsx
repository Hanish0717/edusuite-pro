import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Database,
  Download,
  Eye,
  FileClock,
  FileSpreadsheet,
  Filter,
  GitBranch,
  History,
  Inbox,
  LayoutDashboard,
  ListFilter,
  Loader2,
  MessageSquare,
  Paperclip,
  PieChart,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Undo2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ChartLegend, DonutChart, GroupedBarChart, TrendAreaChart } from "@/components/dashboard/charts";
import { Panel } from "@/components/dashboard/panel";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_YEAR_OPTIONS,
  APPROVAL_DEPARTMENTS,
  APPROVAL_PROGRAMS,
  APPROVAL_REQUEST_TYPES,
  createDefaultApprovalFilters,
  cloneApprovalRequests,
  MOCK_APPROVAL_ACTIVITIES,
  MOCK_APPROVAL_NOTIFICATIONS,
  MOCK_APPROVAL_REPORTS,
  MOCK_APPROVAL_REQUESTS,
  REFERENCE_DATE,
  sortRequestsComparator,
} from "./mock-data";
import type {
  ApprovalCenterModuleViewProps,
  ApprovalComment,
  ApprovalFiltersState,
  ApprovalHistoryItem,
  ApprovalNotification,
  ApprovalReportCard,
  ApprovalRequest,
  RequestPriority,
  RequestStatus,
} from "./types";

type ApprovalAction = "approve" | "reject" | "return" | "request-info";
type BulkAction = "approve" | "reject" | "return" | "export";

const STATUS_ORDER: RequestStatus[] = ["Pending", "Under Review", "Approved", "Rejected", "Returned"];
const PRIORITY_ORDER: RequestPriority[] = ["Critical", "High", "Medium", "Low"];
const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" });

function priorityBadgeClass(priority: RequestPriority) {
  switch (priority) {
    case "Critical":
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "High":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Medium":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    default:
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
}

function statusBadgeClass(status: RequestStatus) {
  switch (status) {
    case "Approved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "Rejected":
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "Returned":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Under Review":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    default:
      return "border-muted-foreground/20 bg-muted/40 text-muted-foreground";
  }
}

function toneForNotification(priority: ApprovalNotification["priority"]) {
  switch (priority) {
    case "high":
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "medium":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    default:
      return "border-muted-foreground/20 bg-muted/50 text-muted-foreground";
  }
}

function toneForActivity(tone: ApprovalReportCard["delta"] | "success" | "warning" | "info" | "muted") {
  switch (tone) {
    case "success":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "warning":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "info":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    default:
      return "border-muted-foreground/20 bg-muted/50 text-muted-foreground";
  }
}

function formatDate(dateValue: string) {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }
  return DATE_FORMATTER.format(parsedDate);
}

function toIsoDate(dateValue: string) {
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? dateValue : parsedDate.toISOString().slice(0, 10);
}

function daysBetween(earlier: string, later: Date) {
  const parsedEarlier = new Date(earlier);
  if (Number.isNaN(parsedEarlier.getTime())) {
    return 0;
  }
  return Math.max(0, Math.ceil((later.getTime() - parsedEarlier.getTime()) / (1000 * 60 * 60 * 24)));
}

function cloneComment(message: string, author = "Academic Manager", role = "Academic Manager"): ApprovalComment {
  return {
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    author,
    role,
    message,
    timestamp: "Just now",
  };
}

function cloneHistory(stage: string, status: ApprovalHistoryItem["status"], note: string): ApprovalHistoryItem {
  return {
    id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    stage,
    status,
    timestamp: "Just now",
    actor: "Academic Manager",
    note,
  };
}

function requestMatchesFilters(request: ApprovalRequest, filters: ApprovalFiltersState) {
  const search = filters.search.trim().toLowerCase();
  const requestedBy = filters.requestedBy.trim().toLowerCase();

  const matchesSearch =
    !search ||
    [request.id, request.requestType, request.department, request.program, request.requestedBy, request.description]
      .join(" ")
      .toLowerCase()
      .includes(search);

  const matchesRequester = !requestedBy || request.requestedBy.toLowerCase().includes(requestedBy);
  const matchesRequestType = filters.requestType === "All" || request.requestType === filters.requestType;
  const matchesDepartment = filters.department === "All" || request.department === filters.department;
  const matchesProgram = filters.program === "All" || request.program === filters.program;
  const matchesPriority = filters.priority === "All" || request.priority === filters.priority;
  const matchesStatus = filters.status === "All" || request.status === filters.status;
  const matchesAcademicYear = filters.academicYear === "All" || request.academicYear === filters.academicYear;

  const matchesDate = (() => {
    if (filters.submissionDate === "All") {
      return true;
    }

    const submitted = new Date(request.submittedDate).getTime();
    const reference = REFERENCE_DATE.getTime();
    const day = 24 * 60 * 60 * 1000;

    switch (filters.submissionDate) {
      case "Today":
        return toIsoDate(request.submittedDate) === toIsoDate(REFERENCE_DATE.toISOString());
      case "Last 3 Days":
        return reference - submitted <= 3 * day;
      case "Last 7 Days":
        return reference - submitted <= 7 * day;
      case "This Month":
        return new Date(request.submittedDate).getMonth() === REFERENCE_DATE.getMonth();
      default:
        return true;
    }
  })();

  return (
    matchesSearch &&
    matchesRequester &&
    matchesRequestType &&
    matchesDepartment &&
    matchesProgram &&
    matchesPriority &&
    matchesStatus &&
    matchesDate &&
    matchesAcademicYear
  );
}

function exportRequestSet(requests: ApprovalRequest[], fileName: string) {
  if (requests.length === 0) {
    toast.info("No requests available to export.");
    return;
  }

  const csvRows = [
    ["Request ID", "Request Type", "Department", "Program", "Requested By", "Submitted On", "Priority", "Status"],
    ...requests.map((request) => [
      request.id,
      request.requestType,
      request.department,
      request.program,
      request.requestedBy,
      request.submittedDate,
      request.priority,
      request.status,
    ]),
  ];

  const csvContent = csvRows.map((row) => row.map((value) => `"${String(value).replaceAll("\"", '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function computeAnalyticsData(requests: ApprovalRequest[]) {
  const requestTypeMap = new Map<string, number>();
  const departmentMap = new Map<string, number>();
  const monthlyMap = new Map<string, number>();
  const processingMap = new Map<RequestStatus, { total: number; count: number }>();

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  requests.forEach((request) => {
    requestTypeMap.set(request.requestType, (requestTypeMap.get(request.requestType) ?? 0) + 1);
    departmentMap.set(request.department, (departmentMap.get(request.department) ?? 0) + 1);

    const monthLabel = monthOrder[new Date(request.submittedDate).getMonth()];
    monthlyMap.set(monthLabel, (monthlyMap.get(monthLabel) ?? 0) + 1);

    const processingHours = daysBetween(request.submittedDate, REFERENCE_DATE) * 24;
    const entry = processingMap.get(request.status) ?? { total: 0, count: 0 };
    entry.total += Math.max(1, processingHours);
    entry.count += 1;
    processingMap.set(request.status, entry);
  });

  const requestTypeData = Array.from(requestTypeMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);

  const departmentData = Array.from(departmentMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => monthOrder.indexOf(left.label) - monthOrder.indexOf(right.label));

  const approvalVsRejection = [
    { label: "Approved", value: requests.filter((request) => request.status === "Approved").length },
    { label: "Rejected", value: requests.filter((request) => request.status === "Rejected").length },
    { label: "Returned", value: requests.filter((request) => request.status === "Returned").length },
    { label: "Pending", value: requests.filter((request) => request.status === "Pending" || request.status === "Under Review").length },
  ];

  const priorityDistribution = PRIORITY_ORDER.map((priority) => ({
    label: priority,
    value: requests.filter((request) => request.priority === priority).length,
  }));

  const processingTime = STATUS_ORDER.map((status) => {
    const bucket = processingMap.get(status);
    return { label: status, value: bucket && bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 0 };
  });

  return { requestTypeData, departmentData, monthlyTrend, approvalVsRejection, priorityDistribution, processingTime };
}

function ApprovalHeader({
  selectedCount,
  onApproveSelected,
  onRejectSelected,
  onExport,
  onRefresh,
}: {
  selectedCount: number;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onExport: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-primary/15 bg-primary/5 p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              Academic Management
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">Approval Center</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Approval Center</h1>
            <Badge className="bg-brand-gradient text-white">Institution Scope</Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Review, approve, reject, or return academic requests submitted by departments, faculty, and system modules.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={onApproveSelected} disabled={selectedCount === 0}>
            <CheckCircle2 className="mr-2 size-4" /> Approve Selected
          </Button>
          <Button variant="outline" className="rounded-xl border-rose-500/30 text-rose-600 hover:bg-rose-500/5" onClick={onRejectSelected} disabled={selectedCount === 0}>
            <XCircle className="mr-2 size-4" /> Reject Selected
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={onExport}>
            <Download className="mr-2 size-4" /> Export Requests
          </Button>
          <Button className="rounded-xl bg-brand-gradient text-white shadow-glow" onClick={onRefresh}>
            <RefreshCw className="mr-2 size-4" /> Refresh Requests
          </Button>
        </div>
      </div>
    </div>
  );
}

function ApprovalStats({ requests }: { requests: ApprovalRequest[] }) {
  const stats = [
    {
      title: "Total Pending Requests",
      value: requests.filter((request) => request.status === "Pending" || request.status === "Under Review").length,
      trend: "+12% vs last week",
      icon: GitBranch,
      tone: "warning",
    },
    {
      title: "Approved Today",
      value: requests.filter((request) => request.status === "Approved" && request.resolvedOn === toIsoDate(REFERENCE_DATE.toISOString())).length,
      trend: "+3 since morning",
      icon: CheckCircle2,
      tone: "success",
    },
    {
      title: "Rejected Today",
      value: requests.filter((request) => request.status === "Rejected" && request.resolvedOn === toIsoDate(REFERENCE_DATE.toISOString())).length,
      trend: "-1 vs yesterday",
      icon: XCircle,
      tone: "destructive",
    },
    {
      title: "Returned Requests",
      value: requests.filter((request) => request.status === "Returned").length,
      trend: "Needs revision",
      icon: Undo2,
      tone: "warning",
    },
    {
      title: "High Priority Requests",
      value: requests.filter((request) => request.priority === "High" || request.priority === "Critical").length,
      trend: "Escalation queue",
      icon: AlertTriangle,
      tone: "destructive",
    },
    {
      title: "Overdue Requests",
      value: requests.filter((request) => (request.status === "Pending" || request.status === "Under Review") && request.dueDate && request.dueDate < REFERENCE_DATE.toISOString()).length,
      trend: "SLA breached",
      icon: Clock3,
      tone: "info",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const trendPositive = stat.tone === "success";
        return (
          <Card key={stat.title} className="group overflow-hidden border-border/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className={cn("grid size-8 place-items-center rounded-xl border", stat.tone === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-600", stat.tone === "warning" && "border-amber-500/20 bg-amber-500/10 text-amber-600", stat.tone === "destructive" && "border-rose-500/20 bg-rose-500/10 text-rose-600", stat.tone === "info" && "border-blue-500/20 bg-blue-500/10 text-blue-600") }>
                    <Icon className="size-4" />
                  </span>
                  <span>{stat.title}</span>
                </div>
                <div className="text-3xl font-black tracking-tight text-foreground">{stat.value}</div>
                <div className={cn("flex items-center gap-1.5 text-xs font-semibold", trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground") }>
                  {trendPositive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {stat.trend}
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 bg-muted/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1">
                Hover
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ApprovalFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: ApprovalFiltersState;
  onChange: (next: ApprovalFiltersState) => void;
  onReset: () => void;
}) {
  const update = <K extends keyof ApprovalFiltersState>(key: K, value: ApprovalFiltersState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Panel title="Search & Filters" description="Narrow the centralized queue by request type, department, priority, or approval status.">
      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div className="relative xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(event) => update("search", event.target.value)}
              placeholder="Search by request ID, type, department, or requester"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <div>
            <Input
              value={filters.requestedBy}
              onChange={(event) => update("requestedBy", event.target.value)}
              placeholder="Requested by"
              className="h-11 rounded-xl"
            />
          </div>
          <Select value={filters.academicYear} onValueChange={(value) => update("academicYear", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Academic Years</SelectItem>
              {ACADEMIC_YEAR_OPTIONS.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.sortBy} onValueChange={(value) => update("sortBy", value as ApprovalFiltersState["sortBy"]) }>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {(["Newest", "Oldest", "Priority", "Department", "Status"] as const).map((sortOption) => (
                <SelectItem key={sortOption} value={sortOption}>{sortOption}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select value={filters.requestType} onValueChange={(value) => update("requestType", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Request Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Request Types</SelectItem>
              {APPROVAL_REQUEST_TYPES.map((requestType) => (
                <SelectItem key={requestType} value={requestType}>{requestType}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.department} onValueChange={(value) => update("department", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {APPROVAL_DEPARTMENTS.map((department) => (
                <SelectItem key={department} value={department}>{department}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.program} onValueChange={(value) => update("program", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Programs</SelectItem>
              {APPROVAL_PROGRAMS.map((program) => (
                <SelectItem key={program} value={program}>{program}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => update("priority", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {(["All", "Low", "Medium", "High", "Critical"] as const).map((priority) => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => update("status", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {(["All", "Pending", "Under Review", "Approved", "Rejected", "Returned"] as const).map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.submissionDate} onValueChange={(value) => update("submissionDate", value)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Submission Date" />
            </SelectTrigger>
            <SelectContent>
              {(["All", "Today", "Last 3 Days", "Last 7 Days", "This Month"] as const).map((dateFilter) => (
                <SelectItem key={dateFilter} value={dateFilter}>{dateFilter}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 md:col-span-2 xl:col-span-2 xl:justify-end">
            <Button variant="outline" className="h-11 rounded-xl" onClick={onReset}>
              <Filter className="mr-2 size-4" /> Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function BulkActionToolbar({
  selectedCount,
  visibleCount,
  onApprove,
  onReject,
  onReturn,
  onExport,
}: {
  selectedCount: number;
  visibleCount: number;
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ListFilter className="size-4" />
        <span>{visibleCount} visible requests</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{selectedCount} selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onApprove} disabled={selectedCount === 0}>
          <CheckCircle2 className="mr-2 size-4" /> Approve Selected
        </Button>
        <Button size="sm" variant="outline" className="border-rose-500/30 text-rose-600 hover:bg-rose-500/5" onClick={onReject} disabled={selectedCount === 0}>
          <XCircle className="mr-2 size-4" /> Reject Selected
        </Button>
        <Button size="sm" variant="outline" onClick={onReturn} disabled={selectedCount === 0}>
          <Undo2 className="mr-2 size-4" /> Return Selected
        </Button>
        <Button size="sm" variant="outline" onClick={onExport} disabled={selectedCount === 0}>
          <Download className="mr-2 size-4" /> Export Selected
        </Button>
      </div>
    </div>
  );
}

function PriorityQueue({ requests }: { requests: ApprovalRequest[] }) {
  const queue = [...requests]
    .filter((request) => request.status === "Pending" || request.status === "Under Review")
    .sort((left, right) => {
      const priorityRank: Record<RequestPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return priorityRank[left.priority] - priorityRank[right.priority] || new Date(left.submittedDate).getTime() - new Date(right.submittedDate).getTime();
    })
    .slice(0, 4);

  const criticalCount = requests.filter((request) => request.priority === "Critical" && (request.status === "Pending" || request.status === "Under Review")).length;
  const highCount = requests.filter((request) => request.priority === "High" && (request.status === "Pending" || request.status === "Under Review")).length;
  const oldest = queue[queue.length - 1];
  const countdown = oldest?.dueDate ? `${Math.max(0, Math.ceil((new Date(oldest.dueDate).getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60)))}h` : "--";

  return (
    <Panel title="Priority Queue" description="Critical requests, high priority items, and SLA countdowns are surfaced here.">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-600 dark:text-rose-400">Critical Requests</div>
            <div className="mt-1 text-2xl font-black text-foreground">{criticalCount}</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-400">High Priority</div>
            <div className="mt-1 text-2xl font-black text-foreground">{highCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Pending Since</div>
            <div className="mt-1 font-semibold text-foreground">{oldest ? formatDate(oldest.submittedDate) : "None"}</div>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Countdown Indicator</div>
            <div className="mt-1 font-semibold text-foreground">{countdown}</div>
          </div>
        </div>

        <div className="space-y-2">
          {queue.map((request) => (
            <div key={request.id} className="rounded-xl border border-border/70 bg-card p-3 transition-colors hover:bg-muted/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{request.requestType}</div>
                  <div className="text-xs text-muted-foreground">{request.department}</div>
                </div>
                <Badge variant="outline" className={cn("font-semibold", priorityBadgeClass(request.priority))}>{request.priority}</Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Due {request.dueDate ? formatDate(request.dueDate) : "Soon"}</div>
              <Progress value={request.priority === "Critical" ? 92 : request.priority === "High" ? 78 : 58} className="mt-3 h-2" />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ApprovalTimelinePanel({ request }: { request?: ApprovalRequest }) {
  if (!request) {
    return (
      <Panel title="Approval Timeline" description="Select a request to view its workflow stages.">
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          No request selected.
        </div>
      </Panel>
    );
  }

  const stages = [
    { stage: "Submitted", label: "Submitted" },
    { stage: "Department Review", label: "Department Review" },
    { stage: "Academic Management Review", label: "Academic Management Review" },
    { stage: "Approved", label: request.status === "Approved" ? "Approved" : request.status === "Rejected" ? "Rejected" : request.status === "Returned" ? "Returned" : "Pending" },
    { stage: "Published", label: request.status === "Approved" ? "Published" : "Pending" },
  ];

  return (
    <Panel title="Approval Timeline" description="Workflow progression with timestamps for the selected request.">
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const historyItem = request.history.find((entry) => entry.stage === stage.stage);
          const isActive = Boolean(historyItem) || index === 0;
          return (
            <div key={stage.stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn("grid size-8 place-items-center rounded-full border", isActive ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground")}>{index + 1}</div>
                {index < stages.length - 1 && <div className="h-8 w-px bg-border" />}
              </div>
              <div className="flex-1 rounded-xl border border-border/70 bg-card p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-foreground">{stage.label}</div>
                  {historyItem ? <Badge variant="outline" className={cn("font-semibold", statusBadgeClass(historyItem.status as RequestStatus))}>{historyItem.status}</Badge> : <Badge variant="outline">Pending</Badge>}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{historyItem ? historyItem.timestamp : "Waiting for workflow advancement"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function RequestTimelineSteps({ request }: { request: ApprovalRequest }) {
  const steps = [
    { stage: "Submitted", label: "Submitted" },
    { stage: "Department Review", label: "Department Review" },
    { stage: "Academic Management Review", label: "Academic Management Review" },
    { stage: "Approved", label: request.status === "Approved" ? "Approved" : request.status === "Rejected" ? "Rejected" : request.status === "Returned" ? "Returned" : "Pending" },
    { stage: "Published", label: request.status === "Approved" ? "Published" : "Pending" },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const historyItem = request.history.find((entry) => entry.stage === step.stage);
        const isActive = Boolean(historyItem) || index === 0;
        return (
          <div key={step.stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("grid size-8 place-items-center rounded-full border", isActive ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground")}>{index + 1}</div>
              {index < steps.length - 1 && <div className="h-8 w-px bg-border" />}
            </div>
            <div className="flex-1 rounded-xl border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-foreground">{step.label}</div>
                {historyItem ? <Badge variant="outline" className={cn("font-semibold", statusBadgeClass(historyItem.status as RequestStatus))}>{historyItem.status}</Badge> : <Badge variant="outline">Pending</Badge>}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{historyItem ? historyItem.timestamp : "Waiting for workflow advancement"}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentActivity({ items }: { items: typeof MOCK_APPROVAL_ACTIVITIES }) {
  return (
    <Panel title="Recent Activities" description="Latest approval events and workflow updates.">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-xl border border-border/70 bg-card p-3">
            <div className={cn("mt-0.5 size-2.5 rounded-full", item.tone === "success" && "bg-emerald-500", item.tone === "warning" && "bg-amber-500", item.tone === "info" && "bg-blue-500", item.tone === "muted" && "bg-muted-foreground") } />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-foreground">{item.title}</div>
                <span className="text-[11px] text-muted-foreground">{item.timestamp}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">{item.actor}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function NotificationPanel({ items, onMarkRead }: { items: ApprovalNotification[]; onMarkRead: () => void }) {
  return (
    <Panel title="Notification Panel" description="Actionable alerts and approaching deadlines.">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs text-muted-foreground">
          <span>Unread and priority notifications</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onMarkRead}>
            Mark all read
          </Button>
        </div>
        {items.map((item) => (
          <div key={item.id} className={cn("rounded-xl border p-3 transition-colors hover:bg-muted/20", item.unread ? "border-primary/20 bg-primary/5" : "border-border/70 bg-card") }>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-foreground">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
              </div>
              <Badge variant="outline" className={cn("font-semibold capitalize", toneForNotification(item.priority))}>{item.priority}</Badge>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">{item.timestamp}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ReportsSection({ reports, onPreview, onPdf, onExcel }: {
  reports: ApprovalReportCard[];
  onPreview: (report: ApprovalReportCard) => void;
  onPdf: (report: ApprovalReportCard) => void;
  onExcel: (report: ApprovalReportCard) => void;
}) {
  return (
    <Panel title="Reports" description="Prepared report cards for the academic management approval workflow.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="border-border/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">{report.title}</CardTitle>
                <Badge variant="outline" className="shrink-0">{report.metric}</Badge>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{report.delta}</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => onPreview(report)}>Preview</Button>
                <Button size="sm" variant="outline" onClick={() => onPdf(report)}>Download PDF</Button>
                <Button size="sm" variant="outline" onClick={() => onExcel(report)}>Export Excel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Panel>
  );
}

function AnalyticsDashboard({ requests }: { requests: ApprovalRequest[] }) {
  const analytics = useMemo(() => computeAnalyticsData(requests), [requests]);

  return (
    <Panel title="Analytics Dashboard" description="Approval analytics built from backend-ready mock data.">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Requests by Type</div>
              <div className="text-sm font-semibold text-foreground">Demand distribution</div>
            </div>
            <Badge variant="outline" className="rounded-full">Top 6</Badge>
          </div>
          <GroupedBarChart data={analytics.requestTypeData as any} xKey="label" series={[{ key: "value", label: "Requests" }]} height={220} />
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Department-wise Requests</div>
              <div className="text-sm font-semibold text-foreground">Central review load</div>
            </div>
            <Badge variant="outline" className="rounded-full">Department load</Badge>
          </div>
          <GroupedBarChart data={analytics.departmentData as any} xKey="label" series={[{ key: "value", label: "Requests" }]} height={220} />
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Approval vs Rejection</div>
              <div className="text-sm font-semibold text-foreground">Decision split</div>
            </div>
            <Badge variant="outline" className="rounded-full">Outcomes</Badge>
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <DonutChart data={analytics.approvalVsRejection.map((item) => ({ name: item.label, value: item.value }))} centerLabel={String(analytics.approvalVsRejection.reduce((sum, item) => sum + item.value, 0))} height={220} />
            <ChartLegend items={analytics.approvalVsRejection.map((item) => ({ name: `${item.label}: ${item.value}` }))} />
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Monthly Request Trend</div>
              <div className="text-sm font-semibold text-foreground">Request intake over time</div>
            </div>
            <Badge variant="outline" className="rounded-full">Trend</Badge>
          </div>
          <TrendAreaChart data={analytics.monthlyTrend as any} xKey="label" series={[{ key: "value", label: "Requests" }]} height={220} />
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Average Processing Time</div>
              <div className="text-sm font-semibold text-foreground">Hours by status</div>
            </div>
            <Badge variant="outline" className="rounded-full">SLA</Badge>
          </div>
          <GroupedBarChart data={analytics.processingTime as any} xKey="label" series={[{ key: "value", label: "Avg hours" }]} height={220} />
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Priority Distribution</div>
              <div className="text-sm font-semibold text-foreground">Critical to low balance</div>
            </div>
            <Badge variant="outline" className="rounded-full">Priority</Badge>
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <DonutChart data={analytics.priorityDistribution.map((item) => ({ name: item.label, value: item.value }))} centerLabel="P" height={220} />
            <ChartLegend items={analytics.priorityDistribution.map((item) => ({ name: `${item.label}: ${item.value}` }))} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function RequestDetailsDrawer({
  request,
  open,
  commentDraft,
  onCommentDraftChange,
  onAddComment,
  onClose,
  onAction,
}: {
  request?: ApprovalRequest;
  open: boolean;
  commentDraft: string;
  onCommentDraftChange: (value: string) => void;
  onAddComment: () => void;
  onClose: () => void;
  onAction: (action: ApprovalAction, requestIds: string[]) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <SheetHeader className="space-y-2 pr-8 text-left">
          <SheetTitle>Request Details</SheetTitle>
          <SheetDescription>Detailed approval context, evidence, history, and action controls.</SheetDescription>
        </SheetHeader>

        {!request ? (
          <div className="mt-6 rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">No request selected.</div>
        ) : (
          <div className="mt-6 space-y-6 pb-8">
            <div className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Request Information</div>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{request.requestType}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={cn("font-semibold", priorityBadgeClass(request.priority))}>{request.priority}</Badge>
                  <Badge variant="outline" className={cn("font-semibold", statusBadgeClass(request.status))}>{request.status}</Badge>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoTile label="Request ID" value={request.id} />
                <InfoTile label="Department" value={request.department} />
                <InfoTile label="Submitted By" value={request.requestedBy} />
                <InfoTile label="Submission Date" value={formatDate(request.submittedDate)} />
                <InfoTile label="Program" value={request.program} />
                <InfoTile label="Academic Year" value={request.academicYear} />
              </div>
            </div>

            <TabsSection request={request} commentDraft={commentDraft} onCommentDraftChange={onCommentDraftChange} onAddComment={onAddComment} onAction={onAction} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function TabsSection({
  request,
  commentDraft,
  onCommentDraftChange,
  onAddComment,
  onAction,
}: {
  request: ApprovalRequest;
  commentDraft: string;
  onCommentDraftChange: (value: string) => void;
  onAddComment: () => void;
  onAction: (action: ApprovalAction, requestIds: string[]) => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 rounded-xl bg-muted/20 p-1 text-sm">
        {[
          { key: "overview", label: "Overview" },
          { key: "support", label: "Supporting" },
          { key: "history", label: "History" },
          { key: "comments", label: "Comments" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn("rounded-lg px-3 py-2 text-xs font-semibold transition-colors", activeTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-4">
          <div>
            <div className="text-sm font-semibold text-foreground">Supporting Information</div>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {request.supportingInformation.map((item) => (
                <div key={item} className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">{item}</div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Attachments Placeholder</div>
            <div className="mt-2 space-y-2">
              {request.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between rounded-lg border border-dashed border-border/70 bg-muted/10 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Paperclip className="size-4 text-muted-foreground" />
                    <span>{attachment.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{attachment.type} · {attachment.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="text-sm font-semibold text-foreground">Approval Actions</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button onClick={() => onAction("approve", [request.id])}><Check className="mr-2 size-4" /> Approve</Button>
            <Button variant="outline" onClick={() => onAction("reject", [request.id])}><XCircle className="mr-2 size-4" /> Reject</Button>
            <Button variant="outline" onClick={() => onAction("return", [request.id])}><Undo2 className="mr-2 size-4" /> Return for Changes</Button>
            <Button variant="outline" onClick={() => onAction("request-info", [request.id])}><MessageSquare className="mr-2 size-4" /> Request More Information</Button>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="comment-draft">Add Comments</Label>
            <Textarea id="comment-draft" value={commentDraft} onChange={(event) => onCommentDraftChange(event.target.value)} placeholder="Add internal approval comments or guidance for the next reviewer." className="min-h-28 rounded-xl" />
            <Button variant="outline" onClick={onAddComment} disabled={!commentDraft.trim()}>
              <MessageSquare className="mr-2 size-4" /> Add Comment
            </Button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="text-sm font-semibold text-foreground">Approval History</div>
          <div className="mt-3 space-y-3">
            {request.history.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-xl border border-border/70 bg-muted/20 p-3">
                <div className="mt-1 size-2.5 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-foreground">{item.stage}</div>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.actor}</div>
                  <div className="mt-2 text-sm text-foreground/80">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <RequestTimelineSteps request={request} />
          </div>
        </div>
      )}

      {activeTab === "comments" && (
        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="text-sm font-semibold text-foreground">Comments Timeline</div>
          <div className="mt-3 space-y-3">
            {request.comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-foreground">{comment.author}</div>
                    <div className="text-xs text-muted-foreground">{comment.role}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <div className="mt-2 text-sm text-foreground/80">{comment.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionConfirmationDialog({
  open,
  action,
  requestCount,
  note,
  onNoteChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  action?: ApprovalAction | BulkAction;
  requestCount: number;
  note: string;
  onNoteChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleMap: Record<ApprovalAction | BulkAction, string> = {
    approve: "Approve request",
    reject: "Reject request",
    return: "Return for changes",
    "request-info": "Request more information",
    export: "Export requests",
  };

  const actionKey = action ?? "approve";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleMap[actionKey]}</DialogTitle>
          <DialogDescription>
            {requestCount > 1 ? `${requestCount} requests will be affected.` : "This action will update the selected request."}
          </DialogDescription>
        </DialogHeader>
        {actionKey !== "export" && (
          <div className="space-y-2">
            <Label htmlFor="approval-note">Action note</Label>
            <Textarea id="approval-note" value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Add a short internal note for the audit trail." className="min-h-24 rounded-xl" />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>{actionKey === "export" ? "Export" : "Confirm"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="h-14 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
          <div className="h-96 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
          <div className="h-72 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
        </div>
        <div className="space-y-4">
          <div className="h-60 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
          <div className="h-60 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
          <div className="h-60 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card p-8 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-full border border-primary/20 bg-primary/5 text-primary">
          <Inbox className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">No Pending Approval Requests</h2>
          <p className="text-sm text-muted-foreground">You're all caught up.</p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Approval data unavailable</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button onClick={onRetry} className="rounded-xl">Retry</Button>
      </div>
    </div>
  );
}

export function ApprovalCenterModuleView({ mode = "loaded", errorMessage = "Approval requests could not be loaded.", onRetry }: ApprovalCenterModuleViewProps = {}) {
  const [requests, setRequests] = useState<ApprovalRequest[]>(() => cloneApprovalRequests());
  const [filters, setFilters] = useState<ApprovalFiltersState>(() => createDefaultApprovalFilters());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(requests[0]?.id ?? null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [actionState, setActionState] = useState<{ action?: ApprovalAction | BulkAction; ids: string[]; note: string }>({ ids: [], note: "" });

  const filteredRequests = useMemo(() => {
    const matches = requests.filter((request) => requestMatchesFilters(request, filters));
    const sorted = [...matches].sort(sortRequestsComparator(filters.sortBy));
    return sorted;
  }, [filters, requests]);

  const selectedRequest = useMemo(() => requests.find((request) => request.id === selectedRequestId), [requests, selectedRequestId]);
  const selectedRequests = useMemo(() => requests.filter((request) => selectedIds.includes(request.id)), [requests, selectedIds]);

  const visibleSelectedIds = selectedIds.filter((id) => filteredRequests.some((request) => request.id === id));
  const allVisibleSelected = filteredRequests.length > 0 && visibleSelectedIds.length === filteredRequests.length;
  const someVisibleSelected = visibleSelectedIds.length > 0 && visibleSelectedIds.length < filteredRequests.length;

  const analytics = useMemo(() => computeAnalyticsData(requests), [requests]);

  const handleRefresh = () => {
    setRequests(cloneApprovalRequests());
    setSelectedIds([]);
    toast.success("Approval requests refreshed from the mock store.");
  };

  const handleReset = () => {
    setFilters(createDefaultApprovalFilters());
    setSelectedIds([]);
    toast.info("Filters reset.");
  };

  const openActionDialog = (action: ApprovalAction | BulkAction, requestIds: string[]) => {
    setActionState({ action, ids: requestIds, note: "" });
  };

  const closeActionDialog = () => setActionState({ ids: [], note: "" });

  const applyRequestAction = (action: ApprovalAction | BulkAction, requestIds: string[], note: string) => {
    if (action === "export") {
      const exportSet = requestIds.length > 0 ? requests.filter((request) => requestIds.includes(request.id)) : filteredRequests;
      exportRequestSet(exportSet, `approval-requests-${toIsoDate(REFERENCE_DATE.toISOString())}.csv`);
      return;
    }

    const targetStatus: RequestStatus = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Returned";
    const historyLabel = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : action === "request-info" ? "Information Requested" : "Returned";

    setRequests((previous) => previous.map((request) => {
      if (!requestIds.includes(request.id)) {
        return request;
      }

      const nextComment = note.trim() ? cloneComment(note.trim()) : undefined;
      const nextHistory = cloneHistory("Academic Management Review", targetStatus, note.trim() || `${historyLabel} through centralized approval workflow.`);

      return {
        ...request,
        status: targetStatus,
        comments: nextComment ? [...request.comments, nextComment] : request.comments,
        history: [...request.history, nextHistory],
        resolvedOn: toIsoDate(REFERENCE_DATE.toISOString()),
      };
    }));

    setSelectedIds((previous) => previous.filter((id) => !requestIds.includes(id)));
    toast.success(`${historyLabel} for ${requestIds.length} request${requestIds.length > 1 ? "s" : ""}.`);
  };

  const handleConfirmAction = () => {
    if (!actionState.action) {
      return;
    }

    applyRequestAction(actionState.action, actionState.ids, actionState.note);
    closeActionDialog();
  };

  const handleRowAction = (action: ApprovalAction, requestId: string) => {
    setSelectedRequestId(requestId);
    if (action === "request-info") {
      openActionDialog(action, [requestId]);
      return;
    }
    openActionDialog(action, [requestId]);
  };

  const handleAddComment = () => {
    if (!selectedRequest || !commentDraft.trim()) {
      return;
    }

    const comment = cloneComment(commentDraft.trim());
    const historyItem = cloneHistory("Comments", "Under Review", commentDraft.trim());

    setRequests((previous) => previous.map((request) => request.id === selectedRequest.id ? { ...request, comments: [...request.comments, comment], history: [...request.history, historyItem] } : request));
    setCommentDraft("");
    toast.success("Comment added to the approval trail.");
  };

  const handlePreviewReport = (report: ApprovalReportCard) => toast.info(`Preview prepared for ${report.title}.`);
  const handlePdfReport = (report: ApprovalReportCard) => toast.info(`PDF export placeholder for ${report.title}.`);
  const handleExcelReport = (report: ApprovalReportCard) => toast.info(`Excel export placeholder for ${report.title}.`);
  const handleNotificationRead = () => toast.success("Notifications marked as read.");

  const handleToggleAllVisible = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedIds(filteredRequests.map((request) => request.id));
      return;
    }
    setSelectedIds((previous) => previous.filter((id) => !filteredRequests.some((request) => request.id === id)));
  };

  const handleSelectRow = (requestId: string, checked: boolean) => {
    setSelectedIds((previous) => checked ? Array.from(new Set([...previous, requestId])) : previous.filter((id) => id !== requestId));
  };

  const renderMainContent = () => (
    <div className="space-y-6">
      <ApprovalHeader
        selectedCount={visibleSelectedIds.length || selectedIds.length}
        onApproveSelected={() => openActionDialog("approve", visibleSelectedIds.length ? visibleSelectedIds : selectedIds)}
        onRejectSelected={() => openActionDialog("reject", visibleSelectedIds.length ? visibleSelectedIds : selectedIds)}
        onExport={() => openActionDialog("export", filteredRequests.map((request) => request.id))}
        onRefresh={handleRefresh}
      />

      <ApprovalStats requests={requests} />

      <ApprovalFilters filters={filters} onChange={setFilters} onReset={handleReset} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6 min-w-0">
          <BulkActionToolbar
            selectedCount={selectedIds.length}
            visibleCount={filteredRequests.length}
            onApprove={() => openActionDialog("approve", selectedIds)}
            onReject={() => openActionDialog("reject", selectedIds)}
            onReturn={() => openActionDialog("return", selectedIds)}
            onExport={() => openActionDialog("export", selectedIds)}
          />

          <Panel title="Approval Table" description="A responsive queue of all academic approval requests.">
            {filteredRequests.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                <div className="md:hidden space-y-3">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Checkbox checked={selectedIds.includes(request.id)} onCheckedChange={(checked) => handleSelectRow(request.id, Boolean(checked))} />
                          <div>
                            <div className="text-sm font-semibold text-foreground">{request.requestType}</div>
                            <div className="text-xs text-muted-foreground">{request.id} · {request.department}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedRequestId(request.id); setIsDrawerOpen(true); }}>
                          View
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className={priorityBadgeClass(request.priority)}>{request.priority}</Badge>
                        <Badge variant="outline" className={statusBadgeClass(request.status)}>{request.status}</Badge>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedRequestId(request.id); setIsDrawerOpen(true); }}><Eye className="mr-2 size-4" /> View</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRowAction("approve", request.id)}><Check className="mr-2 size-4" /> Approve</Button>
                        <Button size="sm" variant="outline" className="border-rose-500/30 text-rose-600 hover:bg-rose-500/5" onClick={() => handleRowAction("reject", request.id)}><XCircle className="mr-2 size-4" /> Reject</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRowAction("return", request.id)}><Undo2 className="mr-2 size-4" /> Return</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-2xl border border-border/70 md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false} onCheckedChange={handleToggleAllVisible} />
                        </TableHead>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Request Type</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Current Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id} data-state={selectedIds.includes(request.id) ? "selected" : undefined}>
                          <TableCell>
                            <Checkbox checked={selectedIds.includes(request.id)} onCheckedChange={(checked) => handleSelectRow(request.id, Boolean(checked))} />
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{request.id}</TableCell>
                          <TableCell className="font-medium text-foreground">{request.requestType}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{request.requestedBy}</TableCell>
                          <TableCell>{formatDate(request.submittedDate)}</TableCell>
                          <TableCell><Badge variant="outline" className={cn("font-semibold", priorityBadgeClass(request.priority))}>{request.priority}</Badge></TableCell>
                          <TableCell><Badge variant="outline" className={cn("font-semibold", statusBadgeClass(request.status))}>{request.status}</Badge></TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => { setSelectedRequestId(request.id); setIsDrawerOpen(true); }}><Eye className="mr-1.5 size-4" /> View</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRowAction("approve", request.id)}><Check className="mr-1.5 size-4" /> Approve</Button>
                              <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-500/5 hover:text-rose-700" onClick={() => handleRowAction("reject", request.id)}><XCircle className="mr-1.5 size-4" /> Reject</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRowAction("return", request.id)}><Undo2 className="mr-1.5 size-4" /> Return</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </Panel>

          <AnalyticsDashboard requests={requests} />

          <ReportsSection reports={MOCK_APPROVAL_REPORTS} onPreview={handlePreviewReport} onPdf={handlePdfReport} onExcel={handleExcelReport} />
        </div>

        <div className="space-y-6">
          <PriorityQueue requests={requests} />
          <ApprovalTimelinePanel request={selectedRequest} />
          <RecentActivity items={MOCK_APPROVAL_ACTIVITIES} />
          <NotificationPanel items={MOCK_APPROVAL_NOTIFICATIONS} onMarkRead={handleNotificationRead} />
        </div>
      </div>

      <RequestDetailsDrawer
        request={selectedRequest}
        open={isDrawerOpen && Boolean(selectedRequest)}
        commentDraft={commentDraft}
        onCommentDraftChange={setCommentDraft}
        onAddComment={handleAddComment}
        onClose={() => setIsDrawerOpen(false)}
        onAction={handleRowAction}
      />

      <ActionConfirmationDialog
        open={Boolean(actionState.action)}
        action={actionState.action}
        requestCount={actionState.ids.length}
        note={actionState.note}
        onNoteChange={(value) => setActionState((previous) => ({ ...previous, note: value }))}
        onCancel={closeActionDialog}
        onConfirm={handleConfirmAction}
      />
    </div>
  );

  if (mode === "loading") {
    return <LoadingSkeleton />;
  }

  if (mode === "error") {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (mode === "empty") {
    return <EmptyState />;
  }

  return renderMainContent();
}
