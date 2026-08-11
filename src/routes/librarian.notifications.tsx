import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
