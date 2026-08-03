import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/dashboard/librarian/books")({
  head: () => ({
    meta: [{ title: "Book Management — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
