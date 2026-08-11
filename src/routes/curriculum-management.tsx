import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CurriculumManagement } from "../modules/curriculum/CurriculumManagement";

export const Route = createFileRoute("/curriculum-management")({
  head: () => ({
    meta: [{ title: "Course & Curriculum Management — EduSuite Pro" }],
  }),
  component: CurriculumManagementPage,
});

function CurriculumManagementPage() {
  return (
    <DashboardLayout>
      <CurriculumManagement />
    </DashboardLayout>
  );
}
