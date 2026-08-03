import { createFileRoute } from "@tanstack/react-router";
import { PlacementNotificationsWorkspace } from "@/components/dashboard/role/placement-notifications-page";

export const Route = createFileRoute("/placement/notifications")({
  head: () => ({
    meta: [{ title: "Placement Broadcast Dispatcher — Placement Officer Portal" }],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return <PlacementNotificationsWorkspace />;
}
