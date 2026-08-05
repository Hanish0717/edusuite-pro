import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SubjectManagement } from "../modules/subject/SubjectManagement";

export const Route = createFileRoute("/subject-management")({
  head: () => ({
    meta: [{ title: "Subject Management — EduSuite Pro" }],
  }),
  component: SubjectManagementPage,
});

export function SubjectManagementPage() {
  return (
    <DashboardLayout>
      <SubjectManagement />
    </DashboardLayout>
  );
}
