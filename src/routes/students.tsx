import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentsModuleView } from "@/modules/students";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [{ title: "Students Lifecycle — EduSuite Pro" }],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  return (
    <DashboardLayout>
      <StudentsModuleView />
    </DashboardLayout>
  );
}
