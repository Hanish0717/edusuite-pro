import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PayrollModuleView } from "@/modules/payroll";

export const Route = createFileRoute("/payroll")({
  head: () => ({
    meta: [{ title: "Payroll Management — EduSuite Pro" }],
  }),
  component: PayrollPage,
});

function PayrollPage() {
  return (
    <DashboardLayout>
      <PayrollModuleView />
    </DashboardLayout>
  );
}
