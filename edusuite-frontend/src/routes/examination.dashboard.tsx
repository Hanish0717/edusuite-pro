import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";

export const Route = createFileRoute("/examination/dashboard")({
  head: () => ({
    meta: [{ title: "Exam Controller Dashboard — EduSuite Pro" }],
  }),
  component: StaffDashboard,
});
