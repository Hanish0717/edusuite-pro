import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/placement-dean")({
  component: PlacementLayout,
});

function PlacementLayout() {
  return <Outlet />;
}
