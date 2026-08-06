import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/dashboard/academics/faculty-status")({
  head: () => ({
    meta: [{ title: "Real-Time Faculty Status Matrix — EduSuite Pro" }],
  }),
  component: DashboardFacultyStatusPage,
});

function DashboardFacultyStatusPage() {
  return <FacultyModuleView initialTab="faculty-status" />;
}
