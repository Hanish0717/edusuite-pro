import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/notifications")({
  head: () => ({
    meta: [{ title: "Library Notifications — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
