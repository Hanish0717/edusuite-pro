import { createFileRoute } from "@tanstack/react-router";
import { ReportsModuleView } from "@/modules/reports";

export const Route = createFileRoute("/faculty/reports")({
  head: () => ({
    meta: [{ title: "Reports & Analytics — EduSuite Pro" }],
  }),
  component: FacultyReportsPage,
});

function FacultyReportsPage() {
  return <ReportsModuleView />;
}
