import { createFileRoute } from "@tanstack/react-router";
import { HostelNotificationsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/notifications")({
  head: () => ({
    meta: [{ title: "Hostel Notifications — EduSuite Pro" }],
  }),
  component: HostelNotificationsPage,
});

function HostelNotificationsPage() {
  return <HostelNotificationsView />;
}
