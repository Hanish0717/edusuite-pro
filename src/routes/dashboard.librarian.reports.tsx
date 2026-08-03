import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/reports")({
  head: () => ({
    meta: [{ title: "Library Reports & Analytics — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
