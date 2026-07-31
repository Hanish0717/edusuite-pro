import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/dean/dashboard")({
  head: () => ({
    meta: [{ title: "Dean Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
