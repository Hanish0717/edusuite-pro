import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/super-admin/faculty")({
  head: () => ({
    meta: [{ title: "Faculty & Staff — EduSuite Pro" }],
  }),
  component: SuperAdminFacultyPage,
});

function SuperAdminFacultyPage() {
  return <FacultyModuleView initialTab="faculty-status" />;
}
