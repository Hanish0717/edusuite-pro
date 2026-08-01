import { createFileRoute } from "@tanstack/react-router";
import { PlacementSettingsWorkspace } from "@/components/dashboard/role/placement-settings-page";

export const Route = createFileRoute("/placement/settings")({
  head: () => ({
    meta: [{ title: "Placement Settings — Placement Officer Portal" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <PlacementSettingsWorkspace />;
}
