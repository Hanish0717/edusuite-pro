import React, { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  CheckCircle,
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

import {
  fetchLeaveApplications,
  applyForLeave,
  updateLeaveStatus,
  INITIAL_LEAVE_APPLICATIONS,
  type LeaveApplication,
} from "./LeaveService";

const LEAVE_TYPES = ["All Types", "Casual", "Sick", "Earned", "Duty Leave"];
const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"] as const;

export function LeaveModuleView() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>(INITIAL_LEAVE_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [selectedType, setSelectedType] = useState("All Types");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);

  // Form State for Leave Application
  const [formData, setFormData] = useState<Partial<LeaveApplication>>({
    applicantName: "Dr. Ravi Kumar",
    applicantRole: "Associate Professor",
    department: "CSE",
    leaveType: "Casual",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
    substituteFaculty: "Ms. Ananya Verma",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLeaveApplications();
    setLeaves(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filtered = leaves.filter((leave) => {
    const matchesSearch =
      leave.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      leave.applicantRole.toLowerCase().includes(search.toLowerCase()) ||
      leave.department.toLowerCase().includes(search.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      leave.reason.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === "All" || leave.status === activeTab;
    const matchesType = selectedType === "All Types" || leave.leaveType === selectedType;

    return matchesSearch && matchesTab && matchesType;
  });

  // KPI Metrics
  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;

  // Handlers
  const handleOpenApply = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      applicantName: "Dr. Ravi Kumar",
      applicantRole: "Associate Professor",
      department: "CSE",
      leaveType: "Casual",
      startDate: today,
      endDate: today,
      reason: "",
      substituteFaculty: "Ms. Ananya Verma",
    });
    setIsApplyDialogOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason || formData.reason.trim().length < 5) {
      toast.error("Please provide a valid reason for leave application.");
      return;
    }

    const created = await applyForLeave(formData);
    setLeaves((prev) => [created, ...prev]);
    setIsApplyDialogOpen(false);
    toast.success(`Leave request ${created.id} submitted successfully for ${created.days} day(s)!`);
  };

  const handleApprove = async (leave: LeaveApplication) => {
    await updateLeaveStatus(leave.id, "Approved");
    setLeaves((prev) =>
      prev.map((l) => (l.id === leave.id ? { ...l, status: "Approved" } : l)),
    );
    toast.success(`Leave application ${leave.id} for ${leave.applicantName} approved!`);
  };

  const handleReject = async (leave: LeaveApplication) => {
    await updateLeaveStatus(leave.id, "Rejected");
    setLeaves((prev) =>
      prev.map((l) => (l.id === leave.id ? { ...l, status: "Rejected" } : l)),
    );
    toast.error(`Leave application ${leave.id} for ${leave.applicantName} rejected.`);
  };

  const handleOpenView = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setIsViewDialogOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Applicant Name",
      "Role",
      "Department",
      "Leave Type",
      "Start Date",
      "End Date",
      "Days",
      "Reason",
      "Substitute Faculty",
      "Status",
      "Applied On",
    ];
    const rows = filtered.map((l) => [
      l.id,
      `"${l.applicantName}"`,
      `"${l.applicantRole}"`,
      l.department,
      l.leaveType,
      l.startDate,
      l.endDate,
      l.days,
      `"${l.reason}"`,
      `"${l.substituteFaculty || "N/A"}"`,
      l.status,
      l.appliedOn,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Leave_Applications_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} leave records to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Calendar className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Leave Management Module
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                HRMS Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Submit leave applications, track balances, and manage HOD/Principal approvals.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-2 text-xs font-medium border-border hover:bg-accent"
          >
            <Download className="size-3.5" /> Export CSV
          </Button>

          <Button
            size="sm"
            onClick={handleOpenApply}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Plus className="size-4" /> Apply for Leave
          </Button>
        </div>
      </div>

      {/* Quota & KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Casual Leave (CL)</span>
            <CalendarDays className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">08 / 12 Days</p>
          <p className="text-[0.68rem] text-muted-foreground">4 days remaining</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Sick Leave (SL)</span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">09 / 10 Days</p>
          <p className="text-[0.68rem] text-muted-foreground">1 day remaining</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Earned Leave (EL)</span>
            <FileText className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">14 / 15 Days</p>
          <p className="text-[0.68rem] text-muted-foreground">1 day remaining</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Pending Approvals</span>
            <AlertCircle className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{pendingCount} Requests</p>
          <p className="text-[0.68rem] text-amber-600 font-medium">Action required by HOD</p>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {tab === "Pending" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[0.62rem] rounded-full bg-amber-500/20 text-amber-600 font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-1 sm:flex-none items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search applicant, dept, reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Leave Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9 w-[140px] text-xs" aria-label="Leave Type Filter">
                <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Leave Type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="text-xs">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Leave Ledger Table List */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Leave Requests Ledger
            <Badge variant="secondary" className="font-mono text-xs">
              {filtered.length} Records
            </Badge>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="size-5 animate-spin text-primary" />
            Loading leave roster...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <Calendar className="size-7 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-medium">No leave applications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((leave) => (
              <div
                key={leave.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-muted/20 px-2 rounded-xl transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">{leave.applicantName}</span>
                    <Badge variant="outline" className="text-[0.68rem] font-mono">
                      {leave.department}
                    </Badge>
                    <Badge variant="secondary" className="text-[0.68rem]">
                      {leave.applicantRole}
                    </Badge>
                    <span className="text-[0.68rem] text-muted-foreground font-mono">
                      ID: {leave.id}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{leave.leaveType} Leave</span> (
                    <span className="font-bold font-mono text-foreground">{leave.days} day(s)</span>):{" "}
                    <span className="font-mono text-foreground">{leave.startDate}</span> to{" "}
                    <span className="font-mono text-foreground">{leave.endDate}</span>
                  </p>

                  <p className="text-xs text-muted-foreground italic">"{leave.reason}"</p>

                  {leave.substituteFaculty && (
                    <p className="text-[0.68rem] text-muted-foreground flex items-center gap-1.5">
                      <UserCheck className="size-3 text-emerald-500" />
                      Substitute Arrangement:{" "}
                      <span className="font-semibold text-foreground">{leave.substituteFaculty}</span>
                    </p>
                  )}
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                  <Badge
                    className={
                      leave.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-2.5 py-1"
                        : leave.status === "Rejected"
                        ? "bg-red-500/10 text-red-600 border-red-500/20 text-xs px-2.5 py-1"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-2.5 py-1"
                    }
                  >
                    {leave.status === "Approved" && <CheckCircle className="size-3.5 mr-1 inline" />}
                    {leave.status === "Rejected" && <XCircle className="size-3.5 mr-1 inline" />}
                    {leave.status === "Pending" && <Clock className="size-3.5 mr-1 inline" />}
                    {leave.status}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenView(leave)}
                    className="h-8 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="size-3.5" /> Details
                  </Button>

                  {leave.status === "Pending" && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(leave)}
                        className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      >
                        <CheckCircle className="size-3.5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(leave)}
                        className="h-8 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 gap-1"
                      >
                        <XCircle className="size-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIALOG 1: APPLY FOR LEAVE MODAL */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Apply for Leave
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your official leave request for HOD and Principal review.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Applicant Name *</Label>
                <Input
                  required
                  value={formData.applicantName || ""}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Input
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Leave Type</Label>
                <Select
                  value={formData.leaveType}
                  onValueChange={(val: any) => setFormData({ ...formData, leaveType: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual" className="text-xs">
                      Casual Leave (CL)
                    </SelectItem>
                    <SelectItem value="Sick" className="text-xs">
                      Sick Leave (SL)
                    </SelectItem>
                    <SelectItem value="Earned" className="text-xs">
                      Earned Leave (EL)
                    </SelectItem>
                    <SelectItem value="Duty Leave" className="text-xs">
                      Duty Leave (DL)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Substitute Faculty</Label>
                <Input
                  placeholder="e.g. Ms. Ananya Verma"
                  value={formData.substituteFaculty || ""}
                  onChange={(e) => setFormData({ ...formData, substituteFaculty: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date *</Label>
                <Input
                  type="date"
                  required
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date *</Label>
                <Input
                  type="date"
                  required
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reason for Leave *</Label>
              <Textarea
                required
                placeholder="State the detailed purpose of your leave request..."
                value={formData.reason || ""}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="text-xs min-h-[80px]"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Submit Leave Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: VIEW LEAVE DOSSIER MODAL */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" /> Leave Application Details
            </DialogTitle>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedLeave.id}
                  </Badge>
                  <Badge
                    className={
                      selectedLeave.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedLeave.status === "Rejected"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {selectedLeave.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedLeave.applicantName}</h2>
                <p className="text-xs text-primary font-medium">
                  {selectedLeave.applicantRole} &middot; {selectedLeave.department}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Leave Type:</span>
                  <span className="font-bold text-foreground">{selectedLeave.leaveType} Leave</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedLeave.days} Day(s) ({selectedLeave.startDate} to {selectedLeave.endDate})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Substitute Faculty:</span>
                  <span className="font-semibold text-foreground">
                    {selectedLeave.substituteFaculty || "Not Specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Applied On:</span>
                  <span className="font-mono text-foreground">{selectedLeave.appliedOn}</span>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <span className="text-muted-foreground font-semibold">Reason Statement:</span>
                  <p className="text-xs text-foreground italic">"{selectedLeave.reason}"</p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full text-xs"
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
