import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/members")({
  head: () => ({
    meta: [{ title: "Members Directory — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
