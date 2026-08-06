import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/ima")({
  component: ImaLayout,
});

function ImaLayout() {
  return <Outlet />;
}
