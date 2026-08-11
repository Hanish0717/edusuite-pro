import { createFileRoute } from "@tanstack/react-router";
import { LibrarianDashboard } from "@/components/dashboard/role/librarian-dashboard";

export const Route = createFileRoute("/librarian/entry")({
  head: () => ({
    meta: [{ title: "Gate Entry & Visitor Footfall — EduSuite Pro" }],
  }),
  component: LibrarianDashboard,
});
