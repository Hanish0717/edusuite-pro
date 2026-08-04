import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
} from "@/data/faculty-mock-data";
import { ExamModule } from "@/components/dashboard/exams/exam-module";

export const Route = createFileRoute("/faculty/examinations")({
  head: () => ({
    meta: [{ title: "Examination Management — EduSuite Pro" }],
  }),
  component: FacultyExaminationsPage,
});

function FacultyExaminationsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  // Retrieve mock data dynamically based on active department
  const dashboardData = (
    FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] ??
    FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]
  ) as FacultyDashboardData;

  return (
    <ExamModule
      data={dashboardData.examsList}
      facultyName={dashboardData.facultyName}
      academicYear={dashboardData.academicYear}
      semester={dashboardData.semester}
    />
  );
}
