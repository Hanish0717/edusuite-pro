import React, { useEffect, useState, useMemo } from "react";
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
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getFaculty,
  createFacultyRecord,
  updateFacultyRecord,
  deleteFacultyRecord,
  fetchFacultyStats,
  type FacultyRecord,
  type FacultyStats,
} from "./FacultyService";
import { useAcademic } from "@/context/academic-context";

const DESIGNATIONS = [
  "All Designations",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Visiting Faculty",
];

const QUALIFICATIONS = [
  "All Qualifications",
  "Ph.D.",
  "M.Tech",
  "MBA",
];

const EXPERIENCES = [
  "All Experience",
  "3+ Years",
  "5+ Years",
  "10+ Years",
  "15+ Years",
];

const STATUS_LIST = ["All Status", "Active", "On Leave", "Sabbatical"] as const;

export function FacultyModuleView({ initialTab = "faculty" }: { initialTab?: string } = {}) {
  const { selectedDepartment } = useAcademic();

  const [faculty, setFaculty] = useState<FacultyRecord[]>([]);
  const [stats, setStats] = useState<FacultyStats | null>(null);
  
  // Search and Filter States
  const [search, setSearch] = useState("");
  const [selectedDesig, setSelectedDesig] = useState("All Designations");
  const [selectedQual, setSelectedQual] = useState("All Qualifications");
  const [selectedExp, setSelectedExp] = useState("All Experience");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");

  // Sorting State
  const [sortKey, setSortKey] = useState<keyof FacultyRecord>("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 5;

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
    department: "",
    specialization: "",
    qualification: "Ph.D. in Computer Science",
    experience: 5,
    teachingLoadHours: 16,
    assignedCoursesCount: 2,
    assignedSubjectsList: [],
    attendancePercentage: 95,
    status: "Active",
    publicationsCount: 0,
    performanceRating: "Very Good (4.2/5.0)",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        designation: selectedDesig,
        status: selectedStatus,
        qualification: selectedQual !== "All Qualifications" ? selectedQual : undefined,
        experience: selectedExp !== "All Experience" ? selectedExp : undefined,
      };

      const response = await getFaculty({
        department: selectedDepartment,
        page: currentPage,
        limit: pageSize,
        search,
        filters,
        sort: {
          key: sortKey,
          order: sortOrder,
        },
      });

      setFaculty(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.total);

      const statsData = await fetchFacultyStats(selectedDepartment);
      setStats(statsData);
    } catch {
      toast.error("Failed to sync faculty roster data.");
    } finally {
      setLoading(false);
    }
  };

  // Reload when scope changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDepartment, search, selectedDesig, selectedQual, selectedExp, selectedStatus, sortKey, sortOrder]);

  useEffect(() => {
    loadData();
  }, [selectedDepartment, currentPage, search, selectedDesig, selectedQual, selectedExp, selectedStatus, sortKey, sortOrder]);

  // Handlers
  const handleSort = (key: keyof FacultyRecord) => {
    setSortOrder((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key);
  };

  const handleOpenAdd = () => {
    setFormData({
      empId: `EMP-FAC-${Math.floor(100 + Math.random() * 800)}`,
      fullName: "",
      email: "",
      phone: "",
      designation: "Assistant Professor",
      department: selectedDepartment,
      specialization: "",
      qualification: "Ph.D. in CS",
      experience: 5,
      teachingLoadHours: 16,
      assignedCoursesCount: 2,
      assignedSubjectsList: [],
      attendancePercentage: 95,
      status: "Active",
      publicationsCount: 0,
      performanceRating: "Very Good (4.2/5.0)",
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

    try {
      const created = await createFacultyRecord({
        ...formData,
        department: selectedDepartment,
      });
      loadData();
      setIsAddOpen(false);
      toast.success(`Faculty member ${created.fullName} successfully registered in ${selectedDepartment}!`);
    } catch {
      toast.error("Failed to register faculty member.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFac) return;

    try {
      await updateFacultyRecord(selectedFac.id, formData);
      loadData();
      setIsEditOpen(false);
      toast.success(`Faculty record for ${formData.fullName} updated!`);
    } catch {
      toast.error("Failed to update faculty record.");
    }
  };

  const handleDelete = async (id: string, empId: string, name: string) => {
    if (confirm(`Are you sure you want to delete faculty record for ${name} (${empId})?`)) {
      try {
        await deleteFacultyRecord(id);
        loadData();
        toast.success(`Faculty record ${empId} deleted successfully.`);
      } catch {
        toast.error("Failed to delete faculty record.");
      }
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Employee ID",
      "Full Name",
      "Email",
      "Phone",
      "Designation",
      "Department",
      "Specialization",
      "Qualification",
      "Experience (Yrs)",
      "Workload Hours",
      "Attendance %",
      "Status",
    ];

    const rows = faculty.map((f) => [
      f.empId,
      f.fullName,
      f.email,
      f.phone,
      f.designation,
      f.department,
      f.specialization,
      f.qualification,
      f.experience,
      f.teachingLoadHours,
      f.attendancePercentage,
      f.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faculty_roster_${selectedDepartment}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 min-w-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <UserCog className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Faculty Workspace Control
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 uppercase bg-primary/5">
                DEAN: {selectedDepartment}
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage department staff workloads, schedules, research publications, and credentials.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
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

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1 h-full">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Faculty Strength</span>
            <UserCog className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{stats?.totalFaculty || 0} Members</p>
          <p className="text-[0.68rem] text-muted-foreground font-mono">
            Prof: {stats?.professors || 0} &middot; Lect: {stats?.lecturers || 0} &middot; Visit: {stats?.visitingFaculty || 0}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1 h-full">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Cadre Distribution</span>
            <Award className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{stats?.professors || 0} Professors</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium font-mono">
            Assoc: {stats?.associateProfessors || 0} &middot; Assist: {stats?.assistantProfessors || 0}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1 h-full">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Avg Workload & Research</span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">{stats?.avgWorkload || 0} Hrs / Wk</p>
          <p className="text-[0.68rem] text-muted-foreground font-mono">
            Total Publications: {stats?.totalPublications || 0} Papers
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1 h-full">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Faculty Attendance</span>
            <Calendar className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{stats?.avgAttendance || 0}% Rate</p>
          <p className="text-[0.68rem] text-muted-foreground font-mono">
            Substitute mapping fully active
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-3 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, email, specialization, qualification..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs w-full"
            />
          </div>

          {/* Department indicator lock */}
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border/80 bg-muted/40 text-xs font-bold text-foreground shrink-0">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span>Scope: {selectedDepartment}</span>
          </div>

          {/* Designation Filter */}
          <Select value={selectedDesig} onValueChange={setSelectedDesig}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
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

          {/* Qualification Filter */}
          <Select value={selectedQual} onValueChange={setSelectedQual}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
              <GraduationCap className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Qualification" />
            </SelectTrigger>
            <SelectContent>
              {QUALIFICATIONS.map((q) => (
                <SelectItem key={q} value={q} className="text-xs">
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Experience Filter */}
          <Select value={selectedExp} onValueChange={setSelectedExp}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
              <Clock className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCES.map((e) => (
                <SelectItem key={e} value={e} className="text-xs">
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 w-full sm:w-[110px] text-xs">
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

      {/* ROSTER TABLE PANEL */}
      <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-5 space-y-4 shadow-sm min-w-0">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <UserCheck className="size-4 text-primary" /> Faculty Directory & Workload Ledger
            <Badge variant="secondary" className="font-mono text-xs">
              {totalRecords} Members
            </Badge>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="size-5 animate-spin text-primary" />
            Syncing faculty roster data...
          </div>
        ) : faculty.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <UserCog className="size-7 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-medium">No faculty records found matching search or scope.</p>
          </div>
        ) : (
          <div className="space-y-4 min-w-0">
            {/* Table View for Desktop/Laptop/Tablet (hidden on Mobile <768px) */}
            <div className="hidden md:block overflow-x-auto max-w-full">
              <table className="w-full text-left text-xs min-w-[900px]">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("empId")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Emp ID
                        {sortKey === "empId" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("fullName")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Faculty Name
                        {sortKey === "fullName" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("designation")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Designation
                        {sortKey === "designation" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("qualification")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Qualification
                        {sortKey === "qualification" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("experience")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Experience
                        {sortKey === "experience" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("teachingLoadHours")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Workload (Hrs/Wk)
                        {sortKey === "teachingLoadHours" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort("status")}>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        Status
                        {sortKey === "status" && (sortOrder === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                      </div>
                    </th>
                    <th className="py-3 px-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {faculty.map((f) => (
                    <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground whitespace-nowrap">{f.empId}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground break-words">{f.fullName}</div>
                        <div className="text-[0.68rem] text-muted-foreground font-mono break-all">{f.email}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground break-words">{f.designation}</td>
                      <td className="py-3 px-3 text-muted-foreground break-words">{f.qualification}</td>
                      <td className="py-3 px-3 text-muted-foreground font-mono whitespace-nowrap">{f.experience} Years</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary text-sm whitespace-nowrap">
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
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenView(f)}
                            className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground shrink-0"
                            title="View Dossier"
                          >
                            <Eye className="size-3.5" /> Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(f)}
                            className="size-7 text-muted-foreground hover:text-primary shrink-0"
                            title="Edit Record"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(f.id, f.empId, f.fullName)}
                            className="size-7 text-muted-foreground hover:text-red-600 shrink-0"
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

            {/* Mobile Cards View (<768px) */}
            <div className="block md:hidden space-y-3.5">
              {faculty.map((f) => (
                <div key={f.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-semibold">
                        {f.empId}
                      </span>
                      <h4 className="font-bold text-foreground text-sm leading-snug mt-1">{f.fullName}</h4>
                      <p className="text-xs text-muted-foreground">{f.designation} &middot; {f.qualification}</p>
                    </div>
                    <Badge
                      className={
                        f.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem] shrink-0"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem] shrink-0"
                      }
                    >
                      {f.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Workload</span>
                      <span className="font-mono font-bold text-primary">{f.teachingLoadHours} Hrs/Wk</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Experience</span>
                      <span className="font-mono">{f.experience} Years</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground break-all">{f.email}</div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenView(f)}
                      className="h-8 text-xs font-semibold gap-1 text-foreground"
                    >
                      <Eye className="size-3.5" /> Details
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(f)}
                        className="size-8 text-muted-foreground hover:text-primary"
                        title="Edit Record"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(f.id, f.empId, f.fullName)}
                        className="size-8 text-muted-foreground hover:text-red-600"
                        title="Delete Faculty"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs">
              <span className="text-muted-foreground font-medium">
                Showing page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages || 1}</span> ({totalRecords} records)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-8 text-xs px-2.5 border-border"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 text-xs px-2.5 border-border"
                >
                  Next
                </Button>
              </div>
            </div>
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
              Register a new faculty member within the <span className="font-bold">{selectedDepartment}</span> department workspace.
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
                <Label className="text-xs font-semibold">Qualification</Label>
                <Input
                  placeholder="e.g. Ph.D. in Computer Science"
                  value={formData.qualification || ""}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Experience (Years)</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience ?? 5}
                  onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
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

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employment Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_LIST.filter((s) => s !== "All Status").map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label className="text-xs font-semibold">Qualification</Label>
                <Input
                  value={formData.qualification || ""}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Experience (Years)</Label>
                <Input
                  type="number"
                  value={formData.experience ?? 5}
                  onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
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
                <Label className="text-xs font-semibold">Assigned Courses</Label>
                <Input
                  type="number"
                  value={formData.assignedCoursesCount ?? 3}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedCoursesCount: Number(e.target.value) })
                  }
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employment Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_LIST.filter((s) => s !== "All Status").map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Attendance Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendancePercentage ?? 95}
                  onChange={(e) => setFormData({ ...formData, attendancePercentage: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Specialization</Label>
              <Input
                value={formData.specialization || ""}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="h-9 text-xs"
              />
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
        <DialogContent className="max-w-lg">
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
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-semibold"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-semibold"
                    }
                  >
                    {selectedFac.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">{selectedFac.fullName}</h2>
                <p className="text-xs text-primary font-mono">{selectedFac.email} &middot; {selectedFac.phone}</p>
              </div>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-3 bg-muted/40 border p-1 rounded-xl">
                  <TabsTrigger value="personal" className="text-xs">Personal Info</TabsTrigger>
                  <TabsTrigger value="academic" className="text-xs">Academic & Load</TabsTrigger>
                  <TabsTrigger value="research" className="text-xs">Research & Perf</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-2 mt-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Full Name:</span>
                    <span className="font-semibold text-foreground">{selectedFac.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Email Address:</span>
                    <span className="font-semibold text-foreground">{selectedFac.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                    <span className="text-muted-foreground font-medium font-sans">Contact Number:</span>
                    <span className="font-semibold text-foreground">{selectedFac.phone}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Designation:</span>
                    <span className="font-semibold text-foreground">{selectedFac.designation}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                    <span className="text-muted-foreground font-medium font-sans">Joining Date:</span>
                    <span className="font-semibold text-foreground">{selectedFac.joiningDate}</span>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-2 mt-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Qualification:</span>
                    <span className="font-semibold text-foreground">{selectedFac.qualification}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                    <span className="text-muted-foreground font-medium font-sans">Experience:</span>
                    <span className="font-semibold text-foreground">{selectedFac.experience} Years</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Specialization:</span>
                    <span className="font-semibold text-foreground truncate max-w-[250px]" title={selectedFac.specialization}>
                      {selectedFac.specialization}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                    <span className="text-muted-foreground font-medium font-sans">Weekly Load:</span>
                    <span className="font-bold text-base text-primary">
                      {selectedFac.teachingLoadHours} Hrs ({selectedFac.assignedCoursesCount} Courses)
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1.5">
                    <span className="text-muted-foreground font-semibold">Assigned Subjects ({selectedFac.assignedCoursesCount}):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFac.assignedSubjectsList?.length > 0 ? (
                        selectedFac.assignedSubjectsList.map((subj) => (
                          <Badge key={subj} variant="outline" className="text-[0.68rem] bg-muted/20">
                            {subj}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[0.68rem] text-muted-foreground">No subjects explicitly mapped</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1.5">
                    <span className="text-muted-foreground font-semibold">Weekly Timetable:</span>
                    <div className="space-y-1 font-mono text-[0.68rem]">
                      {selectedFac.weeklyTimetable?.length > 0 ? (
                        selectedFac.weeklyTimetable.map((tt, idx) => (
                          <div key={idx} className="flex justify-between border-b border-border/40 pb-1 last:border-b-0">
                            <span className="font-semibold text-foreground">{tt.day} ({tt.time}):</span>
                            <span className="text-muted-foreground">{tt.course} &middot; Rm {tt.room}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[0.68rem] text-muted-foreground font-sans">No slots booked</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="research" className="space-y-2 mt-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Research Publications:</span>
                    <span className="font-bold text-primary font-mono text-sm">{selectedFac.publicationsCount} Papers</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                    <span className="text-muted-foreground font-medium font-sans">Attendance Summary:</span>
                    <span className="font-bold text-emerald-600 text-sm">{selectedFac.attendancePercentage}% Rate</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                    <span className="text-muted-foreground font-medium">Performance Rating:</span>
                    <span className="font-bold text-amber-600">{selectedFac.performanceRating}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
                    <span className="text-muted-foreground font-semibold">Performance Overview:</span>
                    <p className="text-xs text-muted-foreground">
                      Obtained excellent student feedback for teaching efficacy and syllabus compliance. Active contributor to institution accreditation documentation.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

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
