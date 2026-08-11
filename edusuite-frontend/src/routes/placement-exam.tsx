import { createFileRoute } from "@tanstack/react-router";
import { FullscreenExamPage } from "@/components/placement-exam/fullscreen-exam-page";

export const Route = createFileRoute("/placement-exam")({
  head: () => ({
    meta: [{ title: "Proctored Placement Assessment — EduSuite Pro" }],
  }),
  component: PlacementExamRoute,
});

function PlacementExamRoute() {
  return <FullscreenExamPage />;
}
