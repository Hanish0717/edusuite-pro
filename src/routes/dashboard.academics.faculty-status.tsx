import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/dashboard/academics/faculty-status")({
  head: () => ({
    meta: [{ title: "Real-Time Faculty Status Matrix — EduSuite Pro" }],
  }),
  component: DashboardFacultyStatusPage,
});

function DashboardFacultyStatusPage() {
  return <AcademicsModuleView initialTab="faculty-status" />;
}
