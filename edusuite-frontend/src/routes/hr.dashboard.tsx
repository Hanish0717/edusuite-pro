import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/hr/dashboard")({
  head: () => ({
    meta: [{ title: "HR Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
