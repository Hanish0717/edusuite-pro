import { createFileRoute } from "@tanstack/react-router";
import { TransportDashboardView } from "@/modules/transport";

export const Route = createFileRoute("/transport/dashboard")({
  head: () => ({
    meta: [{ title: "Transport Dashboard — EduSuite Pro" }],
  }),
  component: TransportDashboardPage,
});

function TransportDashboardPage() {
  return <TransportDashboardView />;
}
