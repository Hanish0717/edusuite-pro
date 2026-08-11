import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { FacultyManagement } from "../modules/faculty/FacultyManagement";

export const Route = createFileRoute("/faculty-management")({
  head: () => ({
    meta: [{ title: "Faculty Management — EduSuite Pro" }],
  }),
  component: FacultyManagementPage,
});

function FacultyManagementPage() {
  return (
    <DashboardLayout>
      <FacultyManagement />
    </DashboardLayout>
  );
}
