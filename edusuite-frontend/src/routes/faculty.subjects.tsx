import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type SubjectItem,
  DEPARTMENT_NAMES,
} from "@/data/faculty-mock-data";
import { getFacultyAssignedSections } from "@/lib/mock-examcell-state";

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
  
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;

  // Dynamically resolve assigned sections appointed by Examcell for logged-in faculty
  const assignedSections = useMemo(() => {
    return getFacultyAssignedSections(profile.personaName || "Arjun Shastri");
  }, [profile.personaName]);

  const originalSubjects: SubjectItem[] = useMemo(() => {
    return assignedSections.map(sec => ({
      id: sec.id,
      code: sec.subjectCode,
      name: sec.subjectName,
      type: sec.courseType.toLowerCase().includes('lab') ? 'Lab' as const : 'Theory' as const,
      status: 'Active' as const,
      credits: sec.credits,
      regulation: 'R22',
      semester: `Sem ${sec.semester}`,
      department: sec.department,
      assignedSections: [`${sec.department}-${sec.section}`],
      sections: [`${sec.department}-${sec.section}`],
      weeklyHours: sec.courseType.toLowerCase().includes('lab') ? 4 : 3,
      studentsCount: sec.studentCount,
      studentCount: sec.studentCount,
      syllabusCompletion: 85,
      assignmentsCount: 4,
      labsCompleted: sec.courseType.toLowerCase().includes('lab') ? 8 : undefined
    })) as SubjectItem[];
  }, [assignedSections]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      description: "Fetching updated appointed subjects.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const handleSelectSubject = (subject: SubjectItem) => {
    setSelectedSubject(subject);
    setDrawerOpen(true);
  };

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
        academicYear="2024-25"
        semester="Sem 1 / Sem 5"
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
