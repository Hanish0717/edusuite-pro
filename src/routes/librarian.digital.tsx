import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/digital")({
  head: () => ({
    meta: [{ title: "Digital Library — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
