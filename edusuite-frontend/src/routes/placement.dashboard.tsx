import { createFileRoute } from "@tanstack/react-router";
import { PlacementModuleView } from "@/modules/placement";

export const Route = createFileRoute("/placement/dashboard")({
  head: () => ({
    meta: [{ title: "Placement Officer Dashboard — EduSuite Pro" }],
  }),
  component: PlacementDashboardPage,
});

function PlacementDashboardPage() {
  return <PlacementModuleView />;
}
