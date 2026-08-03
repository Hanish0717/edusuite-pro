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
  onboardEmployee,
  postJobRequisition,
  INITIAL_EMPLOYEES,
  INITIAL_REQUISITIONS,
  type HREmployee,
  type JobRequisition,
} from "./HRService";

export function HRModuleView() {
  const [employees, setEmployees] = useState<HREmployee[]>(INITIAL_EMPLOYEES);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(INITIAL_REQUISITIONS);
  const [activeTab, setActiveTab] = useState<"directory" | "requisitions">("directory");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isPostReqOpen, setIsPostReqOpen] = useState(false);

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

  const loadData = async () => {
    setLoading(true);
    const [emp, req] = await Promise.all([fetchHREmployees(), fetchJobRequisitions()]);
    setEmployees(emp);
    setRequisitions(req);
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
    const headers = ["Employee ID", "Full Name", "Designation", "Department", "Type", "Joining Date", "Email", "Phone", "Status"];
    const rows = filteredEmp.map((e) => [e.empId, `"${e.name}"`, `"${e.designation}"`, e.department, `"${e.employmentType}"`, e.joiningDate, e.email, e.phone, e.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Institutional_HR_Roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported HR employee roster to CSV!");
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
                Human Resources & Talent Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                HR & Staff Administration
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Academic & non-academic staff onboarding, designation roster, faculty recruitment requisitions, and service register.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Roster
          </Button>
          <Button size="sm" onClick={() => setIsPostReqOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <Briefcase className="size-4" /> Post Requisition
          </Button>
          <Button size="sm" onClick={() => setIsOnboardOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Onboard Employee
          </Button>
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
            <span>Open Requisitions</span>
            <Briefcase className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">18 Positions</p>
          <p className="text-[0.68rem] text-muted-foreground">Active recruitment drives</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Faculty Appraisal</span>
            <Award className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">94.2% Rating</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Annual Performance Metric</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Staff Retention</span>
            <TrendingUp className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">96.8% Index</p>
          <p className="text-[0.68rem] text-muted-foreground">Institutional Loyalty Score</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("directory")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "directory" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Staff Directory & Roster ({employees.length})
        </button>
        <button onClick={() => setActiveTab("requisitions")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "requisitions" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Faculty Recruitment Requisitions ({requisitions.length})
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

      {/* TAB 2: REQUISITIONS */}
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

      {/* DIALOG 1: ONBOARD EMPLOYEE */}
      <Dialog open={isOnboardOpen} onOpenChange={setIsOnboardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Onboard New Academic / Staff Member</DialogTitle></DialogHeader>
          <form onSubmit={handleOnboardSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Full Staff Name *</Label><Input required placeholder="Dr. Sankar Narayan" value={empForm.name || ""} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Designation *</Label><Input required placeholder="Assistant Professor" value={empForm.designation || ""} onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Official Email *</Label><Input required type="email" placeholder="sankar.n@edusuite.edu.in" value={empForm.email || ""} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsOnboardOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Complete Onboarding</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: POST REQUISITION */}
      <Dialog open={isPostReqOpen} onOpenChange={setIsPostReqOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Post Faculty Job Requisition</DialogTitle></DialogHeader>
          <form onSubmit={handlePostReqSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Position Title *</Label><Input required placeholder="Assistant Professor in Cloud Computing & DevOps" value={reqForm.positionTitle || ""} onChange={(e) => setReqForm({ ...reqForm, positionTitle: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Target Hires</Label><Input type="number" value={reqForm.targetHires ?? 2} onChange={(e) => setReqForm({ ...reqForm, targetHires: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsPostReqOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Publish Requisition</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
