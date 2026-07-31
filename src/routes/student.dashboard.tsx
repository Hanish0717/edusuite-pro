import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboard } from "@/components/dashboard/role/student-dashboard";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [{ title: "Student Dashboard — EduSuite Pro" }],
  }),
  component: StudentDashboard,
});
