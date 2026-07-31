import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import { getDefaultRouteForUser } from "@/config/roles";

export const Route = createFileRoute("/timetable")({
  component: TimetableRedirect,
});

function TimetableRedirect() {
  const { role, flags } = useRole();
  const defaultRoute = getDefaultRouteForUser(role, flags);

  return <Navigate to={defaultRoute} replace />;
}
