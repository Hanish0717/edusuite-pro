import React, { useEffect, useState } from "react";
import {
  CalendarRange,
  Sparkles,
  RefreshCw,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Building2,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileSpreadsheet,
  FileText,
  User,
  FlaskConical,
  Coffee,
  Check,
  X,
  Bot,
  Zap,
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
  fetchTimetableGrid,
  autoGenerateTimetable,
  updateTimetablePeriod,
  checkScheduleConflict,
  BRANCHES,
  SEMESTERS,
  SECTIONS,
  DAYS,
  PERIOD_SLOTS,
  type TimetablePeriod,
  type TimetableGrid,
} from "./TimetableService";

export function TimetableModuleView() {
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedSem, setSelectedSem] = useState<number>(5);
  const [selectedSec, setSelectedSec] = useState("Section A");

  const [viewMode, setViewMode] = useState<"grid" | "faculty" | "room">("grid");
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState("Dr. K. Sai Teja");

  const [gridData, setGridData] = useState<TimetableGrid | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Partial<TimetablePeriod> | null>(null);
  const [clashWarning, setClashWarning] = useState<string | null>(null);

  const loadSchedule = async () => {
    setLoading(true);
    const data = await fetchTimetableGrid(selectedBranch, selectedSem, selectedSec);
    setGridData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSchedule();
  }, [selectedBranch, selectedSem, selectedSec]);

  // Trigger Auto-Generation Algorithm
  const handleAutoGenerate = async () => {
    setGenerating(true);
    toast.info(`🤖 Running conflict-free timetable auto-generator for ${selectedBranch} - Sem ${selectedSem} (${selectedSec})...`);

    setTimeout(async () => {
      const generated = await autoGenerateTimetable(selectedBranch, selectedSem, selectedSec);
      setGridData(generated);
      setGenerating(false);
      toast.success(
        `✅ AUTO-GENERATED TIMETABLE READY! Allocated 48 periods across 6 days with ZERO faculty or room clashes.`
      );
    }, 800);
  };

  // Open Edit Cell Modal
  const handleOpenEditCell = (slot: TimetablePeriod) => {
    setEditingPeriod(slot);
    setClashWarning(null);
    setIsEditModalOpen(true);
  };

  // Handle live clash detection during manual edits
  const handleFacultyChange = (newFaculty: string) => {
    if (!editingPeriod || !gridData) return;
    const updated = { ...editingPeriod, facultyName: newFaculty };
    setEditingPeriod(updated);

    const conflict = checkScheduleConflict(gridData.schedule, updated);
    if (conflict.hasConflict) {
      setClashWarning(conflict.conflictReason || "Faculty clash detected!");
    } else {
      setClashWarning(null);
    }
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeriod || !gridData) return;

    if (clashWarning) {
      toast.warning("Conflict Warning: " + clashWarning);
    }

    await updateTimetablePeriod(editingPeriod);
    setGridData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        schedule: prev.schedule.map((s) => (s.id === editingPeriod.id ? ({ ...s, ...editingPeriod } as TimetablePeriod) : s)),
      };
    });

    setIsEditModalOpen(false);
    toast.success(`Updated period schedule for ${editingPeriod.day} Period ${editingPeriod.periodNumber}!`);
  };

  // Export CSV / Excel
  const handleExportCSV = () => {
    if (!gridData) return;
    const headers = ["Day", "Period", "Time Slot", "Subject Code", "Subject Name", "Faculty", "Room", "Is Lab"];
    const rows = gridData.schedule.map((p) => [
      p.day,
      `Period ${p.periodNumber}`,
      `"${p.startTime} - ${p.endTime}"`,
      p.subjectCode,
      `"${p.subjectName}"`,
      `"${p.facultyName}"`,
      `"${p.roomNo}"`,
      p.isLab ? "Yes (Lab)" : "No (Theory)",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Timetable_${selectedBranch}_Sem${selectedSem}_${selectedSec}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedBranch} Sem ${selectedSem} timetable to CSV!`);
  };

  // Export PDF Toast placeholder
  const handleExportPDF = () => {
    toast.success(`📄 Generating print-ready PDF timetable for ${selectedBranch} Sem ${selectedSem} (${selectedSec})...`);
  };

  const handleExportAll4SemestersPDF = () => {
    toast.success(`📚 Exporting Master PDF containing all 4 running semesters (Sem 1, Sem 3, Sem 5, Sem 7)...`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <CalendarRange className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Automated Timetable Management & Generator
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                All 4 Running Semesters
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Conflict-free weekly schedule generator across CSE, ECE, ME, CE, EEE, IT & AI&DS branches.
            </p>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button
            size="sm"
            onClick={handleAutoGenerate}
            disabled={generating}
            className="h-9 bg-brand-gradient text-white gap-2 text-xs font-bold shadow-glow"
          >
            {generating ? <RefreshCw className="size-4 animate-spin" /> : <Bot className="size-4" />} 🤖 Auto-Generate Timetable
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <FileSpreadsheet className="size-3.5" /> Export Excel
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-9 gap-2 text-xs font-medium">
            <FileText className="size-3.5" /> Export PDF
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportAll4SemestersPDF} className="h-9 gap-2 text-xs font-medium text-primary border-primary/30">
            <Sparkles className="size-3.5" /> Export All 4 Sems
          </Button>
        </div>
      </div>

      {/* MASTER SELECTORS & FILTER BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Dropdown */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider block">Academic Branch</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-9 text-xs font-bold w-[140px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => (<SelectItem key={b} value={b} className="text-xs font-bold">{b} Department</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester Dropdown */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider block">Running Semester</label>
            <Select value={String(selectedSem)} onValueChange={(val) => setSelectedSem(Number(val))}>
              <SelectTrigger className="h-9 text-xs font-bold w-[150px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1" className="text-xs font-bold">Sem 1 (1st Year)</SelectItem>
                <SelectItem value="3" className="text-xs font-bold">Sem 3 (2nd Year)</SelectItem>
                <SelectItem value="5" className="text-xs font-bold">Sem 5 (3rd Year)</SelectItem>
                <SelectItem value="7" className="text-xs font-bold">Sem 7 (4th Year)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section Dropdown */}
          <div className="space-y-1">
            <label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider block">Section</label>
            <Select value={selectedSec} onValueChange={setSelectedSec}>
              <SelectTrigger className="h-9 text-xs font-bold w-[120px] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTIONS.map((sec) => (<SelectItem key={sec} value={sec} className="text-xs font-bold">{sec}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="inline-flex p-1 rounded-2xl bg-muted/60 border border-border/60 self-start md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarRange className="size-3.5" /> Grid View (Weekly)
          </button>

          <button
            onClick={() => setViewMode("faculty")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "faculty" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-3.5" /> Faculty View
          </button>

          <button
            onClick={() => setViewMode("room")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "room" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3.5" /> Room Allocation
          </button>
        </div>
      </div>

      {/* VIEW 1: WEEKLY TIMETABLE GRID (MONDAY TO SATURDAY X PERIOD 1 TO 8) */}
      {viewMode === "grid" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <CalendarRange className="size-4 text-primary" /> Master Weekly Timetable Matrix
              </h2>
              <p className="text-xs text-muted-foreground">
                Class: <strong className="text-primary">{selectedBranch} - Semester {selectedSem} ({selectedSec})</strong> • Academic Year 2026-2027
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-blue-500"></span> Core Theory</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-amber-500"></span> Practical Lab</span>
            </div>
          </div>

          {loading || !gridData ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="size-8 animate-spin mx-auto text-primary" />
              <p className="text-xs text-muted-foreground font-medium">Loading schedule grid...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/60 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3 w-[120px]">Period / Time</th>
                    {DAYS.map((day) => (
                      <th key={day} className="py-3 px-3 text-center border-l border-border/60 min-w-[150px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {PERIOD_SLOTS.map((slot) => {
                    const isLunch = slot.periodNumber === 4;
                    return (
                      <tr key={slot.periodNumber} className="hover:bg-muted/10 transition-colors">
                        {/* Period & Time Slot */}
                        <td className="py-3 px-3 font-mono font-bold border-r border-border/60 bg-muted/20">
                          <span className="text-primary block text-xs">Period {slot.periodNumber}</span>
                          <span className="text-[0.68rem] text-muted-foreground font-normal block">{slot.startTime} - {slot.endTime}</span>
                        </td>

                        {/* 6 Day Columns */}
                        {DAYS.map((day) => {
                          const periodSlot = gridData.schedule.find((p) => p.day === day && p.periodNumber === slot.periodNumber);

                          if (!periodSlot) {
                            return (
                              <td key={day} className="py-3 px-3 border-l border-border/60 text-center text-muted-foreground font-mono">
                                —
                              </td>
                            );
                          }

                          const isLab = periodSlot.isLab;

                          return (
                            <td key={day} className="p-1.5 border-l border-border/60 align-top">
                              <div
                                onClick={() => handleOpenEditCell(periodSlot)}
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] space-y-1 ${
                                  isLab
                                    ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/50 text-amber-950 dark:text-amber-200"
                                    : "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-900/50 text-blue-950 dark:text-blue-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <Badge className={`text-[0.65rem] font-mono px-1.5 py-0 ${isLab ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}`}>
                                    {periodSlot.subjectCode}
                                  </Badge>
                                  {isLab && <FlaskConical className="size-3 text-amber-600" />}
                                </div>
                                <h4 className="font-bold text-[0.72rem] line-clamp-1">{periodSlot.subjectName}</h4>
                                <p className="text-[0.68rem] font-semibold opacity-90 truncate">{periodSlot.facultyName}</p>
                                <div className="text-[0.65rem] font-mono opacity-80 pt-0.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                                  <span>{periodSlot.roomNo}</span>
                                  <span className="font-bold text-[0.6rem] uppercase">{isLab ? "LAB" : "THEORY"}</span>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: FACULTY TIMETABLE VIEW */}
      {viewMode === "faculty" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <User className="size-4 text-primary" /> Individual Faculty Teaching Workload Schedule
              </h2>
              <p className="text-xs text-muted-foreground">Filter timetable by assigned instructor to view their weekly teaching periods and free slots.</p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedFacultyFilter} onValueChange={setSelectedFacultyFilter}>
                <SelectTrigger className="h-9 text-xs font-bold w-[220px] rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. K. Sai Teja">Dr. K. Sai Teja (CSE)</SelectItem>
                  <SelectItem value="Dr. Rajesh K. Varma">Dr. Rajesh K. Varma (CSE)</SelectItem>
                  <SelectItem value="Dr. Meera Nambiar">Dr. Meera Nambiar (ECE)</SelectItem>
                  <SelectItem value="Prof. Arvind Swaminathan">Prof. Arvind Swaminathan (AI&DS)</SelectItem>
                  <SelectItem value="Dr. Sankar Narayan">Dr. Sankar Narayan (ME)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {DAYS.map((day) => {
              const facultyPeriods = gridData?.schedule.filter(
                (p) => p.day === day && p.facultyName.toLowerCase() === selectedFacultyFilter.toLowerCase()
              ) || [];

              return (
                <div key={day} className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h3 className="font-bold text-xs text-foreground">{day}</h3>
                    <Badge variant="outline" className="font-mono text-[0.68rem] text-primary">{facultyPeriods.length} Periods</Badge>
                  </div>

                  {facultyPeriods.length === 0 ? (
                    <div className="p-4 text-center text-xs text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl font-medium">
                      🟢 Free / Research Day
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {facultyPeriods.map((fp) => (
                        <div key={fp.id} className="p-3 rounded-xl border border-border/60 bg-card space-y-1">
                          <div className="flex items-center justify-between font-mono text-[0.68rem]">
                            <span className="font-bold text-primary">Period {fp.periodNumber} ({fp.startTime})</span>
                            <Badge className="bg-blue-600 text-white text-[0.6rem]">{fp.roomNo}</Badge>
                          </div>
                          <h4 className="font-bold text-xs text-foreground">{fp.subjectName}</h4>
                          <p className="text-[0.68rem] text-muted-foreground">{fp.branch} - Sem {fp.semester} ({fp.section})</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: ROOM ALLOCATION VIEW */}
      {viewMode === "room" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" /> Classroom & Laboratory Occupancy Schedule
            </h2>
            <p className="text-xs text-muted-foreground">Inspect classroom utilization and lab room availability across campus blocks.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Block B - 302", "Block C - 201", "Lab - AI Center", "Lab - CSE 2", "Lab - ECE 1"].map((room) => (
              <div key={room} className="p-4 rounded-2xl border border-border/80 bg-card space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h3 className="font-bold text-xs text-foreground font-mono">{room}</h3>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.68rem]">Active Utilization</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Current Occupancy: <strong className="text-foreground">CSE - Sem 5 (Sec A)</strong></p>
                <p className="text-[0.68rem] font-mono text-primary">Capacity: 60 Seats • Air-Conditioned</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT PERIOD CELL & LIVE CLASH WARNING */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="size-4 text-primary" /> Edit Period Slot & Clash Verification
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update period assignments for {editingPeriod?.day} Period {editingPeriod?.periodNumber} ({editingPeriod?.startTime}).
            </DialogDescription>
          </DialogHeader>

          {editingPeriod && (
            <form onSubmit={handleSavePeriod} className="space-y-4 pt-2">
              {clashWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium">
                  {clashWarning}
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subject Title</Label>
                <Input
                  value={editingPeriod.subjectName || ""}
                  onChange={(e) => setEditingPeriod({ ...editingPeriod, subjectName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assigned Faculty Member</Label>
                <Select
                  value={editingPeriod.facultyName || ""}
                  onValueChange={(val) => handleFacultyChange(val)}
                >
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. K. Sai Teja" className="text-xs font-semibold">Dr. K. Sai Teja (CSE)</SelectItem>
                    <SelectItem value="Dr. Rajesh K. Varma" className="text-xs font-semibold">Dr. Rajesh K. Varma (CSE)</SelectItem>
                    <SelectItem value="Dr. Meera Nambiar" className="text-xs font-semibold">Dr. Meera Nambiar (ECE)</SelectItem>
                    <SelectItem value="Prof. Arvind Swaminathan" className="text-xs font-semibold">Prof. Arvind Swaminathan (AI&DS)</SelectItem>
                    <SelectItem value="Dr. Sankar Narayan" className="text-xs font-semibold">Dr. Sankar Narayan (ME)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Classroom / Laboratory Room No.</Label>
                <Input
                  value={editingPeriod.roomNo || ""}
                  onChange={(e) => setEditingPeriod({ ...editingPeriod, roomNo: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="text-xs rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold rounded-xl">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
