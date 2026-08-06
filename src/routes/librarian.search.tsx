import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/search")({
  head: () => ({
    meta: [{ title: "Global Library Search — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
