import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type LessonPlanItem,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { LessonPlanHeader } from "@/components/dashboard/lesson-plan/lesson-plan-header";
import { SearchFilterBar } from "@/components/dashboard/lesson-plan/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/lesson-plan/statistics-cards";
import { LessonPlanGrid } from "@/components/dashboard/lesson-plan/lesson-plan-grid";
import { LessonPlanDrawer } from "@/components/dashboard/lesson-plan/lesson-plan-drawer";
import { SkeletonLoader } from "@/components/dashboard/lesson-plan/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/lesson-plan")({
  head: () => ({
    meta: [{ title: "Lesson Plans — EduSuite Pro" }],
  }),
  component: FacultyLessonPlanPage,
});

function FacultyLessonPlanPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";
  
  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const originalPlans = dashboardData.lessonPlans || [];

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  
  // Detail Drawer state
  const [selectedPlan, setSelectedPlan] = useState<LessonPlanItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Extract unique subject names for filter
  const uniqueSubjects = Array.from(new Set(originalPlans.map((p) => p.name)));

  // Reset filters when department context swaps
  useEffect(() => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedSubject("ALL");
    setSelectedPlan(null);
    setDrawerOpen(false);
  }, [deptCode]);

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing lesson planning schedules...", {
      description: "Fetching updated curriculum maps.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSelectPlan = (plan: LessonPlanItem) => {
    setSelectedPlan(plan);
    setDrawerOpen(true);
  };

  // Filter lesson plans locally
  const filteredPlans = originalPlans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    const matchesSubject = selectedSubject === "ALL" || p.name === selectedSubject;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <LessonPlanHeader
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
        onRefresh={handleRefresh}
      />

      {/* 2. Stats Dashboard */}
      <StatisticsCards plans={originalPlans} />

      {/* 3. Search and filter panel tools */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        uniqueSubjects={uniqueSubjects}
      />

      {/* 4. Cards grid view vs Skeleton loader */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <LessonPlanGrid
          plans={filteredPlans}
          onSelectPlan={handleSelectPlan}
        />
      )}

      {/* 5. Lesson Plan Details sliding Drawer */}
      <LessonPlanDrawer
        plan={selectedPlan}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
