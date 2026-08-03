import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileSpreadsheet,
  Calendar,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  Plus,
  Filter,
  Printer,
  FileText,
  UserCheck,
  Edit3,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const examinationsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/faculty/examinations")({
  validateSearch: (search) => examinationsSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Examinations & Gradebook — EduSuite Pro" }],
  }),
  component: FacultyExaminationsPage,
});

// Mock Datasets for the 3 distinct views

interface ExamScheduleItem {
  id: string;
  code: string;
  title: string;
  department: string;
  date: string;
  session: "FN (10:00 AM - 01:00 PM)" | "AN (02:00 PM - 05:00 PM)";
  hall: string;
  invigilator: string;
  status: "Scheduled" | "In Progress" | "Completed";
}

const MOCK_EXAM_SCHEDULE: ExamScheduleItem[] = [
  {
    id: "SCH-101",
    code: "CS501",
    title: "Database Management Systems",
    department: "CSE",
    date: "2026-08-10",
    session: "FN (10:00 AM - 01:00 PM)",
    hall: "Block A - Hall 101",
    invigilator: "Dr. S. K. Gupta",
    status: "Scheduled",
  },
  {
    id: "SCH-102",
    code: "CS502",
    title: "Compiler Design & Automata",
    department: "CSE",
    date: "2026-08-12",
    session: "AN (02:00 PM - 05:00 PM)",
    hall: "Block A - Hall 102",
    invigilator: "Prof. Anand Kumar",
    status: "Scheduled",
  },
  {
    id: "SCH-103",
    code: "EC401",
    title: "Digital Signal Processing",
    department: "ECE",
    date: "2026-08-11",
    session: "FN (10:00 AM - 01:00 PM)",
    hall: "Block B - Lab 204",
    invigilator: "Dr. Meera Rao",
    status: "Scheduled",
  },
  {
    id: "SCH-104",
    code: "ME302",
    title: "Thermodynamics & Heat Transfer",
    department: "ME",
    date: "2026-08-14",
    session: "AN (02:00 PM - 05:00 PM)",
    hall: "Block C - Hall 301",
    invigilator: "Prof. V. K. Murthy",
    status: "Scheduled",
  },
  {
    id: "SCH-105",
    code: "AI601",
    title: "Deep Learning & Neural Networks",
    department: "AI&DS",
    date: "2026-08-15",
    session: "FN (10:00 AM - 01:00 PM)",
    hall: "Block A - Hall 105",
    invigilator: "Dr. K. Sai Teja",
    status: "Scheduled",
  },
];

interface HallTicketItem {
  rollNo: string;
  name: string;
  department: string;
  semester: string;
  attendancePct: number;
  eligibility: "Eligible" | "Condoned" | "Ineligible";
  status: "Issued" | "Pending Release" | "Hold (Fee Due)";
}

const MOCK_HALL_TICKETS: HallTicketItem[] = [
  {
    rollNo: "22CS101",
    name: "K. Sai Teja",
    department: "CSE",
    semester: "Sem 5",
    attendancePct: 88.5,
    eligibility: "Eligible",
    status: "Issued",
  },
  {
    rollNo: "22CS102",
    name: "Anirudh Sharma",
    department: "CSE",
    semester: "Sem 5",
    attendancePct: 92.0,
    eligibility: "Eligible",
    status: "Issued",
  },
  {
    rollNo: "22ECE044",
    name: "Priya Sundaram",
    department: "ECE",
    semester: "Sem 4",
    attendancePct: 78.4,
    eligibility: "Condoned",
    status: "Pending Release",
  },
  {
    rollNo: "22ME089",
    name: "Anish Kulkarni",
    department: "ME",
    semester: "Sem 6",
    attendancePct: 64.2,
    eligibility: "Ineligible",
    status: "Hold (Fee Due)",
  },
  {
    rollNo: "22AIDS015",
    name: "Divya Reddy",
    department: "AI&DS",
    semester: "Sem 3",
    attendancePct: 95.1,
    eligibility: "Eligible",
    status: "Issued",
  },
];

interface InternalMarksItem {
  rollNo: string;
  name: string;
  courseCode: string;
  mid1: number; // Max 30
  mid2: number; // Max 30
  quiz: number; // Max 10
  total: number; // Max 40
  status: "Draft" | "Submitted to Controller" | "Locked";
}

const MOCK_INTERNAL_MARKS: InternalMarksItem[] = [
  {
    rollNo: "22CS101",
    name: "K. Sai Teja",
    courseCode: "CS501",
    mid1: 28,
    mid2: 29,
    quiz: 10,
    total: 39,
    status: "Submitted to Controller",
  },
  {
    rollNo: "22CS102",
    name: "Anirudh Sharma",
    courseCode: "CS501",
    mid1: 25,
    mid2: 26,
    quiz: 9,
    total: 35,
    status: "Submitted to Controller",
  },
  {
    rollNo: "22ECE044",
    name: "Priya Sundaram",
    courseCode: "EC401",
    mid1: 22,
    mid2: 24,
    quiz: 8,
    total: 31,
    status: "Draft",
  },
  {
    rollNo: "22ME089",
    name: "Anish Kulkarni",
    courseCode: "ME302",
    mid1: 18,
    mid2: 20,
    quiz: 7,
    total: 26,
    status: "Draft",
  },
  {
    rollNo: "22AIDS015",
    name: "Divya Reddy",
    courseCode: "AI601",
    mid1: 30,
    mid2: 30,
    quiz: 10,
    total: 40,
    status: "Locked",
  },
];

function FacultyExaminationsPage() {
  const { tab: queryTab } = Route.useSearch();

  // Validate active tab from search param
  const activeTab = useMemo(() => {
    if (queryTab === "Hall Tickets" || queryTab === "hall-tickets") return "Hall Tickets";
    if (queryTab === "Internal Marks" || queryTab === "internal-marks") return "Internal Marks";
    return "Exam Schedule";
  }, [queryTab]);

  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  // Sync state when URL tab param changes
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  // Datasets state
  const [examSchedule, setExamSchedule] = useState<ExamScheduleItem[]>(MOCK_EXAM_SCHEDULE);
  const [hallTickets, setHallTickets] = useState<HallTicketItem[]>(MOCK_HALL_TICKETS);
  const [internalMarks, setInternalMarks] = useState<InternalMarksItem[]>(MOCK_INTERNAL_MARKS);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");

  // Modal State for Adding Exam Slot
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<ExamScheduleItem>>({
    code: "",
    title: "",
    department: "CSE",
    date: new Date().toISOString().split("T")[0] ?? "2026-08-10",
    session: "FN (10:00 AM - 01:00 PM)",
    hall: "Block A - Hall 101",
    invigilator: "Dr. S. K. Gupta",
    status: "Scheduled",
  });

  // Modal State for Editing Marks
  const [editingMarksItem, setEditingMarksItem] = useState<InternalMarksItem | null>(null);

  // Filtered Exam Schedule
  const filteredSchedule = useMemo(() => {
    return examSchedule.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.hall.toLowerCase().includes(search.toLowerCase()) ||
        item.invigilator.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
        departmentFilter === "All Departments" || item.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [examSchedule, search, departmentFilter]);

  // Filtered Hall Tickets
  const filteredHallTickets = useMemo(() => {
    return hallTickets.filter((item) => {
      const matchesSearch =
        item.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
        departmentFilter === "All Departments" || item.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [hallTickets, search, departmentFilter]);

  // Filtered Internal Marks
  const filteredInternalMarks = useMemo(() => {
    return internalMarks.filter((item) => {
      const matchesSearch =
        item.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.courseCode.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [internalMarks, search]);

  // Handlers
  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.code || !newSlot.title) {
      toast.error("Please fill in course code and title.");
      return;
    }
    const item: ExamScheduleItem = {
      id: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      code: newSlot.code.toUpperCase(),
      title: newSlot.title,
      department: newSlot.department || "CSE",
      date: newSlot.date || "2026-08-20",
      session: newSlot.session as any,
      hall: newSlot.hall || "Block A - Hall 101",
      invigilator: newSlot.invigilator || "Dr. S. K. Gupta",
      status: "Scheduled",
    };
    setExamSchedule((prev) => [item, ...prev]);
    setIsAddSlotOpen(false);
    toast.success(`Exam slot for ${item.code} - ${item.title} scheduled!`);
  };

  const handleBulkGenerateHallTickets = () => {
    setHallTickets((prev) =>
      prev.map((item) =>
        item.eligibility !== "Ineligible" ? { ...item, status: "Issued" } : item,
      ),
    );
    toast.success("Bulk Hall Tickets generated & released for all eligible students!");
  };

  const handleSubmitInternalsToController = () => {
    setInternalMarks((prev) =>
      prev.map((item) => ({ ...item, status: "Submitted to Controller" })),
    );
    toast.success("Internal Marks gradebook submitted & locked for Examination Controller!");
  };

  const handleExportCSV = (filename: string) => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (currentTab === "Exam Schedule") {
      headers = [
        "Slot ID",
        "Course Code",
        "Course Title",
        "Department",
        "Exam Date",
        "Session",
        "Hall",
        "Invigilator",
        "Status",
      ];
      rows = filteredSchedule.map((s) => [
        s.id,
        s.code,
        `"${s.title}"`,
        s.department,
        s.date,
        `"${s.session}"`,
        `"${s.hall}"`,
        `"${s.invigilator}"`,
        s.status,
      ]);
    } else if (currentTab === "Hall Tickets") {
      headers = [
        "Roll No",
        "Student Name",
        "Department",
        "Semester",
        "Attendance %",
        "Eligibility",
        "Status",
      ];
      rows = filteredHallTickets.map((h) => [
        h.rollNo,
        `"${h.name}"`,
        h.department,
        h.semester,
        `${h.attendancePct}%`,
        h.eligibility,
        h.status,
      ]);
    } else {
      headers = [
        "Roll No",
        "Student Name",
        "Course Code",
        "Mid-1 (30)",
        "Mid-2 (30)",
        "Quiz (10)",
        "Total (40)",
        "Status",
      ];
      rows = filteredInternalMarks.map((m) => [
        m.rollNo,
        `"${m.name}"`,
        m.courseCode,
        m.mid1,
        m.mid2,
        m.quiz,
        m.total,
        m.status,
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${rows.length} ${filename} records to CSV file.`);
  };

  const handleDownloadAdmitCard = (item: HallTicketItem) => {
    const content = `================================================
EDUSUITE PRO - OFFICIAL HALL TICKET / ADMIT CARD
================================================
Roll Number : ${item.rollNo}
Student Name: ${item.name}
Department  : ${item.department} (${item.semester})
Attendance  : ${item.attendancePct}% (${item.eligibility})
Status      : ${item.status}
================================================
Instructions: Bring this admit card along with valid photo ID.
================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AdmitCard_${item.rollNo}_${item.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Admit Card for ${item.name} (${item.rollNo})!`);
  };

  const handleSaveEditedMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarksItem) return;

    const computedTotal =
      Math.round((editingMarksItem.mid1 + editingMarksItem.mid2) / 2) + editingMarksItem.quiz;

    setInternalMarks((prev) =>
      prev.map((item) =>
        item.rollNo === editingMarksItem.rollNo
          ? { ...editingMarksItem, total: Math.min(40, computedTotal) }
          : item,
      ),
    );
    toast.success(`Updated internal marks for ${editingMarksItem.name} (${editingMarksItem.rollNo})`);
    setEditingMarksItem(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-glow">
            <FileSpreadsheet className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
              Examinations, Hall Tickets & Gradebook
            </h1>
            <p className="text-sm text-muted-foreground">
              Exam scheduling, hall ticket generation, admit cards, and internal marks ledger.
            </p>
          </div>
        </div>

        {currentTab === "Exam Schedule" && (
          <Button
            onClick={() => setIsAddSlotOpen(true)}
            className="shrink-0 bg-brand-gradient text-white shadow-glow cursor-pointer text-xs font-bold gap-1.5"
          >
            <Plus className="size-4" /> Add Exam Slot
          </Button>
        )}

        {currentTab === "Hall Tickets" && (
          <Button
            onClick={handleBulkGenerateHallTickets}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow cursor-pointer text-xs font-bold gap-1.5"
          >
            <Printer className="size-4" /> Bulk Release Hall Tickets
          </Button>
        )}

        {currentTab === "Internal Marks" && (
          <Button
            onClick={handleSubmitInternalsToController}
            className="shrink-0 bg-brand-gradient text-white shadow-glow cursor-pointer text-xs font-bold gap-1.5"
          >
            <Lock className="size-4" /> Submit Internals to Controller
          </Button>
        )}
      </header>

      {/* HIGHLIGHT KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Scheduled Exams</p>
          <p className="text-2xl font-display font-extrabold text-primary">{examSchedule.length}</p>
          <p className="text-[0.68rem] text-muted-foreground">Conflict-free timetables</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Hall Tickets Issued</p>
          <p className="text-2xl font-display font-extrabold text-emerald-600">
            {hallTickets.filter((h) => h.status === "Issued").length} / {hallTickets.length}
          </p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Eligible Student Passes</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Internal Assessment Max</p>
          <p className="text-2xl font-display font-extrabold text-purple-600">40 Marks</p>
          <p className="text-[0.68rem] text-muted-foreground">Avg Mid1 + Mid2 + Quiz</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Examination Halls</p>
          <p className="text-2xl font-display font-extrabold text-amber-600">24 Halls</p>
          <p className="text-[0.68rem] text-muted-foreground">140 Invigilator Faculty</p>
        </div>
      </div>

      {/* TAB CONTAINER */}
      <Tabs
        value={currentTab}
        onValueChange={(val) => setCurrentTab(val)}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="Exam Schedule" className="text-xs gap-1.5 font-semibold cursor-pointer">
              <Calendar className="size-3.5" /> Exam Schedule ({examSchedule.length})
            </TabsTrigger>
            <TabsTrigger value="Hall Tickets" className="text-xs gap-1.5 font-semibold cursor-pointer">
              <UserCheck className="size-3.5" /> Hall Tickets ({hallTickets.length})
            </TabsTrigger>
            <TabsTrigger value="Internal Marks" className="text-xs gap-1.5 font-semibold cursor-pointer">
              <FileText className="size-3.5" /> Internal Marks ({internalMarks.length})
            </TabsTrigger>
          </TabsList>

          {/* Search & Department Filters */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search code, title, student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <Filter className="size-3 mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments" className="text-xs">
                  All Depts
                </SelectItem>
                <SelectItem value="CSE" className="text-xs">
                  CSE
                </SelectItem>
                <SelectItem value="ECE" className="text-xs">
                  ECE
                </SelectItem>
                <SelectItem value="ME" className="text-xs">
                  ME
                </SelectItem>
                <SelectItem value="AI&DS" className="text-xs">
                  AI&DS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TAB 1: EXAM SCHEDULE */}
        <TabsContent value="Exam Schedule">
          <Panel
            title="Institutional Examination Timetable"
            description="Semester end examination dates, session timings, invigilator assignments, and venue halls."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportCSV("Exam_Schedule")}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Download className="size-3.5" /> Export Schedule CSV
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Slot ID</th>
                    <th className="py-3 px-3">Course Code & Title</th>
                    <th className="py-3 px-3">Dept</th>
                    <th className="py-3 px-3">Exam Date</th>
                    <th className="py-3 px-3">Session Time</th>
                    <th className="py-3 px-3">Hall / Venue</th>
                    <th className="py-3 px-3">Invigilator</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSchedule.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{item.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-primary font-mono">{item.code}</div>
                        <div className="font-medium text-foreground">{item.title}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-foreground">{item.department}</td>
                      <td className="py-3 px-3 font-mono text-foreground">{item.date}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{item.session}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{item.hall}</td>
                      <td className="py-3 px-3 font-medium text-muted-foreground">{item.invigilator}</td>
                      <td className="py-3 px-3">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]">
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.info(`Date Sheet for ${item.code} sent to printer!`)}
                          className="h-7 text-[0.7rem] gap-1 cursor-pointer"
                        >
                          <Printer className="size-3" /> Print
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 2: HALL TICKETS */}
        <TabsContent value="Hall Tickets">
          <Panel
            title="Student Hall Tickets & Admit Cards Ledger"
            description="Attendance eligibility verification and admit card distribution roster."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportCSV("Hall_Tickets_Roster")}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Download className="size-3.5" /> Export Roster CSV
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Roll No.</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Dept & Sem</th>
                    <th className="py-3 px-3">Attendance %</th>
                    <th className="py-3 px-3">Eligibility</th>
                    <th className="py-3 px-3">Hall Ticket Status</th>
                    <th className="py-3 px-3 text-right">Admit Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredHallTickets.map((item) => (
                    <tr key={item.rollNo} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{item.rollNo}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{item.name}</td>
                      <td className="py-3 px-3 font-medium text-muted-foreground">
                        {item.department} — {item.semester}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span
                          className={
                            item.attendancePct >= 75
                              ? "text-emerald-600"
                              : item.attendancePct >= 65
                              ? "text-amber-600"
                              : "text-red-600"
                          }
                        >
                          {item.attendancePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={
                            item.eligibility === "Eligible"
                              ? "border-emerald-500/30 text-emerald-600 font-mono text-[0.68rem]"
                              : item.eligibility === "Condoned"
                              ? "border-amber-500/30 text-amber-600 font-mono text-[0.68rem]"
                              : "border-red-500/30 text-red-600 font-mono text-[0.68rem]"
                          }
                        >
                          {item.eligibility}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            item.status === "Issued"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                              : item.status === "Pending Release"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                              : "bg-red-500/10 text-red-600 border-red-500/20 text-[0.68rem]"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadAdmitCard(item)}
                          className="h-7 text-[0.7rem] gap-1 cursor-pointer"
                        >
                          <Download className="size-3" /> Admit Card
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 3: INTERNAL MARKS */}
        <TabsContent value="Internal Marks">
          <Panel
            title="Continuous Internal Assessment Gradebook"
            description="Mid-term exam scores, assignment/quiz weightages, and internal marks compilation."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportCSV("Internal_Marks_Gradebook")}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Download className="size-3.5" /> Export Gradebook CSV
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Roll No.</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Course Code</th>
                    <th className="py-3 px-3 text-center">Mid-1 (30)</th>
                    <th className="py-3 px-3 text-center">Mid-2 (30)</th>
                    <th className="py-3 px-3 text-center">Quiz / Assign (10)</th>
                    <th className="py-3 px-3 text-center">Total Internal (40)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredInternalMarks.map((item) => (
                    <tr key={item.rollNo} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{item.rollNo}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{item.name}</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary">{item.courseCode}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{item.mid1}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{item.mid2}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{item.quiz}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 text-sm">
                        {item.total} / 40
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "Locked"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[0.68rem]"
                              : item.status === "Submitted to Controller"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                              : "bg-muted text-muted-foreground text-[0.68rem]"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingMarksItem(item)}
                          className="h-7 text-[0.7rem] gap-1 cursor-pointer"
                        >
                          <Edit3 className="size-3" /> Edit Marks
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      {/* DIALOG: ADD EXAM SLOT */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="size-5 text-primary" /> Schedule Examination Slot
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define course code, exam date, session timings, and hall allocation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSlotSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Code *</Label>
                <Input
                  required
                  placeholder="e.g. CS501"
                  value={newSlot.code || ""}
                  onChange={(e) => setNewSlot({ ...newSlot, code: e.target.value.toUpperCase() })}
                  className="h-9 text-xs uppercase font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Course Title *</Label>
                <Input
                  required
                  placeholder="e.g. Database Systems"
                  value={newSlot.title || ""}
                  onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select
                  value={newSlot.department || "CSE"}
                  onValueChange={(val) => setNewSlot({ ...newSlot, department: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE" className="text-xs">
                      CSE
                    </SelectItem>
                    <SelectItem value="ECE" className="text-xs">
                      ECE
                    </SelectItem>
                    <SelectItem value="ME" className="text-xs">
                      ME
                    </SelectItem>
                    <SelectItem value="AI&DS" className="text-xs">
                      AI&DS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Exam Date</Label>
                <Input
                  type="date"
                  value={newSlot.date || ""}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Hall / Venue</Label>
                <Input
                  placeholder="e.g. Block A - Hall 101"
                  value={newSlot.hall || ""}
                  onChange={(e) => setNewSlot({ ...newSlot, hall: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddSlotOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold cursor-pointer">
                Schedule Exam Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT INTERNAL MARKS */}
      <Dialog open={!!editingMarksItem} onOpenChange={(open) => !open && setEditingMarksItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit3 className="size-5 text-primary" /> Edit Student Internal Marks
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingMarksItem?.name} ({editingMarksItem?.rollNo}) — {editingMarksItem?.courseCode}
            </DialogDescription>
          </DialogHeader>

          {editingMarksItem && (
            <form onSubmit={handleSaveEditedMarks} className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Mid-1 (30)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={editingMarksItem.mid1}
                    onChange={(e) =>
                      setEditingMarksItem({
                        ...editingMarksItem,
                        mid1: Math.min(30, Math.max(0, parseInt(e.target.value) || 0)),
                      })
                    }
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Mid-2 (30)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={editingMarksItem.mid2}
                    onChange={(e) =>
                      setEditingMarksItem({
                        ...editingMarksItem,
                        mid2: Math.min(30, Math.max(0, parseInt(e.target.value) || 0)),
                      })
                    }
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Quiz (10)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={editingMarksItem.quiz}
                    onChange={(e) =>
                      setEditingMarksItem({
                        ...editingMarksItem,
                        quiz: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)),
                      })
                    }
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Computed Total Weightage:</span>
                <span className="font-mono text-base font-extrabold text-emerald-600">
                  {Math.min(
                    40,
                    Math.round((editingMarksItem.mid1 + editingMarksItem.mid2) / 2) + editingMarksItem.quiz,
                  )}{" "}
                  / 40
                </span>
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingMarksItem(null)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold cursor-pointer">
                  Save Marks
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
