import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ReportsModuleView } from "@/modules/reports";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [{ title: "Institutional Reports — EduSuite Pro" }],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportsModuleView />
    </DashboardLayout>
  );
}
