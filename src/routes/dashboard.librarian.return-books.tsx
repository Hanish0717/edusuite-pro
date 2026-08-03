import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/return-books")({
  head: () => ({
    meta: [{ title: "Return Books Desk — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
