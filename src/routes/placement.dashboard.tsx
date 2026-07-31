import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/placement/dashboard")({
  head: () => ({
    meta: [{ title: "Placement Officer Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
