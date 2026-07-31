import { createFileRoute } from "@tanstack/react-router";
import { ParentDashboard } from "@/components/dashboard/role/parent-dashboard";

export const Route = createFileRoute("/parent/dashboard")({
  head: () => ({
    meta: [{ title: "Parent Dashboard — EduSuite Pro" }],
  }),
  component: ParentDashboard,
});
