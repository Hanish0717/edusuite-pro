import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/id-cards")({
  head: () => ({
    meta: [{ title: "Member ID Cards — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
