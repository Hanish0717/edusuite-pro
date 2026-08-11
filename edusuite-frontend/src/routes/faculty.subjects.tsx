import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type SubjectItem,
  DEPARTMENT_NAMES,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { SubjectHeader } from "@/components/dashboard/subjects/subject-header";
import { SearchFilterBar } from "@/components/dashboard/subjects/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/subjects/statistics-cards";
import { SubjectGrid } from "@/components/dashboard/subjects/subject-grid";
import { SubjectDetailsDrawer } from "@/components/dashboard/subjects/subject-details-drawer";
import { SkeletonLoader } from "@/components/dashboard/subjects/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/subjects")({
  head: () => ({
    meta: [{ title: "Subjects — EduSuite Pro" }],
  }),
  component: FacultySubjectsPage,
});

function FacultySubjectsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";
  
  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const originalSubjects = dashboardData.subjectsList || [];

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  
  // Detail Drawer state
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reset filters when department context swaps
  useEffect(() => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedStatus("ALL");
    setSelectedSubject(null);
    setDrawerOpen(false);
  }, [deptCode]);

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing syllabus databases...", {
      description: "Fetching updated lesson plans.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSelectSubject = (subject: SubjectItem) => {
    setSelectedSubject(subject);
    setDrawerOpen(true);
  };

  // Filter subjects locally
  const filteredSubjects = originalSubjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === "ALL" || sub.type === selectedType;
    const matchesStatus = selectedStatus === "ALL" || sub.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <SubjectHeader
        departmentName={DEPARTMENT_NAMES[deptCode] || dashboardData.profileData.department}
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
      />

      {/* 2. Global Load Stats */}
      <StatisticsCards subjects={originalSubjects} />

      {/* 3. Search and filter tools */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onRefresh={handleRefresh}
      />

      {/* 4. Grid view vs Skeletons */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <SubjectGrid
          subjects={filteredSubjects}
          onSelectSubject={handleSelectSubject}
        />
      )}

      {/* 5. Subject Details Sliding Drawer */}
      <SubjectDetailsDrawer
        subject={selectedSubject}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
