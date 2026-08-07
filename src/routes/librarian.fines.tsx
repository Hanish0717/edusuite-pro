import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/fines")({
  head: () => ({
    meta: [{ title: "Fines & Dues — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
