import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/circulation")({
  head: () => ({
    meta: [{ title: "Circulation Enhancements — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
