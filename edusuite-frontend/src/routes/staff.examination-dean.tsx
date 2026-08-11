import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/examination-dean")({
  component: ExaminationLayout,
});

function ExaminationLayout() {
  return <Outlet />;
}
