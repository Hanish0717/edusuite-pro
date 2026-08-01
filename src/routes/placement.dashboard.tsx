import { createFileRoute } from "@tanstack/react-router";
import { PlacementDashboard } from "@/components/dashboard/role/placement-dashboard";

export const Route = createFileRoute("/placement/dashboard")({
  head: () => ({
    meta: [{ title: "Placement Officer Dashboard — EduSuite Pro" }],
  }),
  component: PlacementDashboard,
});

