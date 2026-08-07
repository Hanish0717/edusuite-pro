import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/")({
  head: () => ({
    meta: [{ title: "Central Library Desk — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
