import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TransportModuleView } from "@/modules/transport";

export const Route = createFileRoute("/transport/analytics")({
  head: () => ({ meta: [{ title: "Transport Executive Analytics — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <TransportModuleView />
    </DashboardLayout>
  ),
});
