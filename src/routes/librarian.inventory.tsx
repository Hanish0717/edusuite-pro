import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/librarian";

export const Route = createFileRoute("/librarian/inventory")({
  head: () => ({
    meta: [{ title: "Stock Audit & Inventory — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
