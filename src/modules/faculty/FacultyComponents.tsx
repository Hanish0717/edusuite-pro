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
  GraduationCap,
  Award,
  Clock,
  Building2,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  Sparkles,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  fetchFacultyRecords,
  createFacultyRecord,
  updateFacultyRecord,
  deleteFacultyRecord,
  INITIAL_FACULTY,
  type FacultyRecord,
} from "./FacultyService";

const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "ECE",
  "ME",
  "AI&DS",
  "Biotech",
];

const DESIGNATIONS = [
  "All Designations",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Senior Lecturer",
];

const STATUS_LIST = ["All Status", "Active", "On Leave", "Sabbatical"] as const;

export function FacultyModuleView() {
  const [faculty, setFaculty] = useState<FacultyRecord[]>(INITIAL_FACULTY);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedDesig, setSelectedDesig] = useState("All Designations");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedFac, setSelectedFac] = useState<FacultyRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<FacultyRecord>>({
    empId: "",
    fullName: "",
    email: "",
    phone: "",
    designation: "Assistant Professor",
    department: "CSE",
    specialization: "",
    teachingLoadHours: 16,
    assignedCoursesCount: 3,
    status: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchFacultyRecords();
    setFaculty(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Roster
  const filtered = faculty.filter((f) => {
    const matchesSearch =
      f.fullName.toLowerCase().includes(search.toLowerCase()) ||
      f.empId.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === "All Departments" || f.department === selectedDept;
    const matchesDesig = selectedDesig === "All Designations" || f.designation === selectedDesig;
    const matchesStatus = selectedStatus === "All Status" || f.status === selectedStatus;

    return matchesSearch && matchesDept && matchesDesig && matchesStatus;
  });

  // KPI Metrics
  const totalCount = faculty.length;
  const professorsCount = faculty.filter((f) => f.designation.includes("Professor")).length;
  const avgLoad =
    faculty.length > 0
      ? (faculty.reduce((sum, f) => sum + f.teachingLoadHours, 0) / faculty.length).toFixed(1)
      : "16.0";
  const onLeaveCount = faculty.filter((f) => f.status !== "Active").length;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      empId: "EMP-FAC-084",
      fullName: "Dr. S. K. Gupta",
      email: "skgupta@college.edu",
      phone: "+91 9811223344",
      designation: "Associate Professor",
      department: "CSE",
      specialization: "Cloud Computing & Distributed Systems",
      teachingLoadHours: 16,
      assignedCoursesCount: 3,
      status: "Active",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (f: FacultyRecord) => {
    setSelectedFac(f);
    setFormData({ ...f });
    setIsEditOpen(true);
  };

  const handleOpenView = (f: FacultyRecord) => {
    setSelectedFac(f);
    setIsViewOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empId || !formData.fullName) {
      toast.error("Please enter employee ID and full name.");
      return;
    }

    const created = await createFacultyRecord(formData);
    setFaculty((prev) => [created, ...prev]);
    setIsAddOpen(false);
    toast.success(`Faculty member ${created.fullName} (${created.empId}) registered successfully!`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFac) return;

    await updateFacultyRecord(selectedFac.id, formData);
    setFaculty((prev) =>
      prev.map((f) => (f.id === selectedFac.id ? ({ ...f, ...formData } as FacultyRecord) : f)),
    );
    setIsEditOpen(false);
    toast.success(`Faculty record for ${formData.fullName} updated!`);
  };

  const handleDelete = async (id: string, empId: string, name: string) => {
    if (confirm(`Are you sure you want to delete faculty record for ${name} (${empId})?`)) {
      await deleteFacultyRecord(id);
      setFaculty((prev) => prev.filter((f) => f.id !== id));
      toast.success(`Faculty record ${empId} deleted.`);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Faculty ID",
      "Employee ID",
      "Full Name",
      "Email Address",
      "Phone",
      "Designation",
      "Department",
      "Specialization",
      "Teaching Load (Hrs/Wk)",
      "Assigned Courses",
      "Status",
      "Joining Date",
    ];

    const rows = filtered.map((f) => [
      f.id,
      f.empId,
      `"${f.fullName}"`,
      f.email,
      `"${f.phone}"`,
      `"${f.designation}"`,
      f.department,
      `"${f.specialization}"`,
      f.teachingLoadHours,
      f.assignedCoursesCount,
      f.status,
      f.joiningDate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Faculty_Directory_Roster_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} faculty records to CSV!`);
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
                Faculty & Staff Workload Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Super Admin Academic HR
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Faculty directory, academic designations, teaching workload allocation, and sabbatical tracking.
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
            <Download className="size-3.5" /> Export Roster
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Plus className="size-4" /> Add New Faculty
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Faculty Strength</span>
            <UserCog className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{totalCount} Faculty</p>
          <p className="text-[0.68rem] text-muted-foreground">Professors & Lecturers</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Senior Professors</span>
            <Award className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{professorsCount} Senior Cadre</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Professors & HODs</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Avg Workload</span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{avgLoad} Hrs / Wk</p>
          <p className="text-[0.68rem] text-muted-foreground">Teaching & Lab Credits</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>On Leave / Sabbatical</span>
            <Calendar className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{onLeaveCount} On Leave</p>
          <p className="text-[0.68rem] text-muted-foreground">Substitute arrangement active</p>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search employee ID, name, email, department, specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Department Filter */}
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
              <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Designation Filter */}
          <Select value={selectedDesig} onValueChange={setSelectedDesig}>
            <SelectTrigger className="h-9 w-full sm:w-[160px] text-xs">
              <Briefcase className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              {DESIGNATIONS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((st) => (
                <SelectItem key={st} value={st} className="text-xs">
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Faculty Directory Table */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <UserCog className="size-4 text-primary" /> Faculty Directory & Workload Ledger
            <Badge variant="secondary" className="font-mono text-xs">
              {filtered.length} Members
            </Badge>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="size-5 animate-spin text-primary" />
            Loading faculty records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <UserCog className="size-7 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-medium">No faculty records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Emp ID</th>
                  <th className="py-3 px-3">Faculty Name</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Specialization</th>
                  <th className="py-3 px-3">Workload (Hrs/Wk)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{f.empId}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{f.fullName}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono">{f.email}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">{f.designation}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{f.department}</td>
                    <td className="py-3 px-3 max-w-xs text-muted-foreground truncate" title={f.specialization}>
                      {f.specialization}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary text-sm">
                      {f.teachingLoadHours} Hrs ({f.assignedCoursesCount} Courses)
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          f.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                        }
                      >
                        {f.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenView(f)}
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                          title="View Dossier"
                        >
                          <Eye className="size-3.5" /> Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(f)}
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Edit Record"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(f.id, f.empId, f.fullName)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Delete Faculty"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DIALOG 1: ADD NEW FACULTY MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Register New Faculty Member
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter employee ID, academic designation, department, specialization, and teaching load.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employee ID *</Label>
                <Input
                  required
                  placeholder="e.g. EMP-FAC-084"
                  value={formData.empId || ""}
                  onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Dr. S. K. Gupta"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  type="email"
                  placeholder="e.g. skgupta@college.edu"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone Number</Label>
                <Input
                  placeholder="e.g. +91 9811223344"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(val: any) => setFormData({ ...formData, designation: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATIONS.filter((d) => d !== "All Designations").map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => setFormData({ ...formData, department: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Teaching Load (Hrs/Wk)</Label>
                <Input
                  type="number"
                  min="4"
                  max="30"
                  value={formData.teachingLoadHours ?? 16}
                  onChange={(e) =>
                    setFormData({ ...formData, teachingLoadHours: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assigned Courses</Label>
                <Input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.assignedCoursesCount ?? 3}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedCoursesCount: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Specialization / Research Domain</Label>
              <Input
                placeholder="e.g. Cloud Computing & Microservices Architecture"
                value={formData.specialization || ""}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Register Faculty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT FACULTY MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-5 text-primary" /> Edit Faculty Record ({selectedFac?.empId})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name</Label>
                <Input
                  required
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(val: any) => setFormData({ ...formData, designation: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGNATIONS.filter((d) => d !== "All Designations").map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Teaching Load (Hrs/Wk)</Label>
                <Input
                  type="number"
                  value={formData.teachingLoadHours ?? 16}
                  onChange={(e) =>
                    setFormData({ ...formData, teachingLoadHours: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active" className="text-xs">
                      Active
                    </SelectItem>
                    <SelectItem value="On Leave" className="text-xs">
                      On Leave
                    </SelectItem>
                    <SelectItem value="Sabbatical" className="text-xs">
                      Sabbatical
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: VIEW FACULTY DOSSIER MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserCog className="size-5 text-primary" /> Faculty Dossier & Profile
            </DialogTitle>
          </DialogHeader>

          {selectedFac && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedFac.empId}
                  </Badge>
                  <Badge
                    className={
                      selectedFac.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {selectedFac.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedFac.fullName}</h2>
                <p className="text-xs text-primary font-mono">{selectedFac.email} &middot; {selectedFac.phone}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Cadre & Designation:</span>
                  <span className="font-semibold text-foreground">{selectedFac.designation}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Teaching Workload:</span>
                  <span className="font-bold text-base text-primary">
                    {selectedFac.teachingLoadHours} Hrs/Wk ({selectedFac.assignedCoursesCount} Courses)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                  <span className="text-muted-foreground font-semibold">Specialization & Research:</span>
                  <p className="text-xs text-foreground font-medium">{selectedFac.specialization}</p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOpen(false)}
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
