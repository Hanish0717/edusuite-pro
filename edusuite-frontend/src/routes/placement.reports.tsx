import { createFileRoute } from "@tanstack/react-router";
import { PlacementReportsWorkspace } from "@/components/dashboard/role/placement-reports-page";

export const Route = createFileRoute("/placement/reports")({
  head: () => ({
    meta: [{ title: "Institutional Reports — Placement Officer Portal" }],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return <PlacementReportsWorkspace />;
}
