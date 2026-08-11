import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/id-cards")({
  head: () => ({
    meta: [{ title: "Member ID Cards — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
