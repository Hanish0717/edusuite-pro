import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/super-admin/courses")({
  head: () => ({
    meta: [{ title: "Academics & Curriculum — EduSuite Pro" }],
  }),
  component: SuperAdminCoursesPage,
});

function SuperAdminCoursesPage() {
  return <AcademicsModuleView />;
}
