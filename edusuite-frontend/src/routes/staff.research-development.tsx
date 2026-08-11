import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/research-development")({
  component: ResearchLayout,
});

function ResearchLayout() {
  return <Outlet />;
}
