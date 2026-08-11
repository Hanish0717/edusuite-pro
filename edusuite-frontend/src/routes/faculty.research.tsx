import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
} from "@/data/faculty-mock-data";
import { ResearchModule } from "@/components/dashboard/research/research-module";

export const Route = createFileRoute("/faculty/research")({
  head: () => ({
    meta: [{ title: "Research & Publications — EduSuite Pro" }],
  }),
  component: FacultyResearchPage,
});

function FacultyResearchPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  // Retrieve mock data dynamically based on active department
  const dashboardData = (
    FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] ??
    FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]
  ) as FacultyDashboardData;

  return (
    <ResearchModule
      data={dashboardData.researchList}
      facultyName={dashboardData.facultyName}
      academicYear={dashboardData.academicYear}
      semester={dashboardData.semester}
    />
  );
}
