import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type TimetableSlot,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { AttendanceHeader } from "@/components/dashboard/attendance/attendance-header";
import { SearchFilterBar } from "@/components/dashboard/attendance/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/attendance/statistics-cards";
import { TodayClasses } from "@/components/dashboard/attendance/today-classes";
import { AttendanceForm } from "@/components/dashboard/attendance/attendance-form";
import { StudentAttendanceTable } from "@/components/dashboard/attendance/student-attendance-table";
import { AttendanceRegister } from "@/components/dashboard/attendance/attendance-register";
import { AttendanceCalendar } from "@/components/dashboard/attendance/attendance-calendar";
import { LeaveRequestPanel } from "@/components/dashboard/attendance/leave-request-panel";
import { AttendanceAnalytics } from "@/components/dashboard/attendance/attendance-analytics";
import { LowAttendanceAlerts } from "@/components/dashboard/attendance/low-attendance-alerts";
import { AttendanceHistory } from "@/components/dashboard/attendance/attendance-history";
import { QuickActions } from "@/components/dashboard/attendance/quick-actions";
import { SkeletonLoader } from "@/components/dashboard/attendance/skeleton-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/attendance")({
  head: () => ({
    meta: [{ title: "Attendance — EduSuite Pro" }],
  }),
  component: FacultyAttendancePage,
});

function FacultyAttendancePage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const originalStats = dashboardData.attendanceData;

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  // Local state for today's classes
  const [todayClasses, setTodayClasses] = useState<TimetableSlot[]>([]);

  // Take Attendance Screen State
  const [activeFormSlot, setActiveFormSlot] = useState<TimetableSlot | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");

  // Load today's classes on mounting
  useEffect(() => {
    setTodayClasses(dashboardData.timetable || []);
    // Reset filters
    setSearchQuery("");
    setSelectedSubject("ALL");
    setSelectedSection("ALL");
    setActiveFormSlot(null);
  }, [deptCode, dashboardData]);

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing attendance logs...", {
      description: "Fetching latest leaves and registry data.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleTakeAttendance = (slot: TimetableSlot) => {
    setActiveFormSlot(slot);
  };

  const handleViewRegister = (slot: TimetableSlot) => {
    setSelectedSubject(slot.subject);
    setSelectedSection(slot.section);
    setActiveTab("register");
  };

  const handleSubmitAttendance = (presentRolls: string[], absentRolls: string[]) => {
    if (activeFormSlot) {
      // Mark as completed locally
      setTodayClasses((prev) =>
        prev.map((c) =>
          c.time === activeFormSlot.time && c.subject === activeFormSlot.subject
            ? { ...c, status: "Completed" as const }
            : c
        )
      );
    }
    setActiveFormSlot(null);
  };

  // Filter students locally
  const filteredStudents = originalStats.students.filter((stud) => {
    const matchesSearch =
      stud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stud.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Roll number contains subject prefix (visual filter simulation)
    const matchesSection = selectedSection === "ALL" || stud.rollNumber.includes(selectedSection.replace("-", ""));

    return matchesSearch && matchesSection;
  });

  const uniqueSubjects = Array.from(new Set(originalStats.history.map((h) => h.subject)));
  const uniqueSections = Array.from(new Set(originalStats.history.map((h) => h.section)));

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <AttendanceHeader
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
        currentDate="01 August 2026"
      />

      {/* 2. Statistics Cockpit */}
      <StatisticsCards attendanceData={originalStats} />

      {/* 3. Sliding Tabs Control */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] h-auto gap-1 bg-muted p-1 rounded-2xl">
          <TabsTrigger value="today" className="rounded-xl text-xs py-2 cursor-pointer">Daily Log</TabsTrigger>
          <TabsTrigger value="register" className="rounded-xl text-xs py-2 cursor-pointer">Register Grid</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl text-xs py-2 cursor-pointer">Analytics</TabsTrigger>
        </TabsList>

        <div className="focus-visible:outline-none">
          {/* TAB 1: Daily Log & take attendance */}
          <TabsContent value="today" className="space-y-6 focus-visible:outline-none">
            {activeFormSlot ? (
              <AttendanceForm
                slot={activeFormSlot}
                students={originalStats.students}
                onSubmit={handleSubmitAttendance}
                onCancel={() => setActiveFormSlot(null)}
              />
            ) : (
              <>
                <TodayClasses
                  classes={todayClasses}
                  onTakeAttendance={handleTakeAttendance}
                  onViewRegister={handleViewRegister}
                />

                <SearchFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedSubject={selectedSubject}
                  onSubjectChange={setSelectedSubject}
                  selectedSection={selectedSection}
                  onSectionChange={setSelectedSection}
                  uniqueSubjects={uniqueSubjects}
                  uniqueSections={uniqueSections}
                  onRefresh={handleRefresh}
                />

                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <StudentAttendanceTable students={filteredStudents} />
                )}
              </>
            )}
          </TabsContent>

          {/* TAB 2: Register view & Calendar */}
          <TabsContent value="register" className="space-y-6 focus-visible:outline-none">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AttendanceRegister students={originalStats.students} />
              </div>
              <div>
                <AttendanceCalendar />
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Analytics & approvals */}
          <TabsContent value="analytics" className="space-y-6 focus-visible:outline-none">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <AttendanceAnalytics />
                <div className="grid gap-6 sm:grid-cols-2">
                  <LowAttendanceAlerts students={originalStats.students} />
                  <AttendanceHistory history={originalStats.history} />
                </div>
              </div>

              <div className="space-y-6">
                <LeaveRequestPanel initialRequests={originalStats.leaveRequests} />
                <QuickActions />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
