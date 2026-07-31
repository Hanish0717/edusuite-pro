import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/academics")({
  component: AcademicsRedirect,
});

function AcademicsRedirect() {
  const { role } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/courses" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/courses" replace />;
  }
  if (role === "staff") {
    return <Navigate to="/faculty/dashboard" replace />;
  }
  if (role === "parent") {
    return <Navigate to="/parent/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
