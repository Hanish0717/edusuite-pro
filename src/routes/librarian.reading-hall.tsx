import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/reading-hall")({
  head: () => ({
    meta: [{ title: "Reading Hall & Seat Matrix — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
