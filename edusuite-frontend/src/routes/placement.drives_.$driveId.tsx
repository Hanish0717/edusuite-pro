import { createFileRoute } from "@tanstack/react-router";
import { PlacementDriveDetailsWorkspace } from "@/components/dashboard/role/placement-drive-details-page";

export const Route = createFileRoute("/placement/drives_/$driveId")({
  head: () => ({
    meta: [{ title: "Drive Operational Workspace — Placement Officer Portal" }],
  }),
  component: PlacementDriveDetailsRoute,
});

function PlacementDriveDetailsRoute() {
  return <PlacementDriveDetailsWorkspace />;
}
