import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/iqac")({
  component: IqacLayout,
});

function IqacLayout() {
  return <Outlet />;
}
