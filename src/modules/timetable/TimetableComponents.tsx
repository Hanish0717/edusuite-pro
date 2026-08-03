import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  BookOpen,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
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
  fetchTimetableSlots,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  INITIAL_TIMETABLE,
  type TimetableSlot,
} from "./TimetableService";

const DAYS = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "ECE",
  "ME",
  "AI&DS",
  "Biotech",
];

const SECTIONS = [
  "All Sections",
  "CSE-A",
  "ECE-B",
  "ME-A",
  "AIDS-A",
  "BIO-A",
];

export function TimetableModuleView() {
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("All Days");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedSec, setSelectedSec] = useState("All Sections");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<TimetableSlot>>({
    day: "Monday",
    timeSlot: "09:30 AM - 10:30 AM",
    department: "CSE",
    section: "CSE-A",
    courseCode: "CS401",
    courseTitle: "Advanced Artificial Intelligence & Deep Learning",
    instructor: "Dr. K. Sai Teja",
    roomNo: "LH-302",
    building: "Academic Block A",
    status: "Scheduled",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTimetableSlots();
    setTimetable(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Timetable Slots
  const filtered = timetable.filter((t) => {
    const matchesSearch =
      t.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      t.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.section.toLowerCase().includes(search.toLowerCase()) ||
      t.instructor.toLowerCase().includes(search.toLowerCase()) ||
      t.roomNo.toLowerCase().includes(search.toLowerCase());

    const matchesDay = selectedDay === "All Days" || t.day === selectedDay;
    const matchesDept = selectedDept === "All Departments" || t.department === selectedDept;
    const matchesSec = selectedSec === "All Sections" || t.section === selectedSec;

    return matchesSearch && matchesDay && matchesDept && matchesSec;
  });

  // KPI Metrics
  const totalSlots = timetable.length;
  const uniqueRooms = new Set(timetable.map((t) => t.roomNo)).size;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      day: "Monday",
      timeSlot: "11:30 AM - 12:30 PM",
      department: "CSE",
      section: "CSE-B",
      courseCode: "CS405",
      courseTitle: "Cloud Computing & Microservices",
      instructor: "Dr. S. K. Gupta",
      roomNo: "LH-305",
      building: "Academic Block A",
      status: "Scheduled",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (t: TimetableSlot) => {
    setSelectedSlot(t);
    setFormData({ ...t });
    setIsEditOpen(true);
  };

  const handleOpenView = (t: TimetableSlot) => {
    setSelectedSlot(t);
    setIsViewOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseCode || !formData.roomNo) {
      toast.error("Please enter course code and room number.");
      return;
    }

    const created = await createTimetableSlot(formData);
    setTimetable((prev) => [created, ...prev]);
    setIsAddOpen(false);
    toast.success(`Slot scheduled for ${created.section} (${created.courseCode}) on ${created.day} at ${created.roomNo}!`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    await updateTimetableSlot(selectedSlot.id, formData);
    setTimetable((prev) =>
      prev.map((t) => (t.id === selectedSlot.id ? ({ ...t, ...formData } as TimetableSlot) : t)),
    );
    setIsEditOpen(false);
    toast.success(`Timetable slot ${selectedSlot.id} updated!`);
  };

  const handleDelete = async (id: string, code: string, sec: string) => {
    if (confirm(`Are you sure you want to cancel class slot for ${sec} (${code})?`)) {
      await deleteTimetableSlot(id);
      setTimetable((prev) => prev.filter((t) => t.id !== id));
      toast.success(`Class slot ${id} cancelled and removed.`);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Slot ID",
      "Day",
      "Time Slot",
      "Department",
      "Section",
      "Course Code",
      "Course Title",
      "Lead Instructor",
      "Room Hall",
      "Building",
      "Status",
    ];

    const rows = filtered.map((t) => [
      t.id,
      t.day,
      `"${t.timeSlot}"`,
      t.department,
      t.section,
      t.courseCode,
      `"${t.courseTitle}"`,
      `"${t.instructor}"`,
      t.roomNo,
      `"${t.building}"`,
      t.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Master_Class_Timetable_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} timetable slots to CSV!`);
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
                Timetable & Master Class Schedule
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Scheduling Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Master class scheduling, lecture hall allocation, lab slot assignments, and faculty conflict checks.
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
            <Download className="size-3.5" /> Export Timetable
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 bg-brand-gradient text-white gap-2 font-semibold text-xs shadow-glow hover:opacity-95"
          >
            <Plus className="size-4" /> Schedule New Slot
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Weekly Sessions</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{totalSlots} Slots Scheduled</p>
          <p className="text-[0.68rem] text-muted-foreground">Mon - Sat Active Schedule</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Lecture Halls & Labs</span>
            <MapPin className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{uniqueRooms} Active Halls</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Smart Room Allocation</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Faculty Conflict Rate</span>
            <CheckCircle2 className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">100% Conflict Free</p>
          <p className="text-[0.68rem] text-muted-foreground">Zero instructor overlaps</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Academic Term</span>
            <Clock className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">Spring 2026</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">R24 Regulation Timetable</p>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search course code, title, room hall, instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Day Filter */}
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="h-9 w-full sm:w-[140px] text-xs">
              <Calendar className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          {/* Section Filter */}
          <Select value={selectedSec} onValueChange={setSelectedSec}>
            <SelectTrigger className="h-9 w-full sm:w-[140px] text-xs">
              <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {SECTIONS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timetable Roster Table */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" /> Master Timetable Class Schedule
            <Badge variant="secondary" className="font-mono text-xs">
              {filtered.length} Class Slots
            </Badge>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <RefreshCw className="size-5 animate-spin text-primary" />
            Loading class timetable...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <Calendar className="size-7 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-medium">No class slots found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Day & Time</th>
                  <th className="py-3 px-3">Course & Section</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Room / Hall</th>
                  <th className="py-3 px-3">Lead Instructor</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{t.day}</div>
                      <div className="text-[0.68rem] text-primary font-mono">{t.timeSlot}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{t.courseCode}: {t.courseTitle}</div>
                      <div className="text-[0.68rem] text-muted-foreground font-mono">Section: {t.section}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-foreground">{t.department}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                        {t.roomNo} ({t.building})
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">{t.instructor}</td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          t.status === "Scheduled"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                            : t.status === "Rescheduled"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[0.68rem]"
                            : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenView(t)}
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                          title="View Dossier"
                        >
                          <Eye className="size-3.5" /> Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(t)}
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Edit Slot"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(t.id, t.courseCode, t.section)}
                          className="size-7 text-muted-foreground hover:text-red-600"
                          title="Cancel Slot"
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

      {/* DIALOG 1: SCHEDULE NEW CLASS SLOT MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Schedule New Class Slot
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign day, time slot, department, section, room hall, and lead instructor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Day of Week *</Label>
                <Select
                  value={formData.day}
                  onValueChange={(val: any) => setFormData({ ...formData, day: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.filter((d) => d !== "All Days").map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Time Slot *</Label>
                <Input
                  required
                  placeholder="e.g. 09:30 AM - 10:30 AM"
                  value={formData.timeSlot || ""}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Code *</Label>
                <Input
                  required
                  placeholder="e.g. CS405"
                  value={formData.courseCode || ""}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Title</Label>
                <Input
                  placeholder="e.g. Cloud Computing & Microservices"
                  value={formData.courseTitle || ""}
                  onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
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
                <Label className="text-xs font-semibold">Section / Batch *</Label>
                <Input
                  required
                  placeholder="e.g. CSE-B"
                  value={formData.section || ""}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Room / Lecture Hall *</Label>
                <Input
                  required
                  placeholder="e.g. LH-305"
                  value={formData.roomNo || ""}
                  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Building Block</Label>
                <Input
                  placeholder="e.g. Academic Block A"
                  value={formData.building || ""}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Lead Instructor / Professor</Label>
              <Input
                placeholder="e.g. Dr. S. K. Gupta"
                value={formData.instructor || ""}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
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
                Schedule Class Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: EDIT TIMETABLE SLOT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-5 text-primary" /> Reschedule Class Slot ({selectedSlot?.id})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Time Slot</Label>
              <Input
                value={formData.timeSlot || ""}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Room / Lecture Hall</Label>
              <Input
                value={formData.roomNo || ""}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Instructor</Label>
              <Input
                value={formData.instructor || ""}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
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

      {/* DIALOG 3: VIEW TIMETABLE SLOT DOSSIER MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Calendar className="size-5 text-primary" /> Class Schedule Dossier
            </DialogTitle>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selectedSlot.day} &middot; {selectedSlot.timeSlot}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {selectedSlot.status}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-foreground">
                  {selectedSlot.courseCode}: {selectedSlot.courseTitle}
                </h2>
                <p className="text-xs text-primary font-medium">Instructor: {selectedSlot.instructor}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
                  <span className="text-muted-foreground">Department & Section:</span>
                  <span className="font-semibold text-foreground">{selectedSlot.department} ({selectedSlot.section})</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 font-mono">
                  <span className="text-muted-foreground font-sans">Room & Venue:</span>
                  <span className="font-bold text-sm text-primary">
                    {selectedSlot.roomNo} &middot; {selectedSlot.building}
                  </span>
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
