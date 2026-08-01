import React, { useState, useMemo } from "react";
import { 
  mockSummaryMetrics, 
  mockWeeklyTimetableSlots, 
  mockFacultyList, 
  mockExamSchedule, 
  mockCalendarEvents, 
  mockNotifications 
} from "./mock-data";
import { TimetableSlot, FilterState } from "./types";
import { SummaryCards } from "./summary-cards";
import { Filters } from "./filters";
import { TodaySchedule } from "./today-schedule";
import { WeeklyGrid } from "./weekly-grid";
import { MonthlyCalendar } from "./calendar";
import { FacultySchedule } from "./faculty-schedule";
import { ExamTimetable } from "./exam-timetable";
import { ClassDetailsModal } from "./class-details-modal";
import { QuickActionsSidebar } from "./quick-actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Download, 
  Printer, 
  Share2, 
  BookOpen, 
  Award, 
  User, 
  RefreshCw 
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function StudentTimetableModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "Today's Schedule" | "Weekly Timetable" | "Monthly Calendar" | "Faculty Schedule" | "Exam Timetable"
  >("Today's Schedule");

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    academicYear: "2025-2026",
    semester: "Semester 6",
    week: "Current Week (Week 12)",
    department: "All",
    faculty: "All",
    classType: "All",
  });

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      academicYear: "2025-2026",
      semester: "Semester 6",
      week: "Current Week (Week 12)",
      department: "All",
      faculty: "All",
      classType: "All",
    });
    toast.info("Filters reset to default.");
  };

  // Filtered Slots
  const filteredSlots = useMemo(() => {
    return mockWeeklyTimetableSlots.filter((slot) => {
      const matchesSearch =
        slot.subjectCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        slot.subjectName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        slot.facultyName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        slot.roomNumber.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        slot.building.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesClassType = filters.classType === "All" || slot.classType === filters.classType;

      return matchesSearch && matchesClassType;
    });
  }, [filters]);

  // Today's Slots (Monday)
  const todaysSlots = useMemo(() => {
    return filteredSlots.filter((s) => s.dayOfWeek === "Monday");
  }, [filteredSlots]);

  const handleDownloadPdf = () => {
    toast.success("Official Timetable PDF generated and ready for download!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog for Timetable...");
    window.print();
  };

  const handleExportCsv = () => {
    toast.success("Timetable exported to ICS / CSV Calendar format!");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* MODULE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Student Timetable
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
              Sem 6 • AY 2025-26
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            View your weekly class schedule, faculty, classroom, labs and online sessions.
          </p>
        </div>

        {/* TOP RIGHT BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleDownloadPdf}
            size="sm"
            variant="outline"
            className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-800 font-semibold gap-1.5"
          >
            <Download className="h-4 w-4 text-blue-600 shrink-0" /> Download PDF
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            variant="outline"
            className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-800 font-semibold gap-1.5"
          >
            <Printer className="h-4 w-4 text-slate-600 shrink-0" /> Print Timetable
          </Button>

          <Button
            onClick={handleExportCsv}
            size="sm"
            className="h-9 rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5 shadow-sm"
          >
            <Share2 className="h-4 w-4 shrink-0" /> Export
          </Button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS (KPIs) */}
      <SummaryCards metrics={mockSummaryMetrics} />

      {/* FILTERS & SEARCH BAR */}
      <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

      {/* MAIN LAYOUT: TABS CONTENT (LEFT 75%) + QUICK ACTIONS SIDEBAR (RIGHT 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: TABS & VIEWS (COL SPAN 3) */}
        <div className="lg:col-span-3 space-y-4">
          {/* TAB BUTTONS */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            {(
              [
                "Today's Schedule",
                "Weekly Timetable",
                "Monthly Calendar",
                "Faculty Schedule",
                "Exam Timetable",
              ] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setIsLoading(true);
                  setActiveTab(tab);
                  setTimeout(() => setIsLoading(false), 200);
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT VIEWS */}
          {isLoading ? (
            <div className="space-y-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Skeleton className="h-8 w-1/3 rounded-xl" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-36 rounded-2xl" />
                <Skeleton className="h-36 rounded-2xl" />
                <Skeleton className="h-36 rounded-2xl" />
              </div>
            </div>
          ) : (
            <>
              {activeTab === "Today's Schedule" && (
                <TodaySchedule slots={todaysSlots} onSelectSlot={setSelectedSlot} />
              )}

              {activeTab === "Weekly Timetable" && (
                <WeeklyGrid slots={filteredSlots} onSelectSlot={setSelectedSlot} />
              )}

              {activeTab === "Monthly Calendar" && (
                <MonthlyCalendar events={mockCalendarEvents} />
              )}

              {activeTab === "Faculty Schedule" && (
                <FacultySchedule
                  facultyList={mockFacultyList}
                  onViewFacultyDetails={(email) => {
                    toast.info(`Opening faculty details for ${email}`);
                  }}
                />
              )}

              {activeTab === "Exam Timetable" && (
                <ExamTimetable exams={mockExamSchedule} />
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & SIDEBAR WIDGETS (COL SPAN 1) */}
        <div className="lg:col-span-1">
          <QuickActionsSidebar
            notifications={mockNotifications}
            upcomingExams={mockExamSchedule}
            onNavigateToTab={(tabName) => setActiveTab(tabName as any)}
            onNavigateToRoute={(route) => navigate({ to: route as any })}
          />
        </div>
      </div>

      {/* CLASS DETAILS MODAL */}
      <ClassDetailsModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onNavigateToLms={() => navigate({ to: "/student/lms" })}
        onNavigateToAttendance={() => navigate({ to: "/student/attendance" })}
        onViewFaculty={() => {
          setActiveTab("Faculty Schedule");
        }}
      />
    </div>
  );
}
