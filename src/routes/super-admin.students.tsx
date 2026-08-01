import { createFileRoute } from "@tanstack/react-router";
import { StudentsModuleView } from "@/modules/students";

export const Route = createFileRoute("/super-admin/students")({
  head: () => ({
    meta: [{ title: "Students Lifecycle — EduSuite Pro" }],
  }),
  component: SuperAdminStudentsPage,
});

function SuperAdminStudentsPage() {
  return <StudentsModuleView />;
}
