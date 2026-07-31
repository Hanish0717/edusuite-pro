import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/faculty/dashboard")({
  head: () => ({
    meta: [{ title: "Faculty Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
