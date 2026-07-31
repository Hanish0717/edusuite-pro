import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/finance/dashboard")({
  head: () => ({
    meta: [{ title: "Finance Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
