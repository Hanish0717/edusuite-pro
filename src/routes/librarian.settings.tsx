import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/settings")({
  head: () => ({
    meta: [{ title: "Library Settings — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
