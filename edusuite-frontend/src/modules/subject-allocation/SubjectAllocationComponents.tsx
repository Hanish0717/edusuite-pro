import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Users,
  BookOpen,
  ClipboardList,
  Plus,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  XCircle,
  BarChart3,
} from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
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
import { useAcademic } from "@/context/academic-context";
import { cn } from "@/lib/utils";

import {
  getSubjectAllocations,
  getFacultyByDept,
  getSubjectsByDept,
  assignFacultyToSubject,
  deleteAllocation,
  updateAllocationStatus,
  getSemestersByDept,
  type SubjectAllocation,
  type AllocationFaculty,
  type AllocationSubject,
} from "./SubjectAllocationService";

import { getFacultyWorkload, type FacultyWorkload, type WorkloadStatus } from "./WorkloadService";

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-[320px] bg-muted rounded-2xl" />
      <div className="h-[280px] bg-muted rounded-2xl" />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="p-10 text-center border border-dashed border-border rounded-2xl space-y-2 bg-card">
      <ClipboardList className="size-9 text-muted-foreground/30 mx-auto" />
      <p className="text-sm font-semibold text-muted-foreground">
        {message ?? "No allocations found. Adjust filters or assign a new subject."}
      </p>
    </div>
  );
}

// ─── Workload Status Badge ────────────────────────────────────────────────────
const WORKLOAD_BADGE: Record<WorkloadStatus, { cls: string; icon: React.ElementType }> = {
  Underloaded: { cls: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20", icon: Clock },
  Normal: { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20", icon: CheckCircle2 },
  "Near Capacity": { cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20", icon: AlertTriangle },
  Overloaded: { cls: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20", icon: XCircle },
};

// ─── Dashboard Summary Cards ──────────────────────────────────────────────────
interface SummaryProps {
  allocations: SubjectAllocation[];
  workloads: FacultyWorkload[];
  subjectsTotal: number;
}

export function DashboardSummaryCards({ allocations, workloads, subjectsTotal }: SummaryProps) {
  const assignedSubjectIds = new Set(allocations.map((a) => a.subjectId));
  const unassigned = subjectsTotal - assignedSubjectIds.size;
  const highWorkload = workloads.filter((w) => w.status === "Near Capacity" || w.status === "Overloaded").length;
  const available = workloads.filter((w) => w.remainingCapacity > 0).length;

  const cards = [
    { label: "Total Faculty", value: workloads.length, color: "text-primary" },
    { label: "Total Subjects", value: subjectsTotal, color: "text-violet-600" },
    { label: "Allocations", value: allocations.length, color: "text-emerald-600" },
    { label: "Unassigned", value: unassigned, color: "text-amber-600" },
    { label: "High Workload", value: highWorkload, color: "text-red-600" },
    { label: "Available", value: available, color: "text-sky-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <span className="text-[0.62rem] font-bold text-muted-foreground uppercase block">{c.label}</span>
          <p className={cn("text-2xl font-bold font-mono", c.color)}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Search & Filter Bar ──────────────────────────────────────────────────────
interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  semesterFilter: string;
  onSemester: (v: string) => void;
  sectionFilter: string;
  onSection: (v: string) => void;
  typeFilter: string;
  onType: (v: string) => void;
  statusFilter: string;
  onStatus: (v: string) => void;
  semesters: string[];
}

export function SearchFilterBar({ search, onSearch, semesterFilter, onSemester, sectionFilter, onSection, typeFilter, onType, statusFilter, onStatus, semesters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input placeholder="Search faculty, subject, code..." value={search} onChange={(e) => onSearch(e.target.value)} className="pl-9 h-9 text-xs" />
      </div>

      <Select value={semesterFilter} onValueChange={onSemester}>
        <SelectTrigger className="h-9 w-[150px] text-xs">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">All Semesters</SelectItem>
          {semesters.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={sectionFilter} onValueChange={onSection}>
        <SelectTrigger className="h-9 w-[110px] text-xs">
          <SelectValue placeholder="Section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">All Sections</SelectItem>
          {["A", "B", "C", "D"].map((s) => <SelectItem key={s} value={s} className="text-xs">Section {s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onType}>
        <SelectTrigger className="h-9 w-[110px] text-xs">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">All Types</SelectItem>
          <SelectItem value="Theory" className="text-xs">Theory</SelectItem>
          <SelectItem value="Lab" className="text-xs">Lab</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatus}>
        <SelectTrigger className="h-9 w-[110px] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">All Status</SelectItem>
          <SelectItem value="Active" className="text-xs">Active</SelectItem>
          <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
          <SelectItem value="Draft" className="text-xs">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Assign Dialog ────────────────────────────────────────────────────────────
interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (payload: { facultyId: string; subjectId: string; semester: string; section: string; academicYear: string }) => Promise<void>;
  faculty: AllocationFaculty[];
  subjects: AllocationSubject[];
  semesters: string[];
  loading: boolean;
}

export function AssignDialog({ open, onClose, onAssign, faculty, subjects, semesters, loading }: AssignDialogProps) {
  const [facultyId, setFacultyId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [academicYear] = useState("2025-26");

  const filteredSubjects = useMemo(
    () => semester ? subjects.filter((s) => s.semester === semester) : subjects,
    [subjects, semester]
  );

  const handleSubmit = async () => {
    if (!facultyId || !subjectId || !semester || !section) {
      toast.error("Please fill in all required fields.");
      return;
    }
    await onAssign({ facultyId, subjectId, semester, section, academicYear });
    setFacultyId(""); setSubjectId(""); setSemester(""); setSection("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <UserCheck className="size-4 text-primary" />
            Assign Faculty to Subject
          </DialogTitle>
          <DialogDescription className="text-xs">
            All assignments must belong to the currently selected department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Semester first to filter subjects */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Semester *</Label>
            <Select value={semester} onValueChange={(v) => { setSemester(v); setSubjectId(""); }}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Subject *</Label>
            <Select value={subjectId} onValueChange={setSubjectId} disabled={!semester}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={semester ? "Select subject" : "Select semester first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubjects.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.code} — {s.name} ({s.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Faculty *</Label>
            <Select value={facultyId} onValueChange={setFacultyId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">
                    {f.fullName} — {f.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Section *</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((s) => <SelectItem key={s} value={s} className="text-xs">Section {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Academic Year</Label>
              <Input value={academicYear} readOnly className="h-9 text-xs bg-muted/30" />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={loading} className="text-xs">
            {loading ? <RefreshCw className="size-3.5 animate-spin mr-1" /> : <Plus className="size-3.5 mr-1" />}
            Assign Faculty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Allocation Table ─────────────────────────────────────────────────────────
interface TableProps {
  allocations: SubjectAllocation[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SubjectAllocation["status"]) => void;
  loading: boolean;
}

export function AllocationTable({ allocations, onDelete, onStatusChange, loading }: TableProps) {
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [allocations]);

  const totalPages = Math.ceil(allocations.length / PAGE_SIZE);
  const paginated = allocations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <SkeletonLoader />;
  if (allocations.length === 0) return <EmptyState />;

  return (
    <Panel title="Subject Allocations" description="All faculty–subject mappings for the selected department.">
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.62rem]">
            <tr>
              <th className="p-3">Faculty</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Semester / Section</th>
              <th className="p-3">Type</th>
              <th className="p-3">Credits / Hrs</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginated.map((alloc) => (
              <tr key={alloc.id} className="hover:bg-muted/15 transition-colors">
                <td className="p-3">
                  <p className="font-semibold text-foreground">{alloc.facultyName}</p>
                  <p className="text-[0.65rem] text-muted-foreground font-mono">{alloc.empId}</p>
                </td>
                <td className="p-3">
                  <p className="font-semibold text-foreground">{alloc.subjectName}</p>
                  <p className="text-[0.65rem] text-muted-foreground font-mono">{alloc.subjectCode}</p>
                </td>
                <td className="p-3">
                  <p className="font-semibold">{alloc.semester}</p>
                  <p className="text-[0.65rem] text-muted-foreground">Section {alloc.section} · AY {alloc.academicYear}</p>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={cn("text-[0.62rem] font-semibold border", alloc.type === "Lab" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20")}>
                    {alloc.type === "Lab" ? <FlaskConical className="size-2.5 mr-0.5" /> : <BookOpen className="size-2.5 mr-0.5" />}
                    {alloc.type}
                  </Badge>
                </td>
                <td className="p-3 font-mono text-muted-foreground">
                  {alloc.credits} cr · {alloc.weeklyHours} h/wk
                </td>
                <td className="p-3">
                  <select
                    value={alloc.status}
                    onChange={(e) => onStatusChange(alloc.id, e.target.value as SubjectAllocation["status"])}
                    className="text-[0.68rem] rounded-lg border border-border bg-card px-2 py-1 font-semibold cursor-pointer focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
                  </select>
                </td>
                <td className="p-3 text-right pr-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(alloc.id)}
                    className="h-7 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 px-1">
        <span className="text-muted-foreground">
          Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages || 1}</span> ·{" "}
          <span className="font-semibold text-foreground">{allocations.length}</span> total allocations
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-8 text-xs">
            <ChevronLeft className="size-3.5 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="h-8 text-xs">
            Next <ChevronRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Panel>
  );
}

// ─── Workload Panel ───────────────────────────────────────────────────────────
interface WorkloadPanelProps {
  workloads: FacultyWorkload[];
}

export function WorkloadPanel({ workloads }: WorkloadPanelProps) {
  return (
    <Panel
      title="Faculty Workload Monitor"
      description="Live workload analysis computed from current subject allocations."
    >
      <div className="space-y-3">
        {workloads.map((w) => {
          const { cls, icon: Icon } = WORKLOAD_BADGE[w.status];
          const utilPct = Math.min(100, Math.round((w.weeklyTeachingHours / w.weeklyCapacity) * 100));

          return (
            <div key={w.facultyId} className="p-3 rounded-xl border border-border/70 bg-card space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-xs text-foreground">{w.facultyName}</p>
                  <p className="text-[0.65rem] text-muted-foreground font-mono">{w.empId} · {w.designation}</p>
                </div>
                <Badge variant="outline" className={cn("text-[0.62rem] font-bold border shrink-0", cls)}>
                  <Icon className="size-2.5 mr-0.5" />
                  {w.status}
                </Badge>
              </div>

              <Progress value={utilPct} className="h-1.5" />

              <div className="grid grid-cols-4 gap-1.5 text-center text-[0.62rem]">
                <div className="rounded-lg bg-muted/40 p-1.5">
                  <p className="font-bold text-primary">{w.totalSubjects}</p>
                  <p className="text-muted-foreground">Subjects</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-1.5">
                  <p className="font-bold text-blue-600">{w.theorySubjects}</p>
                  <p className="text-muted-foreground">Theory</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-1.5">
                  <p className="font-bold text-emerald-600">{w.labSubjects}</p>
                  <p className="text-muted-foreground">Labs</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-1.5">
                  <p className="font-bold text-amber-600">{w.weeklyTeachingHours}/{w.weeklyCapacity}</p>
                  <p className="text-muted-foreground">Hrs/Wk</p>
                </div>
              </div>

              {w.assignedSemesters.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {w.assignedSemesters.map((sem) => (
                    <span key={sem} className="text-[0.58rem] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono">{sem}</span>
                  ))}
                  {w.assignedSections.map((sec) => (
                    <span key={sec} className="text-[0.58rem] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">Sec {sec}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {workloads.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground">No faculty data available.</div>
        )}
      </div>
    </Panel>
  );
}

// ─── Main Module View ─────────────────────────────────────────────────────────
export function SubjectAllocationModuleView() {
  const { selectedDepartment } = useAcademic();

  const [allocations, setAllocations] = useState<SubjectAllocation[]>([]);
  const [faculty, setFaculty] = useState<AllocationFaculty[]>([]);
  const [subjects, setSubjects] = useState<AllocationSubject[]>([]);
  const [workloads, setWorkloads] = useState<FacultyWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const semesters = useMemo(() => getSemestersByDept(selectedDepartment), [selectedDepartment]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [allocResult, facResult, subResult] = await Promise.all([
        getSubjectAllocations({ department: selectedDepartment }),
        getFacultyByDept(selectedDepartment),
        getSubjectsByDept(selectedDepartment),
      ]);
      setAllocations(allocResult);
      setFaculty(facResult);
      setSubjects(subResult);
      const wl = await getFacultyWorkload(selectedDepartment, allocResult);
      setWorkloads(wl);
    } catch {
      toast.error("Failed to load allocation data.");
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    loadData();
    setSearch("");
    setSemesterFilter("all");
    setSectionFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  }, [loadData]);

  const filteredAllocations = useMemo(() => {
    return allocations.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.facultyName.toLowerCase().includes(q) || a.subjectName.toLowerCase().includes(q) || a.subjectCode.toLowerCase().includes(q);
      const matchSem = semesterFilter === "all" || a.semester === semesterFilter;
      const matchSec = sectionFilter === "all" || a.section === sectionFilter;
      const matchType = typeFilter === "all" || a.type === typeFilter;
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchSem && matchSec && matchType && matchStatus;
    });
  }, [allocations, search, semesterFilter, sectionFilter, typeFilter, statusFilter]);

  const handleAssign = async (payload: Parameters<typeof assignFacultyToSubject>[0]) => {
    setAssigning(true);
    try {
      const result = await assignFacultyToSubject(payload);
      if (result.success && result.allocation) {
        const updated = [...allocations, result.allocation];
        setAllocations(updated);
        const wl = await getFacultyWorkload(selectedDepartment, updated);
        setWorkloads(wl);
        toast.success(`Successfully assigned ${result.allocation.facultyName} to ${result.allocation.subjectCode}.`);
        setShowAssignDialog(false);
      } else {
        toast.error(result.error ?? "Assignment failed. Please check validation rules.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setAssigning(false);
    }
  };

  const handleDelete = async (id: string) => {
    const alloc = allocations.find((a) => a.id === id);
    if (!alloc) return;
    if (!confirm(`Remove allocation: ${alloc.facultyName} → ${alloc.subjectCode}?`)) return;
    await deleteAllocation(id);
    const updated = allocations.filter((a) => a.id !== id);
    setAllocations(updated);
    const wl = await getFacultyWorkload(selectedDepartment, updated);
    setWorkloads(wl);
    toast.success("Allocation removed successfully.");
  };

  const handleStatusChange = async (id: string, status: SubjectAllocation["status"]) => {
    await updateAllocationStatus(id, status);
    setAllocations((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    toast.success(`Status updated to "${status}".`);
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Subject Allocation & Workload</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage faculty–subject assignments and monitor teaching loads for the selected department.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-mono text-xs">
            Dept: {selectedDepartment}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadData} className="h-8 text-xs">
            <RefreshCw className="size-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAssignDialog(true)} className="h-8 text-xs">
            <Plus className="size-3.5 mr-1" /> Assign Faculty
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <DashboardSummaryCards allocations={allocations} workloads={workloads} subjectsTotal={subjects.length} />

      {/* Search + Filters */}
      <SearchFilterBar
        search={search} onSearch={setSearch}
        semesterFilter={semesterFilter} onSemester={setSemesterFilter}
        sectionFilter={sectionFilter} onSection={setSectionFilter}
        typeFilter={typeFilter} onType={setTypeFilter}
        statusFilter={statusFilter} onStatus={setStatusFilter}
        semesters={semesters}
      />

      {/* Main Grid: Table + Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AllocationTable
            allocations={filteredAllocations}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        </div>
        <div>
          <WorkloadPanel workloads={workloads} />
        </div>
      </div>

      {/* Assign Dialog */}
      <AssignDialog
        open={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        onAssign={handleAssign}
        faculty={faculty}
        subjects={subjects}
        semesters={semesters}
        loading={assigning}
      />
    </div>
  );
}
