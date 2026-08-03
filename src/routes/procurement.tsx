import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProcurementModuleView } from "@/modules/procurement";

export const Route = createFileRoute("/procurement")({
  head: () => ({
    meta: [{ title: "Procurement Management — EduSuite Pro" }],
  }),
  component: ProcurementPage,
});

function ProcurementPage() {
  return (
    <DashboardLayout>
      <ProcurementModuleView />
    </DashboardLayout>
  );
}
