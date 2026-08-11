import { createFileRoute } from "@tanstack/react-router";
import { DriveManagementWorkspace } from "@/components/dashboard/role/drive-management";

export const Route = createFileRoute("/placement/drives")({
  head: () => ({
    meta: [{ title: "Placement Drive Management — Placement Officer Portal" }],
  }),
  component: PlacementDrivesPage,
});

function PlacementDrivesPage() {
  return <DriveManagementWorkspace />;
}
