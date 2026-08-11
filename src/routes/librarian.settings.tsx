import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard.tsx";

export const Route = createFileRoute("/librarian/settings")({
  head: () => ({
    meta: [{ title: "Library Settings — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
