import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
} from "@/data/faculty-mock-data";
import { AssessmentModule } from "@/components/dashboard/assessments/assessment-module";

export const Route = createFileRoute("/faculty/assessments")({
  head: () => ({
    meta: [{ title: "Assessment & Internal Marks — EduSuite Pro" }],
  }),
  component: FacultyAssessmentsPage,
});

function FacultyAssessmentsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  const dashboardData = (
    FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] ??
    FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]
  ) as FacultyDashboardData;

  return (
    <AssessmentModule
      data={dashboardData.assessmentsList}
      facultyName={dashboardData.facultyName}
      academicYear={dashboardData.academicYear}
      semester={dashboardData.semester}
    />
  );
}
