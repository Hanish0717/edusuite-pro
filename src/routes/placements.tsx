import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/placements")({
  component: PlacementsRedirect,
});

function PlacementsRedirect() {
  const { role } = useRole();

  if ((role as any) === "super-admin" || (role as any) === "super_admin" || role === "staff") {
    return <Navigate to="/placement/dashboard" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
