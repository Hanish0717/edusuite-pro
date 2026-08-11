import { createFileRoute } from "@tanstack/react-router";
import { PlacementInterviewsWorkspace } from "@/components/dashboard/role/placement-interviews-page";

export const Route = createFileRoute("/placement/interviews")({
  head: () => ({
    meta: [{ title: "Interview Management Center — Placement Officer Portal" }],
  }),
  component: InterviewsPage,
});

function InterviewsPage() {
  return <PlacementInterviewsWorkspace />;
}
