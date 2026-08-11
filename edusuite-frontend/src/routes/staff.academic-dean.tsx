import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/academic-dean")({
  component: AcademicDeanLayout,
});

function AcademicDeanLayout() {
  return <Outlet />;
}
