import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/issue-books")({
  head: () => ({
    meta: [{ title: "Issue Books Desk — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
