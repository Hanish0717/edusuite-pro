import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/hostel/dashboard")({
  head: () => ({
    meta: [{ title: "Hostel Warden Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
