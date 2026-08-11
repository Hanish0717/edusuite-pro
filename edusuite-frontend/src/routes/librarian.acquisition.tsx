import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/acquisition")({
  head: () => ({
    meta: [{ title: "Book Acquisition & POs — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
