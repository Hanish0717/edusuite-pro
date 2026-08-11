import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TransportModuleView } from "@/modules/transport";

export const Route = createFileRoute("/transport/dashboard")({
  head: () => ({ meta: [{ title: "Transport Dashboard — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <TransportModuleView />
    </DashboardLayout>
  ),
});
