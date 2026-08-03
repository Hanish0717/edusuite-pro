import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/settings")({
  head: () => ({
    meta: [{ title: "Library Settings — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
