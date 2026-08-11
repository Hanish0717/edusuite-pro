import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/digital")({
  head: () => ({
    meta: [{ title: "Digital Library — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
