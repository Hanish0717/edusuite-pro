import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Mail,
  Calendar,
  Phone,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Download,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  UserX,
  Eye,
  Filter,
  RefreshCw,
  MoreVertical,
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
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  INITIAL_EMPLOYEES,
  type Employee,
} from "./EmployeeManagementService";

const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "ECE",
  "ME",
  "EEE",
  "CIVIL",
  "IT",
  "AI&DS",
  "Admin",
];

const EMPLOYMENT_TYPES = [
  "All Types",
  "Full Time",
  "Part Time",
  "Contract",
  "Guest Faculty",
];

export function EmployeeManagementModuleView() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedType, setSelectedType] = useState("All Types");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    department: "CSE",
    designation: "Assistant Professor",
    employmentType: "Full Time",
    qualification: "M.Tech / Ph.D",
    salaryGrade: "Level 10",
    status: "Active",
    roleFlag: "isMentor",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEmployees();
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.qualification.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      selectedDept === "All Departments" || emp.department === selectedDept;

    const matchesType =
      selectedType === "All Types" || emp.employmentType === selectedType;

    return matchesSearch && matchesDept && matchesType;
  });

  // Analytics Counts
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const onLeaveCount = employees.filter((e) => e.status === "On Leave").length;
  const deptsCount = new Set(employees.map((e) => e.department)).size;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "+91 ",
      department: "CSE",
      designation: "Assistant Professor",
      employmentType: "Full Time",
      qualification: "M.Tech in Computer Science",
      salaryGrade: "Level 10",
      status: "Active",
      roleFlag: "isMentor",
      joinDate: new Date().toISOString().split("T")[0],
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({ ...emp });
    setIsEditDialogOpen(true);
  };

  const handleOpenView = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsViewDialogOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide both name and email address.");
      return;
    }
    const created = await createEmployee(formData);
    setEmployees((prev) => [created, ...prev]);
    setIsAddDialogOpen(false);
    toast.success(`Employee "${created.name}" created successfully with ID ${created.id}!`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    await updateEmployee(selectedEmployee.id, formData);
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id ? ({ ...emp, ...formData } as Employee) : emp,
      ),
    );
    setIsEditDialogOpen(false);
    toast.success(`Staff profile for "${formData.name}" updated successfully!`);
  };

  const handleToggleStatus = async (emp: Employee) => {
    const nextStatus = emp.status === "Active" ? "On Leave" : "Active";
    await updateEmployee(emp.id, { status: nextStatus });
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: nextStatus } : e)),
    );
    toast.info(`Status of ${emp.name} changed to ${nextStatus}.`);
  };

  const handleDelete = async (emp: Employee) => {
    if (confirm(`Are you sure you want to remove ${emp.name} (${emp.id}) from the employee directory?`)) {
      await deleteEmployee(emp.id);
      setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
      toast.success(`Employee ${emp.name} removed from system.`);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Type",
      "Qualification",
      "Salary Grade",
      "Status",
      "Join Date",
    ];
    const rows = filtered.map((e) => [
      e.id,
      `"${e.name}"`,
      e.email,
      `"${e.phone}"`,
      e.department,
      `"${e.designation}"`,
      e.employmentType,
      `"${e.qualification}"`,
      `"${e.salaryGrade}"`,
      e.status,
      e.joinDate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Employee_Roster_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} employee records to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Users className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                Employee Management Module
                <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                  HRMS Core
                </Badge>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Comprehensive staff registry, department assignments, qualifications, and employment records.
              </p>
            </div>
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
            onClick={handleOpenAdd}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <UserPlus className="size-4" /> Add New Employee
          </Button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Total Staff</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{totalCount}</div>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Active roster record</p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Active Duty</span>
            <CheckCircle className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{activeCount}</div>
          <p className="text-[0.68rem] text-muted-foreground">Present in department</p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>On Leave</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{onLeaveCount}</div>
          <p className="text-[0.68rem] text-muted-foreground">Approved leave active</p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Departments</span>
            <Building2 className="size-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600">{deptsCount}</div>
          <p className="text-[0.68rem] text-muted-foreground">Engineering & Admin</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, ID, designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Department Filter */}
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="h-9 w-full sm:w-[170px] text-xs" aria-label="Department Filter">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-xs">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employment Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs" aria-label="Employment Type Filter">
              <Briefcase className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="text-xs">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/40 self-end md:self-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="size-7 rounded-md"
            title="Grid View"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("table")}
            className="size-7 rounded-md"
            title="Table View"
          >
            <List className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Roster View (Grid vs Table) */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
          <RefreshCw className="size-5 animate-spin text-primary" />
          Fetching staff directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/50 space-y-3">
          <Users className="size-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">No employees found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No employee records matched your current search filters. Try adjusting your search query or department filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedDept("All Departments");
              setSelectedType("All Types");
            }}
            className="text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Card Top Header */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-[0.68rem] bg-muted">
                    {emp.id}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={
                        emp.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                          : emp.status === "On Leave"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                          : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                      }
                    >
                      {emp.status}
                    </Badge>
                  </div>
                </div>

                {/* Main Name & Title */}
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {emp.name}
                  </h3>
                  <p className="text-xs text-primary font-medium">{emp.designation}</p>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-3.5 text-primary/70 shrink-0" />
                    <span>Dept: </span>
                    <span className="font-mono font-semibold text-foreground">{emp.department}</span>
                    <Badge variant="outline" className="ml-auto text-[0.65rem] px-1.5 py-0">
                      {emp.employmentType}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <Mail className="size-3.5 text-primary/70 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-primary/70 shrink-0" />
                    <span>{emp.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <GraduationCap className="size-3.5 text-primary/70 shrink-0" />
                    <span className="truncate">{emp.qualification}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-primary/70 shrink-0" />
                    <span>Joined: {emp.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenView(emp)}
                  className="h-8 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="size-3.5" /> View
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(emp)}
                    title={`Toggle Status (Current: ${emp.status})`}
                    className="h-8 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 px-2"
                  >
                    {emp.status === "Active" ? "Set Leave" : "Activate"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(emp)}
                    className="size-8 text-muted-foreground hover:text-primary"
                    title="Edit Employee"
                  >
                    <Edit className="size-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(emp)}
                    className="size-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                    title="Delete Employee"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="p-3.5 pl-4">Employee ID</th>
                  <th className="p-3.5">Name & Email</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Designation</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Salary Grade</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-foreground">
                      {emp.id}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{emp.name}</div>
                      <div className="text-[0.68rem] text-muted-foreground">{emp.email}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="font-mono text-[0.68rem]">
                        {emp.department}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-medium text-foreground">{emp.designation}</td>
                    <td className="p-3.5 text-muted-foreground">{emp.employmentType}</td>
                    <td className="p-3.5 font-mono text-muted-foreground">{emp.salaryGrade}</td>
                    <td className="p-3.5">
                      <Badge
                        className={
                          emp.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                            : emp.status === "On Leave"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                            : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                        }
                      >
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenView(emp)}
                          className="size-7 text-muted-foreground hover:text-foreground"
                          title="View Profile"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(emp)}
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Edit Employee"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(emp)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Delete Employee"
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

      {/* DIALOG 1: ADD EMPLOYEE MODAL */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="size-5 text-primary" /> Add New Staff Member
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new faculty or administrative employee in the ERP directory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Email *</Label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. ramesh@college.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Phone</Label>
                <Input
                  placeholder="+91 98765 00000"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => setFormData({ ...formData, department: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-xs">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Input
                  placeholder="e.g. Assistant Professor"
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(val: any) => setFormData({ ...formData, employmentType: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.filter((t) => t !== "All Types").map((type) => (
                      <SelectItem key={type} value={type} className="text-xs">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Highest Qualification</Label>
                <Input
                  placeholder="e.g. Ph.D. in Computer Science"
                  value={formData.qualification || ""}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Salary Grade</Label>
                <Input
                  placeholder="e.g. Level 10 (Asst Prof)"
                  value={formData.salaryGrade || ""}
                  onChange={(e) => setFormData({ ...formData, salaryGrade: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Joining Date</Label>
                <Input
                  type="date"
                  value={formData.joinDate || ""}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active" className="text-xs">
                      Active
                    </SelectItem>
                    <SelectItem value="On Leave" className="text-xs">
                      On Leave
                    </SelectItem>
                    <SelectItem value="Terminated" className="text-xs">
                      Terminated
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
                Register Staff Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT EMPLOYEE MODAL */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-5 text-primary" /> Edit Staff Details ({selectedEmployee?.id})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify employee record, department assignments, and contact information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name</Label>
                <Input
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Email</Label>
                <Input
                  required
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Phone</Label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => setFormData({ ...formData, department: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-xs">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Input
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(val: any) => setFormData({ ...formData, employmentType: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.filter((t) => t !== "All Types").map((type) => (
                      <SelectItem key={type} value={type} className="text-xs">
                        {type}
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
                <Label className="text-xs font-semibold">Salary Grade</Label>
                <Input
                  value={formData.salaryGrade || ""}
                  onChange={(e) => setFormData({ ...formData, salaryGrade: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active" className="text-xs">
                      Active
                    </SelectItem>
                    <SelectItem value="On Leave" className="text-xs">
                      On Leave
                    </SelectItem>
                    <SelectItem value="Terminated" className="text-xs">
                      Terminated
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
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

      {/* DIALOG 3: VIEW EMPLOYEE PROFILE MODAL */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="size-5 text-primary" /> Staff Profile Card
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedEmployee.id}
                  </Badge>
                  <Badge
                    className={
                      selectedEmployee.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }
                  >
                    {selectedEmployee.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-foreground">{selectedEmployee.name}</h2>
                <p className="text-xs text-primary font-medium">{selectedEmployee.designation}</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="size-3.5 text-primary" /> Department:
                  </span>
                  <span className="font-mono font-bold text-foreground">{selectedEmployee.department}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="size-3.5 text-primary" /> Email:
                  </span>
                  <span className="font-medium text-foreground">{selectedEmployee.email}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="size-3.5 text-primary" /> Phone:
                  </span>
                  <span className="font-mono text-foreground">{selectedEmployee.phone}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="size-3.5 text-primary" /> Employment Type:
                  </span>
                  <span className="font-medium text-foreground">{selectedEmployee.employmentType}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="size-3.5 text-primary" /> Qualification:
                  </span>
                  <span className="font-medium text-foreground">{selectedEmployee.qualification}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-primary" /> Salary Grade:
                  </span>
                  <span className="font-mono text-foreground">{selectedEmployee.salaryGrade}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-3.5 text-primary" /> Joined Date:
                  </span>
                  <span className="font-mono text-foreground">{selectedEmployee.joinDate}</span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full text-xs"
                >
                  Close Profile
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
