import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TransportModuleView } from "@/modules/transport";

export const Route = createFileRoute("/transport")({
  head: () => ({ meta: [{ title: "Campus Transport — EduSuite Pro" }] }),
  component: TransportPage,
});

export function TransportPage() {
  return (
    <DashboardLayout>
      <TransportModuleView />
    </DashboardLayout>
  );
}
