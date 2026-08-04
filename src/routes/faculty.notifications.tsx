import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — EduSuite Pro" }],
  }),
  component: FacultyNotificationsPage,
});

function FacultyNotificationsPage() {
  return (
    <ModulePage
      title="Notifications"
      description="System alerts, student assignment uploads, and administrative approvals"
      icon={Bell}
      tabs={["Unread", "All Notifications", "System Alerts"]}
      highlights={[
        { label: "Total Notifications", value: "18" },
        { label: "Unread Badges", value: "3" },
        { label: "Action Required", value: "2 Alerts" },
        { label: "Last Checked", value: "Just Now" },
      ]}
    />
  );
}
