import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { FinanceModuleView } from "@/modules/finance";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [{ title: "Institutional Finance — EduSuite Pro" }],
  }),
  component: FinancePage,
});

export function FinancePage() {
  return (
    <DashboardLayout>
      <FinanceModuleView />
    </DashboardLayout>
  );
}
