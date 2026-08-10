import { createFileRoute } from "@tanstack/react-router";
import { TransportFeesManagementView } from "@/modules/transport";

export const Route = createFileRoute("/transport/fees")({
  head: () => ({
    meta: [{ title: "Fees Management & Student Accounts — EduSuite Pro" }],
  }),
  component: TransportFeesPage,
});

function TransportFeesPage() {
  return <TransportFeesManagementView />;
}
