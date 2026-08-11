import { createFileRoute } from "@tanstack/react-router";
import { PlacementModuleView } from "@/modules/placement";

export const Route = createFileRoute("/placement/")({
  component: PlacementIndexPage,
});

function PlacementIndexPage() {
  return <PlacementModuleView />;
}
