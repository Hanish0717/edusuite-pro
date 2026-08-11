import { createFileRoute } from "@tanstack/react-router";
import { DeanDashboard } from "@/components/dashboard/role/dean-dashboard";

export const Route = createFileRoute("/dean/dashboard")({
  head: () => ({
    meta: [{ title: "Dean Dashboard — EduSuite Pro" }],
  }),
  component: DeanDashboard,
});
