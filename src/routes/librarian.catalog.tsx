import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/catalog")({
  head: () => ({
    meta: [{ title: "Catalog Management — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
