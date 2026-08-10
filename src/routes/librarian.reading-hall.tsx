import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/reading-hall")({
  head: () => ({
    meta: [{ title: "Reading Hall & Seat Matrix — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
