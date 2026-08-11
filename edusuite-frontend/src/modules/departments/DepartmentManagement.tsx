import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  Users,
  UserCheck,
  UserCog,
  BookOpen,
  Briefcase,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  ChevronRight,
  MoreVertical,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

import {
  MOCK_DEPARTMENTS,
  MOCK_FACULTY_POOL,
  MOCK_DEPARTMENT_ACTIVITIES,
  type Department,
  type FacultySummary,
  type DepartmentActivity
} from "@/data/department-management-mock";

// Icon mapping helper
const iconMap: Record<string, any> = {
  Building2,
  Users,
  UserCheck,
  UserCog,
  BookOpen,
  Briefcase,
  AlertTriangle,
};

export function DepartmentManagement() {
  // Simulated Loading/Error/Empty States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Selected Department for View/Drawer
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentDeptForm, setCurrentDeptForm] = useState<Partial<Department>>({});

  const [isHODModalOpen, setIsHODModalOpen] = useState(false);
  const [selectedFacultyForHOD, setSelectedFacultyForHOD] = useState<string>("");
  const [effectiveDate, setEffectiveDate] = useState<string>("");
  const [facultySearch, setFacultySearch] = useState("");

  // Validation state for forms
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Summary Metrics Computation
  const stats = useMemo(() => {
    const total = departments.length;
    const active = departments.filter((d) => d.status === "active").length;
    const hodsAssigned = departments.filter((d) => d.hod && d.hod !== "Vacant").length;
    const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);
    const totalStudents = departments.reduce((acc, d) => acc + d.studentCount, 0);
    const attention = departments.filter((d) => d.attentionRequired).length;

    return { total, active, hodsAssigned, totalFaculty, totalStudents, attention };
  }, [departments]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSchoolFilter("all");
    setSortBy("name");
    toast.success("Filters reset successfully");
  };

  // Filter & Sort Logic
  const filteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => {
        const matchesSearch =
          dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.hod.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || dept.status === statusFilter;

        const matchesSchool =
          schoolFilter === "all" || dept.school === schoolFilter;

        return matchesSearch && matchesStatus && matchesSchool;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.departmentName.localeCompare(b.departmentName);
        if (sortBy === "facultyCount") return b.facultyCount - a.facultyCount;
        if (sortBy === "studentCount") return b.studentCount - a.studentCount;
        if (sortBy === "recentlyAdded") return b.createdAt.localeCompare(a.createdAt);
        return 0;
      });
  }, [departments, searchTerm, statusFilter, schoolFilter, sortBy]);

  // Drawer Department Details
  const activeDeptDetails = useMemo(() => {
    if (!selectedDeptId) return null;
    return departments.find((d) => d.id === selectedDeptId) || null;
  }, [departments, selectedDeptId]);

  // Recent activities of active department
  const activeDeptActivities = useMemo(() => {
    if (!activeDeptDetails) return [];
    return MOCK_DEPARTMENT_ACTIVITIES[activeDeptDetails.id] || [
      { id: "fallback-act", type: "course", description: "Department profile audit log verified.", timestamp: "1 week ago", user: "Audit Admin" }
    ];
  }, [activeDeptDetails]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Code", "Name", "School", "HOD", "Estd Year", "Faculty", "Students", "Status", "Office"];
    const rows = filteredDepartments.map((d) => [
      d.departmentCode,
      d.departmentName,
      d.school,
      d.hod,
      d.establishedYear,
      d.facultyCount,
      d.studentCount,
      d.status,
      d.officeLocation.replace(/,/g, "-")
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `departments_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} department records to CSV!`);
  };

  // Trigger loading state simulation
  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  // Add / Edit handlers
  const handleOpenAddModal = () => {
    setFormMode("add");
    setCurrentDeptForm({
      departmentCode: "",
      departmentName: "",
      description: "",
      school: "Engineering",
      hod: "Vacant",
      establishedYear: 2026,
      facultyCount: 0,
      studentCount: 0,
      courseCount: 0,
      subjectCount: 0,
      email: "",
      phone: "",
      officeLocation: "",
      status: "active",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (dept: Department) => {
    setFormMode("edit");
    setCurrentDeptForm(dept);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Basic Validation
    if (!currentDeptForm.departmentName?.trim()) {
      errors.departmentName = "Department Name is required.";
    }
    if (!currentDeptForm.departmentCode?.trim()) {
      errors.departmentCode = "Department Code is required.";
    } else if (currentDeptForm.departmentCode.trim().length > 10) {
      errors.departmentCode = "Code must be 10 characters or less.";
    }
    if (!currentDeptForm.email?.trim()) {
      errors.email = "Contact email is required.";
    } else if (!/\S+@\S+\.\S+/.test(currentDeptForm.email)) {
      errors.email = "Invalid email formatting.";
    }
    if (!currentDeptForm.officeLocation?.trim()) {
      errors.officeLocation = "Office location is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please resolve validation errors first.");
      return;
    }

    // Save
    if (formMode === "add") {
      const newDept: Department = {
        ...(currentDeptForm as Department),
        id: `dept-${currentDeptForm.departmentCode?.toLowerCase()}-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setDepartments((prev) => [...prev, newDept]);
      toast.success(`Created Department: ${newDept.departmentName}`);
    } else {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === currentDeptForm.id
            ? ({
                ...d,
                ...currentDeptForm,
                updatedAt: new Date().toISOString().split("T")[0]
              } as Department)
            : d
        )
      );
      toast.success(`Updated Department: ${currentDeptForm.departmentName}`);
    }

    setIsFormModalOpen(false);
  };

  // HOD Assignment handlers
  const handleOpenHODModal = (dept: Department) => {
    setCurrentDeptForm(dept);
    setSelectedFacultyForHOD("");
    setEffectiveDate(new Date().toISOString().split("T")[0]);
    setFacultySearch("");
    setIsHODModalOpen(true);
  };

  const handleSaveHODAssignment = () => {
    if (!selectedFacultyForHOD) {
      toast.error("Please choose a faculty member.");
      return;
    }

    const faculty = MOCK_FACULTY_POOL.find((f) => f.id === selectedFacultyForHOD);
    if (!faculty) return;

    // Confirm assignment dialog action
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === currentDeptForm.id
          ? {
              ...d,
              hod: faculty.name,
              email: faculty.email,
              phone: faculty.phone,
              attentionRequired: false,
              attentionReason: undefined,
              updatedAt: new Date().toISOString().split("T")[0]
            }
          : d
      )
    );

    toast.success(`Assigned ${faculty.name} as HOD of ${currentDeptForm.departmentCode}`);
    setIsHODModalOpen(false);
  };

  // Archive Handler
  const handleArchiveDepartment = (id: string, name: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "inactive" as const } : d))
    );
    toast.warning(`Archived Department: ${name} (marked as inactive)`);
  };

  // Filtered faculty pool for HOD selection modal
  const filteredFacultyPool = useMemo(() => {
    return MOCK_FACULTY_POOL.filter((f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.departmentCode.toLowerCase().includes(facultySearch.toLowerCase())
    );
  }, [facultySearch]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeletons */}
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-muted/40 animate-pulse rounded-xl border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Building2 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Department Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage academic departments, HOD assignments, and department information.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerReload}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Download className="size-3.5" /> Export Departments
          </Button>
          <Button
            onClick={handleOpenAddModal}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-4" /> Add Department
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
        <KpiCard label="Total Depts" value={String(stats.total)} icon={Building2} tone="primary" />
        <KpiCard label="Active Depts" value={String(stats.active)} icon={CheckCircle} tone="success" />
        <KpiCard label="HODs Assigned" value={String(stats.hodsAssigned)} icon={UserCheck} tone="info" />
        <KpiCard label="Total Faculty" value={String(stats.totalFaculty)} icon={UserCog} tone="info" />
        <KpiCard label="Total Students" value={String(stats.totalStudents)} icon={Users} tone="primary" />
        <KpiCard
          label="Requires Action"
          value={String(stats.attention)}
          icon={AlertTriangle}
          tone={stats.attention > 0 ? "destructive" : "success"}
          delta={stats.attention > 0 ? "Issues pending" : "All clean"}
          trend={stats.attention > 0 ? "down" : "up"}
        />
      </div>

      {/* 3. SEARCH & FILTER SECTION */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-1 gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search department, HOD, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* School/Category Filter */}
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="School/Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
              <SelectItem value="Sciences">Sciences</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="facultyCount">Faculty Count</SelectItem>
              <SelectItem value="studentCount">Student Count</SelectItem>
              <SelectItem value="recentlyAdded">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleResetFilters}
          variant="outline"
          size="sm"
          className="h-9 font-semibold shrink-0"
        >
          Reset Filters
        </Button>
      </div>

      {/* 4. DEPARTMENT TABLE */}
      {filteredDepartments.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-card p-6 text-center space-y-3">
          <Building2 className="size-10 text-muted-foreground/60 animate-pulse" />
          <h3 className="text-base font-bold text-foreground">No departments found.</h3>
          <p className="max-w-xs text-xs text-muted-foreground">
            Clear your search filter constraints or register a new department branch module.
          </p>
          <Button onClick={handleOpenAddModal} size="sm" className="bg-brand-gradient text-white font-semibold">
            Add Department
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Department Name</th>
                  <th className="py-3 px-3">School</th>
                  <th className="py-3 px-3">HOD</th>
                  <th className="py-3 px-3">Faculty</th>
                  <th className="py-3 px-3">Students</th>
                  <th className="py-3 px-3">Active Courses</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className={`hover:bg-muted/20 transition-colors ${
                      dept.attentionRequired ? "bg-red-500/5 hover:bg-red-500/10" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        {dept.departmentCode}
                        {dept.attentionRequired && (
                          <AlertTriangle className="size-3.5 text-red-500" title={dept.attentionReason} />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{dept.departmentName}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{dept.school}</td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      {dept.hod === "Vacant" ? (
                        <span className="text-red-500 font-bold">Vacant</span>
                      ) : (
                        dept.hod
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{dept.facultyCount}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">{dept.studentCount}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-500">{dept.courseCount} Courses</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={
                          dept.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {dept.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDeptId(dept.id);
                            setIsDrawerOpen(true);
                          }}
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3.5" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(dept)}
                          className="size-7 text-muted-foreground hover:text-primary"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenHODModal(dept)}
                          className="size-7 text-muted-foreground hover:text-info"
                          title="Assign HOD"
                        >
                          <UserCog className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchiveDepartment(dept.id, dept.departmentName)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Archive Department"
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
        </div>
      )}

      {/* 5. VIEW DEPARTMENT DRAWER (SLIDE OVER DRAWER PANEL) */}
      {isDrawerOpen && activeDeptDetails && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in bg-black/40">
          <div className="fixed inset-0" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-lg bg-card border-l h-full shadow-2xl flex flex-col transition-all duration-300 animate-slide-in-from-right">
            
            {/* Drawer Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">
                    {activeDeptDetails.departmentCode}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Estd. {activeDeptDetails.establishedYear}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  {activeDeptDetails.departmentName}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="size-9 rounded-full"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs leading-normal">
              
              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono">
                  Syllabus & Department Description
                </h4>
                <p className="text-foreground text-[13px] leading-relaxed bg-muted/20 p-3.5 rounded-xl border">
                  {activeDeptDetails.description}
                </p>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-muted/30 rounded-xl border text-center">
                  <p className="text-[10px] font-sans text-muted-foreground">Faculty Members</p>
                  <p className="text-lg font-bold text-primary mt-0.5">{activeDeptDetails.facultyCount}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border text-center">
                  <p className="text-[10px] font-sans text-muted-foreground">Student Strength</p>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">{activeDeptDetails.studentCount}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border text-center">
                  <p className="text-[10px] font-sans text-muted-foreground">Active Courses</p>
                  <p className="text-lg font-bold text-indigo-500 mt-0.5">{activeDeptDetails.courseCount}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border text-center">
                  <p className="text-[10px] font-sans text-muted-foreground">Syllabus Subjects</p>
                  <p className="text-lg font-bold text-orange-500 mt-0.5">{activeDeptDetails.subjectCount}</p>
                </div>
              </div>

              {/* General Contact Info */}
              <div className="space-y-3.5">
                <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1.5">
                  Department Information
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-4 text-primary shrink-0" />
                    <span>HOD: <span className="font-bold text-foreground">{activeDeptDetails.hod}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-primary shrink-0" />
                    <span>Email: <span className="font-medium text-foreground">{activeDeptDetails.email}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-primary shrink-0" />
                    <span>Phone: <span className="font-medium text-foreground">{activeDeptDetails.phone}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <span>Office Location: <span className="font-medium text-foreground">{activeDeptDetails.officeLocation}</span></span>
                  </div>
                </div>
              </div>

              {/* Recent Activities Section */}
              <div className="space-y-4 pt-1">
                <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1.5">
                  Recent Activities
                </h4>
                <div className="space-y-3.5 relative border-l-2 pl-4 ml-1.5">
                  {activeDeptActivities.map((act) => (
                    <div key={act.id} className="relative space-y-0.5">
                      <span className="absolute -left-[22px] top-1 size-2 rounded-full bg-primary" />
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-primary">{act.timestamp}</span>
                        <span className="text-muted-foreground font-mono">By: {act.user}</span>
                      </div>
                      <p className="text-foreground font-medium">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t flex justify-end gap-2">
              <Button onClick={() => setIsDrawerOpen(false)} size="sm">
                Close Drawer
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* 6. ADD / EDIT DEPARTMENT MODAL */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              {formMode === "add" ? "Create Academic Department" : "Edit Department Profile"}
            </DialogTitle>
            <DialogDescription>
              Provide organizational codes, established year parameters, office locations, and contacts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="dept-name">Department Name*</Label>
                <Input
                  id="dept-name"
                  value={currentDeptForm.departmentName || ""}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({ ...prev, departmentName: e.target.value }))
                  }
                  required
                />
                {formErrors.departmentName && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.departmentName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="dept-code">Department Code* (e.g. CSE)</Label>
                <Input
                  id="dept-code"
                  value={currentDeptForm.departmentCode || ""}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({ ...prev, departmentCode: e.target.value }))
                  }
                  required
                  disabled={formMode === "edit"}
                />
                {formErrors.departmentCode && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.departmentCode}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="dept-school">School/Category*</Label>
                <Select
                  value={currentDeptForm.school || "Engineering"}
                  onValueChange={(val: any) =>
                    setCurrentDeptForm((prev) => ({ ...prev, school: val }))
                  }
                >
                  <SelectTrigger id="dept-school">
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">School of Engineering</SelectItem>
                    <SelectItem value="Management">School of Management</SelectItem>
                    <SelectItem value="Sciences">School of Basic Sciences</SelectItem>
                    <SelectItem value="Arts">School of Arts & Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="dept-est">Established Year</Label>
                <Input
                  id="dept-est"
                  type="number"
                  value={currentDeptForm.establishedYear || 2026}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({
                      ...prev,
                      establishedYear: parseInt(e.target.value) || 2026,
                    }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="dept-email">Department Contact Email*</Label>
                <Input
                  id="dept-email"
                  type="email"
                  value={currentDeptForm.email || ""}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
                {formErrors.email && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="dept-phone">Contact Phone</Label>
                <Input
                  id="dept-phone"
                  value={currentDeptForm.phone || ""}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="dept-loc">Office Location* (e.g. Block C, Room 102)</Label>
                <Input
                  id="dept-loc"
                  value={currentDeptForm.officeLocation || ""}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({ ...prev, officeLocation: e.target.value }))
                  }
                  required
                />
                {formErrors.officeLocation && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.officeLocation}</p>
                )}
              </div>

              <div className="space-y-1 col-span-2">
                <Label htmlFor="dept-desc">Department Description</Label>
                <Textarea
                  id="dept-desc"
                  value={currentDeptForm.description || ""}
                  onChange={(e) =>
                    setCurrentDeptForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="min-h-[70px] text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="dept-status">Status</Label>
                <Select
                  value={currentDeptForm.status || "active"}
                  onValueChange={(val: any) =>
                    setCurrentDeptForm((prev) => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger id="dept-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">
                {formMode === "add" ? "Save Department" : "Update Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. ASSIGN HOD MODAL */}
      <Dialog open={isHODModalOpen} onOpenChange={setIsHODModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              Assign Head of Department (HOD)
            </DialogTitle>
            <DialogDescription>
              Appoint a qualified professor to manage operations for the **{currentDeptForm.departmentCode}** department.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            
            {/* Current HOD Info */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border/80 space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                Current Appointee
              </p>
              <p className="text-sm font-bold text-foreground">
                {currentDeptForm.hod === "Vacant" ? (
                  <span className="text-red-500 font-bold">Vacant</span>
                ) : (
                  currentDeptForm.hod
                )}
              </p>
            </div>

            {/* Search Faculty Pool */}
            <div className="space-y-1.5">
              <Label>Search & Select Faculty member</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search faculty name or dept..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              
              <div className="border rounded-xl mt-1.5 max-h-[160px] overflow-y-auto pr-1">
                {filteredFacultyPool.length === 0 ? (
                  <p className="text-center p-3 text-muted-foreground italic">No faculty matched.</p>
                ) : (
                  filteredFacultyPool.map((fac) => (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacultyForHOD(fac.id)}
                      className={`p-2 border-b last:border-b-0 cursor-pointer flex items-center justify-between hover:bg-muted/30 transition-colors ${
                        selectedFacultyForHOD === fac.id ? "bg-primary/5 text-primary font-semibold" : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{fac.name}</p>
                        <p className="text-[10px] text-muted-foreground">{fac.designation} &middot; {fac.departmentCode}</p>
                      </div>
                      {selectedFacultyForHOD === fac.id && (
                        <CheckCircle className="size-4 text-primary shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Effective Date */}
            <div className="space-y-1">
              <Label htmlFor="effective-date">Effective Commissioning Date</Label>
              <Input
                id="effective-date"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>

            {/* Confirmation Alert */}
            {selectedFacultyForHOD && (
              <div className="flex gap-2 p-3 bg-warning/10 border border-warning/20 text-warning rounded-xl">
                <AlertTriangle className="size-5 shrink-0 text-warning" />
                <p className="text-[11px] leading-relaxed">
                  **Attention:** Appointing a new HOD will automatically transition contacts, email credentials, and administrative logs.
                </p>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsHODModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveHODAssignment}
                disabled={!selectedFacultyForHOD}
                className="bg-brand-gradient text-white font-semibold shadow-glow"
              >
                Approve & Commission HOD
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
