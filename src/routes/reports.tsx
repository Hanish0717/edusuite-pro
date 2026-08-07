import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicReportsModuleView } from "@/modules/reports";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Academic Reports & Analytics — EduSuite Pro" },
      {
        name: "description",
        content: "Institutional academic performance analysis, custom report builder, and compliance reports.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <DashboardLayout>
      <AcademicReportsModuleView />
    </DashboardLayout>
  );
}
