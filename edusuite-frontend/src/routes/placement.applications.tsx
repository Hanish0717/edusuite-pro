import { createFileRoute } from "@tanstack/react-router";
import { PlacementApplicationsWorkspace } from "@/components/dashboard/role/placement-applications-page";

export const Route = createFileRoute("/placement/applications")({
  head: () => ({
    meta: [{ title: "Applications Review Center — Placement Officer Portal" }],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  return <PlacementApplicationsWorkspace />;
}
