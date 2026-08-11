import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TransportModuleView } from "@/modules/transport";

export const Route = createFileRoute("/transport/buses")({
  head: () => ({ meta: [{ title: "Transport Vehicles — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <TransportModuleView />
    </DashboardLayout>
  ),
});
