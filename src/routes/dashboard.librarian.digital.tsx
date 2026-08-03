import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/digital")({
  head: () => ({
    meta: [{ title: "Digital Library Repository — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
