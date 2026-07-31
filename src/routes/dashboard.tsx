import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import { getDefaultRouteForUser } from "@/config/roles";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Redirecting — EduSuite Pro" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { role, flags } = useRole();
  const defaultRoute = getDefaultRouteForUser(role, flags);

  return <Navigate to={defaultRoute} replace />;
}
