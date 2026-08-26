import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HRModuleView } from "@/modules/hr";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [{ title: "Human Resources — EduSuite Pro" }],
  }),
  component: HrPage,
});

export function HrPage() {
  return (
    <DashboardLayout>
      <HRModuleView />
    </DashboardLayout>
  );
}
