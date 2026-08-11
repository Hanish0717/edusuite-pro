import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/books")({
  head: () => ({
    meta: [{ title: "Book Management — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
