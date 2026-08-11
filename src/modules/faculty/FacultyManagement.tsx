import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  UserCog,
  Users,
  UserCheck,
  BookOpen,
  CalendarRange,
  ClipboardCheck,
  FileCheck,
  FileSpreadsheet,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  X,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Layers,
  Award,
  GraduationCap,
  Sparkles,
  PlayCircle,
  Clock,
  Briefcase,
  Sliders,
  CheckCircle,
  FileText
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { DonutChart, TrendAreaChart, GroupedBarChart } from "@/components/dashboard/charts";

import {
  MOCK_FACULTY_MEMBERS,
  MOCK_DEPARTMENTS_LIST,
  MOCK_AVAILABLE_SUBJECTS,
  type FacultyMember
} from "@/data/faculty-management-mock";

// Icon helper
const iconMap: Record<string, any> = {
  UserCog,
  Users,
  UserCheck,
  BookOpen,
  CalendarRange,
  ClipboardCheck,
  FileCheck,
  FileSpreadsheet,
};

export function FacultyManagement() {
  // Loading, Error, Empty States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(MOCK_FACULTY_MEMBERS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workloadFilter, setWorkloadFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Selection for Modals
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentFormFaculty, setCurrentFormFaculty] = useState<Partial<FacultyMember>>({});

  // Subject Assignment modal
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  const [assignSemester, setAssignSemester] = useState("Semester 5");
  const [assignDept, setAssignDept] = useState("CSE");
  const [selectedSubjectsList, setSelectedSubjectsList] = useState<string[]>([]);

  // Class Assignment modal
  const [isClassesModalOpen, setIsClassesModalOpen] = useState(false);
  const [classYear, setClassYear] = useState("2026-27");
  const [classSem, setClassSem] = useState("Semester 5");
  const [classSection, setClassSection] = useState("Section A");
  const [classroom, setClassroom] = useState("A-302");

  // Form Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Compute Metrics
  const metrics = useMemo(() => {
    const total = facultyList.length;
    const teaching = facultyList.filter((f) => f.weeklyHours > 0).length;
    const nonTeaching = total - teaching;
    const active = facultyList.filter((f) => f.status === "active").length;
    const noSubjects = facultyList.filter((f) => f.subjects.length === 0).length;
    const highWorkload = facultyList.filter((f) => f.weeklyHours >= 16).length;

    return { total, teaching, nonTeaching, active, noSubjects, highWorkload };
  }, [facultyList]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter("all");
    setDesignationFilter("all");
    setEmploymentFilter("all");
    setStatusFilter("all");
    setWorkloadFilter("all");
    setSortBy("name");
    toast.success("Filters reset successfully");
  };

  // Filter & Sort Faculty
  const filteredFaculty = useMemo(() => {
    return facultyList
      .filter((fac) => {
        const matchesSearch =
          fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fac.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fac.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = deptFilter === "all" || fac.department === deptFilter;
        
        const matchesDesignation =
          designationFilter === "all" || fac.designation === designationFilter;

        const matchesEmployment =
          employmentFilter === "all" || fac.employmentType === employmentFilter;

        const matchesStatus = statusFilter === "all" || fac.status === statusFilter;

        const workloadLevel =
          fac.weeklyHours >= 18
            ? "overloaded"
            : fac.weeklyHours >= 14
            ? "high"
            : fac.weeklyHours >= 8
            ? "medium"
            : "normal";
        const matchesWorkload = workloadFilter === "all" || workloadLevel === workloadFilter;

        return matchesSearch && matchesDept && matchesDesignation && matchesEmployment && matchesStatus && matchesWorkload;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "department") return a.department.localeCompare(b.department);
        if (sortBy === "experience") return b.experience - a.experience;
        if (sortBy === "joiningDate") return b.joiningDate.localeCompare(a.joiningDate);
        if (sortBy === "workload") return b.weeklyHours - a.weeklyHours;
        return 0;
      });
  }, [facultyList, searchTerm, deptFilter, designationFilter, employmentFilter, statusFilter, workloadFilter, sortBy]);

  // Selection Info for Drawer/Modals
  const activeFaculty = useMemo(() => {
    if (!selectedFacultyId) return null;
    return facultyList.find((f) => f.id === selectedFacultyId) || null;
  }, [facultyList, selectedFacultyId]);

  // Trigger reloading simulation
  const triggerReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Employee ID", "Name", "Department", "Designation", "Employment Type", "Weekly Hours", "Email", "Status"];
    const rows = filteredFaculty.map((f) => [
      f.employeeId,
      f.name,
      f.department,
      f.designation,
      f.employmentType,
      f.weeklyHours,
      f.email,
      f.status
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faculty_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} faculty records to CSV!`);
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setFormMode("add");
    setCurrentFormFaculty({
      employeeId: "",
      name: "",
      photo: "",
      department: "CSE",
      designation: "Assistant Professor",
      employmentType: "Full-Time",
      qualification: "",
      experience: 1,
      email: "",
      phone: "",
      joiningDate: new Date().toISOString().split("T")[0],
      subjects: [],
      sections: [],
      weeklyHours: 0,
      labHours: 0,
      mentoringHours: 0,
      projectHours: 0,
      adminHours: 0,
      status: "active",
      attendanceRate: 100,
      feedbackScore: 5.0,
      recentActivities: []
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (fac: FacultyMember) => {
    setFormMode("edit");
    setCurrentFormFaculty(fac);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!currentFormFaculty.name?.trim()) errors.name = "Faculty Name is required.";
    if (!currentFormFaculty.employeeId?.trim()) errors.employeeId = "Employee ID is required.";
    if (!currentFormFaculty.email?.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(currentFormFaculty.email)) errors.email = "Invalid email format.";
    if (!currentFormFaculty.qualification?.trim()) errors.qualification = "Qualification is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please resolve validation errors first.");
      return;
    }

    const initials = currentFormFaculty.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "FC";

    if (formMode === "add") {
      const newFac: FacultyMember = {
        ...(currentFormFaculty as FacultyMember),
        id: `fac-${currentFormFaculty.employeeId?.toLowerCase()}-${Date.now()}`,
        photo: initials,
        recentActivities: [{ id: "act-init", description: "Profile configured on portal", timestamp: "Just now" }]
      };
      setFacultyList((prev) => [...prev, newFac]);
      toast.success(`Registered Faculty Member: ${newFac.name}`);
    } else {
      setFacultyList((prev) =>
        prev.map((f) => (f.id === currentFormFaculty.id ? ({ ...f, ...currentFormFaculty, photo: initials } as FacultyMember) : f))
      );
      toast.success(`Updated Faculty Profile: ${currentFormFaculty.name}`);
    }

    setIsFormModalOpen(false);
  };

  // Subject Assignment handlers
  const handleOpenSubjectsModal = (fac: FacultyMember) => {
    setSelectedFacultyId(fac.id);
    setSelectedSubjectsList(fac.subjects);
    setIsSubjectsModalOpen(true);
  };

  const handleToggleSubject = (subName: string, subHours: number) => {
    if (selectedSubjectsList.includes(subName)) {
      setSelectedSubjectsList((prev) => prev.filter((s) => s !== subName));
    } else {
      // Prevent duplicates in assignment
      setSelectedSubjectsList((prev) => [...prev, subName]);
    }
  };

  const handleSaveSubjects = () => {
    if (!selectedFacultyId) return;

    // Calculate weekly workload changes based on assigned subjects
    const updatedSubjectsCount = selectedSubjectsList.length;
    // Assume average 4 hours per subject for simplicity
    const newWeeklyHours = updatedSubjectsCount * 4 + 4; // foundational teaching + lab

    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === selectedFacultyId
          ? {
              ...f,
              subjects: selectedSubjectsList,
              weeklyHours: newWeeklyHours,
              recentActivities: [
                { id: `act-sub-${Date.now()}`, description: `Assigned subjects: ${selectedSubjectsList.join(", ")}`, timestamp: "Just now" },
                ...f.recentActivities
              ]
            }
          : f
      )
    );

    toast.success(`Subject allocations updated successfully!`);
    setIsSubjectsModalOpen(false);
  };

  // Class Assignment Handlers
  const handleOpenClassesModal = (fac: FacultyMember) => {
    setSelectedFacultyId(fac.id);
    setIsClassesModalOpen(true);
  };

  const handleSaveClasses = () => {
    if (!selectedFacultyId || !activeFaculty) return;
    const newSection = `${classSem} ${classSection} (${classroom})`;

    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === selectedFacultyId
          ? {
              ...f,
              sections: f.sections.includes(newSection) ? f.sections : [...f.sections, newSection],
              recentActivities: [
                { id: `act-cls-${Date.now()}`, description: `Assigned to Class: ${newSection} for Year ${classYear}`, timestamp: "Just now" },
                ...f.recentActivities
              ]
            }
          : f
      )
    );

    toast.success(`Class Section ${classSection} assigned successfully!`);
    setIsClassesModalOpen(false);
  };

  // Archive Faculty
  const handleArchiveFaculty = (id: string, name: string) => {
    setFacultyList((prev) => prev.map((f) => (f.id === id ? { ...f, status: "inactive" as const } : f)));
    toast.warning(`Archived profile of ${name} (marked as inactive)`);
  };

  // Filtered available subjects for assignment modal
  const filteredAvailableSubjects = useMemo(() => {
    return MOCK_AVAILABLE_SUBJECTS.filter((sub) => sub.department === assignDept);
  }, [assignDept]);

  // Analytics Chart Coordinates
  const deptDistributionData = useMemo(() => {
    const depts = ["CSE", "ECE", "EEE", "ME", "Civil", "MBA", "H&S"];
    return depts.map((d) => ({
      name: d,
      value: facultyList.filter((f) => f.department === d).length
    }));
  }, [facultyList]);

  const workloadLevelData = useMemo(() => {
    const levels = [
      { name: "Normal (0-8h)", min: 0, max: 8 },
      { name: "Medium (8-14h)", min: 8, max: 14 },
      { name: "High (14-18h)", min: 14, max: 18 },
      { name: "Overloaded (18h+)", min: 18, max: 100 }
    ];
    return levels.map((l) => ({
      label: l.name,
      value: facultyList.filter((f) => f.weeklyHours >= l.min && f.weeklyHours < l.max).length
    }));
  }, [facultyList]);

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 min-w-0">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <UserCog className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Faculty Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage faculty members, academic assignments, workload, and department allocation.
            </p>
          </div>
        </div>

        {/* Action buttons */}
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
            <Download className="size-3.5" /> Export Faculty
          </Button>
          <Button
            onClick={handleOpenAddModal}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-4" /> Add Faculty
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Total Faculty" value={String(metrics.total)} icon={Users} tone="primary" className="h-full min-w-0" />
        <KpiCard label="Teaching Faculty" value={String(metrics.teaching)} icon={BookOpen} tone="info" className="h-full min-w-0" />
        <KpiCard label="Non-Teaching" value={String(metrics.nonTeaching)} icon={Briefcase} tone="warning" className="h-full min-w-0" />
        <KpiCard label="Active Faculty" value={String(metrics.active)} icon={UserCheck} tone="success" className="h-full min-w-0" />
        <KpiCard
          label="Unassigned Depts"
          value={String(metrics.noSubjects)}
          icon={AlertTriangle}
          tone={metrics.noSubjects > 0 ? "warning" : "success"}
          delta={metrics.noSubjects > 0 ? "Needs Subject" : "All set"}
          trend={metrics.noSubjects > 0 ? "down" : "up"}
          className="h-full min-w-0"
        />
        <KpiCard
          label="High Workload"
          value={String(metrics.highWorkload)}
          icon={Clock}
          tone={metrics.highWorkload > 0 ? "destructive" : "success"}
          delta="16+ hrs weekly"
          className="h-full min-w-0"
        />
      </div>

      {/* 3. SEARCH & FILTERS SECTION */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3.5 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px]">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search faculty name, ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs w-full"
            />
          </div>

          {/* Department Filter */}
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {MOCK_DEPARTMENTS_LIST.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Designation Filter */}
          <Select value={designationFilter} onValueChange={setDesignationFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
            </SelectContent>
          </Select>

          {/* Employment Type */}
          <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
              <SelectValue placeholder="Employment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-Time">Full-Time</SelectItem>
              <SelectItem value="Part-Time">Part-Time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Guest">Guest Faculty</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[120px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Workload Level */}
          <Select value={workloadFilter} onValueChange={setWorkloadFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
              <SelectValue placeholder="Workload" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workloads</SelectItem>
              <SelectItem value="normal">Normal (0-8h)</SelectItem>
              <SelectItem value="medium">Medium (8-14h)</SelectItem>
              <SelectItem value="high">High (14-18h)</SelectItem>
              <SelectItem value="overloaded">Overloaded (18h+)</SelectItem>
            </SelectContent>
          </Select>


        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t pt-3 gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground font-mono shrink-0">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-full sm:w-[160px] text-xs">
                <SelectValue placeholder="Sort Parameters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="joiningDate">Joining Date</SelectItem>
                <SelectItem value="workload">Workload Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleResetFilters}
            variant="outline"
            size="sm"
            className="h-8 font-semibold shrink-0 self-end sm:self-auto"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* 4. FACULTY TABLE & MOBILE CARDS SECTION */}
      {filteredFaculty.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-card p-6 text-center space-y-3">
          <UserCog className="size-10 text-muted-foreground/60 animate-pulse" />
          <h3 className="text-base font-bold text-foreground font-display">No Faculty Members Found</h3>
          <p className="max-w-xs text-xs text-muted-foreground">
            Clear your filtering conditions or register a new faculty credential.
          </p>
          <Button onClick={handleOpenAddModal} size="sm" className="bg-brand-gradient text-white font-semibold">
            Add Faculty
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-5 space-y-4 shadow-sm min-w-0">
          
          {/* Desktop, Laptop & Tablet Table View (hidden on Mobile <768px) */}
          <div className="hidden md:block overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs min-w-[1000px] lg:min-w-full">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-2 md:px-3 min-w-[90px]">Employee ID</th>
                  <th className="py-3 px-2 md:px-3 min-w-[170px]">Faculty Name</th>
                  <th className="py-3 px-2 md:px-3 min-w-[90px]">Department</th>
                  <th className="py-3 px-2 md:px-3 min-w-[130px]">Designation</th>
                  <th className="py-3 px-2 md:px-3 min-w-[170px]">Subjects Assigned</th>
                  <th className="py-3 px-2 md:px-3 min-w-[130px]">Weekly Workload</th>
                  <th className="py-3 px-2 md:px-3 min-w-[170px]">Contact</th>
                  <th className="py-3 px-2 md:px-3 min-w-[85px]">Status</th>
                  <th className="py-3 px-2 md:px-3 min-w-[160px] text-right pr-2 md:pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredFaculty.map((fac) => {
                  const maxWeeklyHrs = 18;
                  const workloadPercentage = Math.min((fac.weeklyHours / maxWeeklyHrs) * 100, 100);
                  
                  // Color code visual workload bars
                  let barColor = "bg-primary";
                  if (fac.weeklyHours >= 18) barColor = "bg-red-500";
                  else if (fac.weeklyHours >= 14) barColor = "bg-orange-500";
                  else if (fac.weeklyHours >= 8) barColor = "bg-amber-500";

                  return (
                    <tr key={fac.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-2 md:px-3 font-mono font-bold text-foreground whitespace-nowrap">{fac.employeeId}</td>
                      <td className="py-3 px-2 md:px-3">
                        <div className="flex items-center gap-2.5 min-w-[160px]">
                          <span className="grid size-8 aspect-square place-items-center rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 shrink-0">
                            {fac.photo}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-xs leading-snug break-words">{fac.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">{fac.employmentType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-3 font-semibold text-foreground whitespace-nowrap">{fac.department}</td>
                      <td className="py-3 px-2 md:px-3 font-medium text-foreground whitespace-normal break-words">{fac.designation}</td>
                      <td className="py-3 px-2 md:px-3">
                        {fac.subjects.length === 0 ? (
                          <span className="text-red-500 font-bold text-[10px] whitespace-nowrap">None Assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {fac.subjects.map((sub, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px] bg-muted/40 font-medium whitespace-normal break-words">
                                {sub.split(" (")[0]}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 md:px-3 font-medium text-foreground">
                        <div className="space-y-1 w-full min-w-[110px] max-w-[130px]">
                          <div className="flex items-center justify-between font-mono text-[10px] font-bold gap-1">
                            <span className="shrink-0">{fac.weeklyHours} hrs/wk</span>
                            <span className={cn("shrink-0 text-[9px]", fac.weeklyHours >= 18 ? "text-red-500" : "")}>
                              {fac.weeklyHours >= 18 ? "Overloaded" : fac.weeklyHours >= 14 ? "High" : "Normal"}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${workloadPercentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-3 space-y-0.5">
                        <p className="text-[11px] font-medium text-foreground break-all">{fac.email}</p>
                        <p className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">{fac.phone}</p>
                      </td>
                      <td className="py-3 px-2 md:px-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "whitespace-nowrap text-[10px]",
                            fac.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                              : fac.status === "on-leave"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/25"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {fac.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 md:px-3 text-right pr-2 md:pr-4">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFacultyId(fac.id);
                              setIsProfileOpen(true);
                            }}
                            className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground shrink-0"
                          >
                            <Eye className="size-3.5" /> View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditModal(fac)}
                            className="size-7 text-muted-foreground hover:text-primary shrink-0"
                            title="Edit Profile"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenSubjectsModal(fac)}
                            className="size-7 text-muted-foreground hover:text-info shrink-0"
                            title="Assign Subjects"
                          >
                            <BookOpen className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenClassesModal(fac)}
                            className="size-7 text-muted-foreground hover:text-indigo-500 shrink-0"
                            title="Assign Classes"
                          >
                            <CalendarRange className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleArchiveFaculty(fac.id, fac.name)}
                            className="size-7 text-muted-foreground hover:text-red-600 shrink-0"
                            title="Archive Faculty"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Card View (<768px) */}
          <div className="block md:hidden space-y-3.5">
            {filteredFaculty.map((fac) => {
              const maxWeeklyHrs = 18;
              const workloadPercentage = Math.min((fac.weeklyHours / maxWeeklyHrs) * 100, 100);
              let barColor = "bg-primary";
              if (fac.weeklyHours >= 18) barColor = "bg-red-500";
              else if (fac.weeklyHours >= 14) barColor = "bg-orange-500";
              else if (fac.weeklyHours >= 8) barColor = "bg-amber-500";

              return (
                <div key={fac.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
                  {/* Top bar: Avatar + Name + Employee ID + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid size-10 aspect-square place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shrink-0">
                        {fac.photo}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-foreground text-sm leading-snug break-words">{fac.name}</p>
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-semibold shrink-0">
                            {fac.employeeId}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {fac.designation} &middot; <span className="font-semibold text-foreground">{fac.department}</span>
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-[10px]",
                        fac.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                          : fac.status === "on-leave"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/25"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {fac.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Middle details: Subjects & Workload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block mb-1">
                        Subjects
                      </span>
                      {fac.subjects.length === 0 ? (
                        <span className="text-red-500 font-bold text-[10px]">None Assigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {fac.subjects.map((sub, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] bg-muted/40 font-medium whitespace-normal break-words">
                              {sub.split(" (")[0]}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block mb-1">
                        Workload
                      </span>
                      <div className="space-y-1 w-full max-w-[180px]">
                        <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                          <span>{fac.weeklyHours} hrs/wk</span>
                          <span className={fac.weeklyHours >= 18 ? "text-red-500" : ""}>
                            {fac.weeklyHours >= 18 ? "Overloaded" : fac.weeklyHours >= 14 ? "High" : "Normal"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${barColor}`} style={{ width: `${workloadPercentage}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                    <span className="break-all">{fac.email}</span>
                    <span className="font-mono whitespace-nowrap">{fac.phone}</span>
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center justify-between gap-1 flex-wrap pt-2.5 border-t border-border/60">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFacultyId(fac.id);
                        setIsProfileOpen(true);
                      }}
                      className="h-8 text-xs font-semibold gap-1 text-foreground"
                    >
                      <Eye className="size-3.5" /> View Profile
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(fac)}
                        className="size-8 text-muted-foreground hover:text-primary"
                        title="Edit Profile"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenSubjectsModal(fac)}
                        className="size-8 text-muted-foreground hover:text-info"
                        title="Assign Subjects"
                      >
                        <BookOpen className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenClassesModal(fac)}
                        className="size-8 text-muted-foreground hover:text-indigo-500"
                        title="Assign Classes"
                      >
                        <CalendarRange className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleArchiveFaculty(fac.id, fac.name)}
                        className="size-8 text-muted-foreground hover:text-red-600"
                        title="Archive Faculty"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. FACULTY PROFILE SIDE DRAWER/DIALOG */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl text-xs leading-normal">
          {activeFaculty && (
            <>
              <DialogHeader className="border-b pb-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/25">
                    {activeFaculty.photo}
                  </span>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
                      {activeFaculty.name}
                      <Badge className="bg-primary/5 text-primary border-primary/20 text-[9px] uppercase tracking-wide">
                        {activeFaculty.employeeId}
                      </Badge>
                    </DialogTitle>
                    <p className="text-muted-foreground font-medium text-xs">
                      {activeFaculty.designation} &middot; {activeFaculty.department} Department
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-y-auto max-h-[50vh] pr-1">
                
                {/* Personal Information */}
                <div className="space-y-3.5">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                    Personal Information
                  </h4>
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-muted-foreground font-mono">Academic Qualification:</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">{activeFaculty.qualification}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Experience:</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">{activeFaculty.experience} Years</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Date of Joining:</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">{activeFaculty.joiningDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono">Employment Model:</span>
                      <p className="font-bold text-foreground text-xs mt-0.5">{activeFaculty.employmentType}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-muted-foreground font-mono">Email Contact:</span>
                        <p className="font-medium text-foreground text-xs mt-0.5">{activeFaculty.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Phone Contact:</span>
                        <p className="font-medium text-foreground text-xs mt-0.5">{activeFaculty.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Workload Summary */}
                <div className="space-y-3.5">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                    Workload Distribution
                  </h4>
                  <div className="space-y-2.5 bg-muted/20 p-3.5 rounded-xl border border-border/80">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Theory Lectures:</span>
                      <span className="font-bold text-foreground">{activeFaculty.weeklyHours} hours/wk</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Laboratory Practicals:</span>
                      <span className="font-bold text-foreground">{activeFaculty.labHours} hours/wk</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Mentoring Hours:</span>
                      <span className="font-bold text-foreground">{activeFaculty.mentoringHours} hours/wk</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Projects Guided:</span>
                      <span className="font-bold text-foreground">{activeFaculty.projectHours} hours/wk</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] border-t pt-1.5 font-bold font-mono">
                      <span>Total Workload:</span>
                      <span className="text-primary">{activeFaculty.weeklyHours + activeFaculty.labHours + activeFaculty.mentoringHours + activeFaculty.projectHours} Hrs</span>
                    </div>
                  </div>
                  
                  {/* Feedback rating */}
                  <div className="flex gap-4 font-mono">
                    <div className="p-2.5 rounded-xl bg-muted/40 border text-center flex-1">
                      <span className="text-[10px] font-sans text-muted-foreground">Attendance Rate</span>
                      <p className="text-base font-bold text-emerald-600 mt-0.5">{activeFaculty.attendanceRate}%</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/40 border text-center flex-1">
                      <span className="text-[10px] font-sans text-muted-foreground">Feedback Rating</span>
                      <p className="text-base font-bold text-primary mt-0.5">{activeFaculty.feedbackScore} / 5</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Subjects & Classes */}
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                    Assigned Subjects & Sections
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border rounded-xl space-y-1">
                      <span className="font-bold text-primary font-mono text-[10px]">Lecturing Subjects</span>
                      {activeFaculty.subjects.length === 0 ? (
                        <p className="italic text-muted-foreground mt-1">No subjects assigned.</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1 mt-1 font-medium">
                          {activeFaculty.subjects.map((sub, idx) => (
                            <li key={idx}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="p-3 bg-muted/20 border rounded-xl space-y-1">
                      <span className="font-bold text-emerald-600 font-mono text-[10px]">Assigned Sections</span>
                      {activeFaculty.sections.length === 0 ? (
                        <p className="italic text-muted-foreground mt-1">No class sections assigned.</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1 mt-1 font-medium">
                          {activeFaculty.sections.map((sec, idx) => (
                            <li key={idx}>{sec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent activity timeline */}
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider font-mono border-b pb-1">
                    Recent Activities
                  </h4>
                  <div className="relative border-l-2 pl-4 ml-1.5 space-y-3 font-medium">
                    {activeFaculty.recentActivities.length === 0 ? (
                      <p className="italic text-muted-foreground">No recent transaction entries.</p>
                    ) : (
                      activeFaculty.recentActivities.map((act) => (
                        <div key={act.id} className="relative">
                          <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-primary" />
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[10px] font-mono text-primary font-bold">{act.timestamp}</span>
                          </div>
                          <p className="text-foreground mt-0.5">{act.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              <DialogFooter className="border-t pt-3">
                <Button onClick={() => setIsProfileOpen(false)}>Close Profile</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. ADD / EDIT FACULTY MODAL */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              {formMode === "add" ? "Register Faculty Member" : "Modify Faculty Profile"}
            </DialogTitle>
            <DialogDescription>
              Assign employee ID, contact details, designations, and academic departments.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="fac-name">Faculty Name*</Label>
                <Input
                  id="fac-name"
                  value={currentFormFaculty.name || ""}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                {formErrors.name && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-empid">Employee ID* (e.g. FAC1008)</Label>
                <Input
                  id="fac-empid"
                  value={currentFormFaculty.employeeId || ""}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, employeeId: e.target.value }))}
                  required
                  disabled={formMode === "edit"}
                />
                {formErrors.employeeId && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.employeeId}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-dept">Academic Department*</Label>
                <Select
                  value={currentFormFaculty.department || "CSE"}
                  onValueChange={(val: any) => setCurrentFormFaculty((prev) => ({ ...prev, department: val }))}
                >
                  <SelectTrigger id="fac-dept">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DEPARTMENTS_LIST.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-desg">Designation*</Label>
                <Select
                  value={currentFormFaculty.designation || "Assistant Professor"}
                  onValueChange={(val: any) => setCurrentFormFaculty((prev) => ({ ...prev, designation: val }))}
                >
                  <SelectTrigger id="fac-desg">
                    <SelectValue placeholder="Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-employment">Employment Model</Label>
                <Select
                  value={currentFormFaculty.employmentType || "Full-Time"}
                  onValueChange={(val: any) => setCurrentFormFaculty((prev) => ({ ...prev, employmentType: val }))}
                >
                  <SelectTrigger id="fac-employment">
                    <SelectValue placeholder="Employment Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Guest">Guest Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-qual">Highest Qualification* (e.g. Ph.D.)</Label>
                <Input
                  id="fac-qual"
                  value={currentFormFaculty.qualification || ""}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, qualification: e.target.value }))}
                  required
                />
                {formErrors.qualification && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.qualification}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-exp">Experience (Years)*</Label>
                <Input
                  id="fac-exp"
                  type="number"
                  value={currentFormFaculty.experience || 1}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, experience: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-join">Date of Joining</Label>
                <Input
                  id="fac-join"
                  type="date"
                  value={currentFormFaculty.joiningDate || ""}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, joiningDate: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-email">Contact Email*</Label>
                <Input
                  id="fac-email"
                  type="email"
                  value={currentFormFaculty.email || ""}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
                {formErrors.email && (
                  <p className="text-[10px] text-destructive font-semibold">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-phone">Contact Phone</Label>
                <Input
                  id="fac-phone"
                  value={currentFormFaculty.phone || ""}
                  onChange={(e) => setCurrentFormFaculty((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fac-status">Profile Status</Label>
                <Select
                  value={currentFormFaculty.status || "active"}
                  onValueChange={(val: any) => setCurrentFormFaculty((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger id="fac-status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
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
                {formMode === "add" ? "Save Profile" : "Update Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. SUBJECT ASSIGNMENT MODAL */}
      <Dialog open={isSubjectsModalOpen} onOpenChange={setIsSubjectsModalOpen}>
        <DialogContent className="max-w-lg text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Assign Curricular Subjects</DialogTitle>
            <DialogDescription>
              Assign specific course code syllabi to the selected faculty member's workflow registry.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              {/* Semester Selector */}
              <div className="space-y-1">
                <Label>Select Semester</Label>
                <Select value={assignSemester} onValueChange={setAssignSemester}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1</SelectItem>
                    <SelectItem value="Semester 3">Semester 3</SelectItem>
                    <SelectItem value="Semester 5">Semester 5</SelectItem>
                    <SelectItem value="Semester 7">Semester 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department Selector */}
              <div className="space-y-1">
                <Label>Filter Course Major</Label>
                <Select value={assignDept} onValueChange={setAssignDept}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select Major" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DEPARTMENTS_LIST.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Current Assigments Summary */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border/80 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Currently Assigned Subjects list
              </span>
              {selectedSubjectsList.length === 0 ? (
                <p className="italic text-muted-foreground text-[10px]">No subjects assigned yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSubjectsList.map((sub, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[9px] gap-1 font-medium bg-card">
                      {sub.split(" (")[0]}
                      <X className="size-2.5 text-red-500 cursor-pointer" onClick={() => handleToggleSubject(sub, 0)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Available Subjects for Assignment */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Available Subjects in {assignDept}
              </span>
              <div className="border rounded-xl max-h-[160px] overflow-y-auto pr-1">
                {filteredAvailableSubjects.length === 0 ? (
                  <p className="text-center p-3 text-muted-foreground italic">No subjects available.</p>
                ) : (
                  filteredAvailableSubjects.map((sub) => {
                    const fullName = `${sub.name} (${sub.code})`;
                    const isChecked = selectedSubjectsList.includes(fullName);

                    return (
                      <div
                        key={sub.code}
                        onClick={() => handleToggleSubject(fullName, sub.hours)}
                        className={`p-2.5 border-b last:border-b-0 cursor-pointer flex items-center justify-between hover:bg-muted/30 transition-colors ${
                          isChecked ? "bg-primary/5 text-primary font-semibold" : ""
                        }`}
                      >
                        <div>
                          <p className="font-bold text-[11px]">{sub.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{sub.code} &middot; {sub.credits} Credits &middot; {sub.hours} hrs/wk</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by click
                          className="accent-primary size-3.5 pointer-events-none"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setIsSubjectsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSubjects} className="bg-brand-gradient text-white font-semibold">
                Save Subject Allocations
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 8. CLASS ASSIGNMENT MODAL */}
      <Dialog open={isClassesModalOpen} onOpenChange={setIsClassesModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">Assign Academic Class Section</DialogTitle>
            <DialogDescription>
              Assign classroom lecture blocks, semester years, and branch sections to faculty timetable loops.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="class-year">Academic Year</Label>
                <Select value={classYear} onValueChange={setClassYear}>
                  <SelectTrigger id="class-year">
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026-27">2026-2027</SelectItem>
                    <SelectItem value="2025-26">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="class-sem">Academic Semester</Label>
                <Select value={classSem} onValueChange={setClassSem}>
                  <SelectTrigger id="class-sem">
                    <SelectValue placeholder="Select Sem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1</SelectItem>
                    <SelectItem value="Semester 3">Semester 3</SelectItem>
                    <SelectItem value="Semester 5">Semester 5</SelectItem>
                    <SelectItem value="Semester 7">Semester 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="class-sec">Branch Section*</Label>
                <Select value={classSection} onValueChange={setClassSection}>
                  <SelectTrigger id="class-sec">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Section A">Section A</SelectItem>
                    <SelectItem value="Section B">Section B</SelectItem>
                    <SelectItem value="Section C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="class-room">Classroom Location* (e.g. A-302)</Label>
                <Input
                  id="class-room"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="e.g. A-302"
                  required
                />
              </div>
            </div>

            {activeFaculty && (
              <div className="p-3 bg-muted/40 rounded-xl border border-border/80 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                  Current Assigned Classes
                </span>
                {activeFaculty.sections.length === 0 ? (
                  <p className="italic text-muted-foreground text-[10px] mt-0.5">No classes assigned yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeFaculty.sections.map((sec, idx) => (
                      <Badge key={idx} variant="outline" className="text-[9px] bg-card">
                        {sec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setIsClassesModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveClasses} className="bg-brand-gradient text-white font-semibold">
                Approve Class Assignment
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* 9. ANALYTICS & CHARTS PANEL */}
      <Panel
        title="Faculty Demographics & Workload Analytics"
        description="Comprehensive charts of faculty distribution, designation weight, experience limits, and workload balances."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Faculty per Department */}
          <div className="space-y-3.5 p-4 rounded-xl border border-border/60 bg-muted/15">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Department distribution</span>
              <span className="text-[10px] text-primary lowercase font-mono">Faculty members</span>
            </h4>
            <DonutChart data={deptDistributionData} centerLabel={String(metrics.total)} height={180} />
          </div>

          {/* Chart 2: Workload Distribution */}
          <div className="space-y-3.5 p-4 rounded-xl border border-border/60 bg-muted/15 lg:col-span-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Faculty Workload Range</span>
              <span className="text-[10px] text-success font-mono">Count by hours/week</span>
            </h4>
            <GroupedBarChart
              data={workloadLevelData as any}
              xKey="label"
              series={[{ key: "value", label: "Faculty Count" }]}
              height={180}
            />
          </div>
        </div>
      </Panel>

    </div>
  );
}
