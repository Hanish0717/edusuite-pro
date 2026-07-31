import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/lms")({
  component: LmsRedirect,
});

function LmsRedirect() {
  const { role } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/lms" replace />;
  }
  if (role === "staff") {
    return <Navigate to="/faculty/lms" replace />;
  }

  return <Navigate to="/login" replace />;
}
