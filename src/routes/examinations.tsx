import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ExaminationsModuleView } from "@/modules/examinations";

export const Route = createFileRoute("/examinations")({
  head: () => ({
    meta: [{ title: "Examinations & Evaluation — EduSuite Pro" }],
  }),
  component: ExaminationsPage,
});

export function ExaminationsPage() {
  return (
    <DashboardLayout>
      <ExaminationsModuleView />
    </DashboardLayout>
  );
}
