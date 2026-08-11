import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EmployeeManagementModuleView } from "@/modules/employee-management";

export const Route = createFileRoute("/employee-management")({
  head: () => ({
    meta: [{ title: "Employee Management — EduSuite Pro" }],
  }),
  component: EmployeeManagementPage,
});

function EmployeeManagementPage() {
  return (
    <DashboardLayout>
      <EmployeeManagementModuleView />
    </DashboardLayout>
  );
}
