import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/super-admin/faculty-status")({
  head: () => ({
    meta: [{ title: "Real-Time Faculty Status Matrix — Super Admin Portal" }],
  }),
  component: SuperAdminFacultyStatusPage,
});

function SuperAdminFacultyStatusPage() {
  return <AcademicsModuleView initialTab="faculty-status" />;
}
