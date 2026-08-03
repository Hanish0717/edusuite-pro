import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/members")({
  head: () => ({
    meta: [{ title: "Library Members — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
