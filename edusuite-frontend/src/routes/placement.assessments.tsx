import { createFileRoute } from "@tanstack/react-router";
import { PlacementAssessmentsWorkspace } from "@/components/dashboard/role/placement-assessments-page";

export const Route = createFileRoute("/placement/assessments")({
  head: () => ({
    meta: [{ title: "Assessment Command Center — Placement Officer Portal" }],
  }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  return <PlacementAssessmentsWorkspace />;
}
