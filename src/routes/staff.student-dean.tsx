import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/student-dean")({
  component: StudentDeanLayout,
});

function StudentDeanLayout() {
  return <Outlet />;
}
