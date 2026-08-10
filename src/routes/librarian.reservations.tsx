import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/reservations")({
  head: () => ({
    meta: [{ title: "Book Reservations & Holds — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
