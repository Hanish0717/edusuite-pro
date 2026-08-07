import { createFileRoute } from "@tanstack/react-router";
import { NotificationsModule } from "@/components/dashboard/notifications/notifications-module";

export const Route = createFileRoute("/faculty/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — EduSuite Pro" }],
  }),
  component: FacultyNotificationsPage,
});

function FacultyNotificationsPage() {
  return <NotificationsModule department="Computer Science and Engineering" />;
}
