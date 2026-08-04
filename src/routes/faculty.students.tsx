import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type StudentDetails,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { StudentHeader } from "@/components/dashboard/students/student-header";
import { SearchFilterBar } from "@/components/dashboard/students/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/students/statistics-cards";
import { StudentDirectory } from "@/components/dashboard/students/student-directory";
import { StudentDetailDrawer } from "@/components/dashboard/students/student-detail-drawer";
import { SkeletonLoader } from "@/components/dashboard/students/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/students")({
  head: () => ({
    meta: [{ title: "Students — EduSuite Pro" }],
  }),
  component: FacultyStudentsPage,
});

function FacultyStudentsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";
  
  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const originalStudents = dashboardData.studentsDetailsList || [];

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedPerformance, setSelectedPerformance] = useState("ALL");
  const [selectedMentoring, setSelectedMentoring] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Drawer details state
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Extract unique sections
  const uniqueSections = Array.from(new Set(originalStudents.map((s) => s.section)));

  // Reset filters when department context swaps
  useEffect(() => {
    setSearchQuery("");
    setSelectedSection("ALL");
    setSelectedPerformance("ALL");
    setSelectedMentoring("ALL");
    setSelectedStudent(null);
    setDrawerOpen(false);
  }, [deptCode]);

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing student registers...", {
      description: "Fetching updated advisory rosters.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSelectStudent = (student: StudentDetails) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  // Filter students locally
  const filteredStudents = originalStudents.filter((stud) => {
    const matchesSearch =
      stud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stud.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stud.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSection = selectedSection === "ALL" || stud.section === selectedSection;

    let matchesPerformance = true;
    if (selectedPerformance === "Shortage") {
      matchesPerformance = stud.attendance.percentage < 75;
    } else if (selectedPerformance === "AtRisk") {
      matchesPerformance = stud.performance.internalMarks < 70;
    }

    const matchesMentoring = selectedMentoring === "ALL" || (selectedMentoring === "Mentees" && stud.isMentee);

    return matchesSearch && matchesSection && matchesPerformance && matchesMentoring;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <StudentHeader
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
        onRefresh={handleRefresh}
      />

      {/* 2. Statistics Overview */}
      <StatisticsCards students={originalStudents} />

      {/* 3. Toolbar Search & Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedPerformance={selectedPerformance}
        onPerformanceChange={setSelectedPerformance}
        selectedMentoring={selectedMentoring}
        onMentoringChange={setSelectedMentoring}
        uniqueSections={uniqueSections}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 4. Student Directory list / grid */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <StudentDirectory
          students={filteredStudents}
          viewMode={viewMode}
          onSelectStudent={handleSelectStudent}
        />
      )}

      {/* 5. Detail Sliding Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
