import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/library/dashboard")({
  head: () => ({
    meta: [{ title: "Library Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
