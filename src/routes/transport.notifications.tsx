import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TransportModuleView } from "@/modules/transport";

export const Route = createFileRoute("/transport/notifications")({
  head: () => ({ meta: [{ title: "Transport Alerts & Notifications — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <TransportModuleView />
    </DashboardLayout>
  ),
});
