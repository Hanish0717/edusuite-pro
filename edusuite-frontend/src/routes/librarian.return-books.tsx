import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/return-books")({
  head: () => ({
    meta: [{ title: "Return Books Desk — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
