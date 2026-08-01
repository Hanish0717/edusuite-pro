import { createFileRoute } from "@tanstack/react-router";
import { PlacementAnalyticsWorkspace } from "@/components/dashboard/role/placement-analytics-page";

export const Route = createFileRoute("/placement/analytics")({
  head: () => ({
    meta: [{ title: "Placement Analytics — Placement Officer Portal" }],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return <PlacementAnalyticsWorkspace />;
}
