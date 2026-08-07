import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DepartmentManagement } from "@/modules/departments/DepartmentManagement";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [{ title: "Department Management — EduSuite Pro" }],
  }),
  component: DepartmentsPage,
});

export function DepartmentsPage() {
  return (
    <DashboardLayout>
      <DepartmentManagement />
    </DashboardLayout>
  );
}
