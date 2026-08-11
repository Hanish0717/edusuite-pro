import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/super-admin/academics/faculty-status")({
  head: () => ({
    meta: [{ title: "Real-Time Faculty Status Matrix — Super Admin Portal" }],
  }),
  component: SuperAdminFacultyStatusPage,
});

function SuperAdminFacultyStatusPage() {
  return <FacultyModuleView initialTab="faculty-status" />;
}
