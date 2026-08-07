import { createFileRoute } from "@tanstack/react-router";
import { PlacementDeanDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/placement-dean/")({
  head: () => ({
    meta: [
      { title: "Placement Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Corporate relations, tier-1 placement drives, and CTC analytics." },
    ],
  }),
  component: PlacementIndexPage,
});

function PlacementIndexPage() {
  return <PlacementDeanDashboard />;
}
