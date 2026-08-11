import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TransportModuleView } from "@/modules/transport";

export const Route = createFileRoute("/transport/governance")({
  head: () => ({ meta: [{ title: "Transport Policy & Governance — EduSuite Pro" }] }),
  component: () => (
    <DashboardLayout>
      <TransportModuleView />
    </DashboardLayout>
  ),
});
