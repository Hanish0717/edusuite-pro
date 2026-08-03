import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/")({
  head: () => ({
    meta: [{ title: "Library Overview — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
