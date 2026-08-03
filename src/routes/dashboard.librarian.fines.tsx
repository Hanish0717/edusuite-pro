import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/fines")({
  head: () => ({
    meta: [{ title: "Library Fine Collections — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
