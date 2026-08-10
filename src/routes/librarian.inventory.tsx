import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/inventory")({
  head: () => ({
    meta: [{ title: "Stock Audit & Inventory — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
