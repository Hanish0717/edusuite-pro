import React, { useEffect, useState } from "react";
import {
  UserCog,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  FileCheck,
  Calendar,
  Sparkles,
  Award,
  TrendingUp,
  Mail,
  Phone,
  CalendarCheck,
  Check,
  X,
  Clock,
  AlertCircle,
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
  fetchHREmployees,
  fetchJobRequisitions,
  fetchFacultyLeaves,
  onboardEmployee,
  postJobRequisition,
  approveFacultyLeave,
  rejectFacultyLeave,
  applyFacultyLeave,
  INITIAL_EMPLOYEES,
  INITIAL_REQUISITIONS,
  INITIAL_FACULTY_LEAVES,
  type HREmployee,
  type JobRequisition,
  type FacultyLeaveApplication,
} from "./HRService";

export function HRModuleView() {
  const [employees, setEmployees] = useState<HREmployee[]>(INITIAL_EMPLOYEES);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(INITIAL_REQUISITIONS);
  const [leaves, setLeaves] = useState<FacultyLeaveApplication[]>(INITIAL_FACULTY_LEAVES);

  const [activeTab, setActiveTab] = useState<"directory" | "leaves" | "requisitions">("directory");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isPostReqOpen, setIsPostReqOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  // Forms
  const [empForm, setEmpForm] = useState<Partial<HREmployee>>({
    name: "Dr. Sankar Narayan",
    designation: "Assistant Professor",
    department: "CSE",
    employmentType: "Full-Time Permanent",
    email: "sankar.n@edusuite.edu.in",
    phone: "+91 98765 43210",
  });

  const [reqForm, setReqForm] = useState<Partial<JobRequisition>>({
    positionTitle: "Assistant Professor in Cloud Computing & DevOps",
    department: "CSE",
    targetHires: 2,
  });

  const [leaveForm, setLeaveForm] = useState<Partial<FacultyLeaveApplication>>({
    facultyName: "Dr. Rajesh K. Varma",
    department: "CSE",
    leaveType: "Casual Leave",
    startDate: "2026-08-10",
    endDate: "2026-08-11",
    totalDays: 2,
    reason: "Attending National AI Symposium",
    substituteFaculty: "Ms. Ananya Sharma",
  });

  const loadData = async () => {
    setLoading(true);
    const [emp, req, lev] = await Promise.all([
      fetchHREmployees(),
      fetchJobRequisitions(),
      fetchFacultyLeaves(),
    ]);
    setEmployees(emp);
    setRequisitions(req);
    setLeaves(lev);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEmp = employees.filter((e) => {
    return (
      e.empId.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredLeaves = leaves.filter((l) => {
    return (
      l.facultyName.toLowerCase().includes(search.toLowerCase()) ||
      l.department.toLowerCase().includes(search.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleApproveLeave = async (id: string, name: string) => {
    await approveFacultyLeave(id);
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Approved" } : l)));
    toast.success(`Leave application for ${name} approved!`);
  };

  const handleRejectLeave = async (id: string, name: string) => {
    await rejectFacultyLeave(id);
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Rejected" } : l)));
    toast.error(`Leave application for ${name} rejected.`);
  };

  const handleApplyLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await applyFacultyLeave(leaveForm);
    setLeaves((prev) => [created, ...prev]);
    setIsApplyLeaveOpen(false);
    toast.success(`Leave request submitted for HR verification!`);
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.email) return toast.error("Enter employee name and official email");
    const created = await onboardEmployee(empForm);
    setEmployees((prev) => [created, ...prev]);
    setIsOnboardOpen(false);
    toast.success(`Employee ${created.name} (${created.empId}) onboarded successfully!`);
  };

  const handlePostReqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.positionTitle) return toast.error("Enter position title");
    const created = await postJobRequisition(reqForm);
    setRequisitions((prev) => [created, ...prev]);
    setIsPostReqOpen(false);
    toast.success(`Job Requisition ${created.reqId} published!`);
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = "";

    if (activeTab === "directory") {
      filename = `HR_Staff_Roster_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Employee ID", "Full Name", "Designation", "Department", "Type", "Joining Date", "Email", "Phone", "Status"];
      rows = filteredEmp.map((e) => [e.empId, `"${e.name}"`, `"${e.designation}"`, e.department, `"${e.employmentType}"`, e.joiningDate, e.email, e.phone, e.status]);
    } else if (activeTab === "leaves") {
      filename = `Faculty_Leave_Management_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Leave ID", "Faculty Name", "Department", "Leave Type", "Start Date", "End Date", "Days", "Substitute", "HR Approval Status"];
      rows = filteredLeaves.map((l) => [l.leaveId, `"${l.facultyName}"`, l.department, `"${l.leaveType}"`, l.startDate, l.endDate, l.totalDays, `"${l.substituteFaculty}"`, l.status]);
    } else {
      filename = `HR_Job_Requisitions_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Req ID", "Position Title", "Department", "Target Hires", "Applicants", "Hiring Manager", "Status"];
      rows = requisitions.map((r) => [r.reqId, `"${r.positionTitle}"`, r.department, r.targetHires, r.applicantCount, `"${r.hiringManager}"`, r.status]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} ${activeTab} records to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <UserCog className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Human Resources & Staff Governance
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                HR & Faculty Leave Governance
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Faculty & Staff Leave Approvals, Employee Onboarding, Designation Roster, and Recruitment Requisitions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Data
          </Button>
          {activeTab === "leaves" && (
            <Button size="sm" onClick={() => setIsApplyLeaveOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
              <CalendarCheck className="size-4" /> Log Faculty Leave
            </Button>
          )}
          {activeTab === "directory" && (
            <Button size="sm" onClick={() => setIsOnboardOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
              <Plus className="size-4" /> Onboard Employee
            </Button>
          )}
          {activeTab === "requisitions" && (
            <Button size="sm" onClick={() => setIsPostReqOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
              <Briefcase className="size-4" /> Post Requisition
            </Button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Staff Strength</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">420 Staff</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Academic & Non-Academic</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Pending Leave Requests</span>
            <CalendarCheck className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">
            {leaves.filter((l) => l.status === "Pending HR Approval").length} Pending
          </p>
          <p className="text-[0.68rem] text-muted-foreground">HR Approval Threshold</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Open Requisitions</span>
            <Briefcase className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">18 Positions</p>
          <p className="text-[0.68rem] text-muted-foreground">Active recruitment drives</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Staff Retention</span>
            <TrendingUp className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">96.8% Index</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Institutional Loyalty Score</p>
        </div>
      </div>

      {/* THREE SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("directory")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "directory" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Staff Directory & Roster ({employees.length})
        </button>
        <button onClick={() => setActiveTab("leaves")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "leaves" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Faculty & Staff Leave Governance ({leaves.length})
        </button>
        <button onClick={() => setActiveTab("requisitions")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "requisitions" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Recruitment Requisitions ({requisitions.length})
        </button>
      </div>

      {/* TAB 1: DIRECTORY */}
      {activeTab === "directory" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Emp ID</th>
                  <th className="py-3 px-3">Staff Name</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Employment Type</th>
                  <th className="py-3 px-3">Joining Date</th>
                  <th className="py-3 px-3">Contact Email</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEmp.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{e.empId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{e.name}</td>
                    <td className="py-3 px-3 font-semibold text-primary">{e.designation}</td>
                    <td className="py-3 px-3 font-semibold">{e.department}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{e.employmentType}</Badge></td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{e.joiningDate}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{e.email}</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{e.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY LEAVE MANAGEMENT (HR GOVERNANCE) */}
      {activeTab === "leaves" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <CalendarCheck className="size-4 text-primary" /> Faculty & Staff Leave Approval Register
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">HR manages leave approvals, substitute assignments, and service record updates for all faculty.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Leave ID</th>
                  <th className="py-3 px-3">Faculty Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Leave Category</th>
                  <th className="py-3 px-3">Duration (Dates)</th>
                  <th className="py-3 px-3">Reason / Details</th>
                  <th className="py-3 px-3">Substitute Assigned</th>
                  <th className="py-3 px-3">HR Status</th>
                  <th className="py-3 px-3 text-right">HR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{l.leaveId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{l.facultyName}</td>
                    <td className="py-3 px-3 font-semibold">{l.department}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{l.leaveType}</Badge></td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{l.startDate} to {l.endDate} ({l.totalDays} Days)</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-[180px] truncate">{l.reason}</td>
                    <td className="py-3 px-3 font-medium text-primary">{l.substituteFaculty}</td>
                    <td className="py-3 px-3">
                      {l.status === "Pending HR Approval" && <Badge className="bg-amber-500/10 text-amber-600">Pending HR Approval</Badge>}
                      {l.status === "Approved" && <Badge className="bg-emerald-500/10 text-emerald-600">✅ Approved</Badge>}
                      {l.status === "Rejected" && <Badge className="bg-rose-500/10 text-rose-600">❌ Rejected</Badge>}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {l.status === "Pending HR Approval" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button size="sm" onClick={() => handleApproveLeave(l.id, l.facultyName)} className="h-7 text-[0.7rem] bg-emerald-600 text-white font-bold px-2 rounded-lg">
                            <Check className="size-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectLeave(l.id, l.facultyName)} className="h-7 text-[0.7rem] text-rose-600 border-rose-200 px-2 rounded-lg hover:bg-rose-50">
                            <X className="size-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REQUISITIONS */}
      {activeTab === "requisitions" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Position Title</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Target Vacancies</th>
                  <th className="py-3 px-3">Applicants</th>
                  <th className="py-3 px-3">Hiring Manager</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {requisitions.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{r.reqId}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{r.positionTitle}</td>
                    <td className="py-3 px-3 font-semibold text-primary">{r.department}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{r.targetHires} Positions</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{r.applicantCount} Candidates</td>
                    <td className="py-3 px-3 text-muted-foreground">{r.hiringManager}</td>
                    <td className="py-3 px-3"><Badge className="bg-blue-500/10 text-blue-600">{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOG 1: LOG LEAVE FOR FACULTY */}
      <Dialog open={isApplyLeaveOpen} onOpenChange={setIsApplyLeaveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Log Faculty / Staff Leave Application</DialogTitle></DialogHeader>
          <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Faculty Name *</Label><Input required placeholder="Dr. Rajesh K. Varma" value={leaveForm.facultyName || ""} onChange={(e) => setLeaveForm({ ...leaveForm, facultyName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Reason *</Label><Textarea required placeholder="Medical treatment / conference" value={leaveForm.reason || ""} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} className="text-xs min-h-[60px]" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsApplyLeaveOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Submit Leave Request</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ONBOARD EMPLOYEE */}
      <Dialog open={isOnboardOpen} onOpenChange={setIsOnboardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Onboard New Academic / Staff Member</DialogTitle></DialogHeader>
          <form onSubmit={handleOnboardSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Full Staff Name *</Label><Input required placeholder="Dr. Sankar Narayan" value={empForm.name || ""} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Official Email *</Label><Input required type="email" placeholder="sankar.n@edusuite.edu.in" value={empForm.email || ""} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsOnboardOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Complete Onboarding</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: POST REQUISITION */}
      <Dialog open={isPostReqOpen} onOpenChange={setIsPostReqOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Post Faculty Job Requisition</DialogTitle></DialogHeader>
          <form onSubmit={handlePostReqSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Position Title *</Label><Input required placeholder="Assistant Professor in Cloud Computing" value={reqForm.positionTitle || ""} onChange={(e) => setReqForm({ ...reqForm, positionTitle: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsPostReqOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Publish Requisition</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
