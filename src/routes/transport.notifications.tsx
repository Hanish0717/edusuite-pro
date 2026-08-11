import { createFileRoute } from "@tanstack/react-router";
import { TransportNotificationsView } from "@/modules/transport";

export const Route = createFileRoute("/transport/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — EduSuite Pro" }],
  }),
  component: TransportNotificationsPage,
});

function TransportNotificationsPage() {
  return <TransportNotificationsView />;
}
