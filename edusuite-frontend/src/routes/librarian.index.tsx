import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/")({
  head: () => ({
    meta: [{ title: "Central Library Desk — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
