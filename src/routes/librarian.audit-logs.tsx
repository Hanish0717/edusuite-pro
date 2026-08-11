import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/audit-logs")({
  head: () => ({
    meta: [{ title: "System Audit Logs — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
