import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [{ title: "Students Lifecycle — EduSuite Pro" }],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
