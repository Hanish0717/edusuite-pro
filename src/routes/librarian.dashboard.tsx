import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/dashboard")({
  head: () => ({
    meta: [{ title: "Librarian Dashboard — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
