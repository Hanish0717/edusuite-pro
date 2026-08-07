import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/transport/dashboard")({
  head: () => ({
    meta: [{ title: "Transport Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
