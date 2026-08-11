import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/hod/dashboard")({
  head: () => ({
    meta: [{ title: "HOD Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
