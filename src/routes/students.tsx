import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/students")({
  component: StudentsRedirect,
});

function StudentsRedirect() {
  const { role, flags } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/students" replace />;
  }
  if (role === "staff") {
    if (flags.includes("isPlacementOfficer")) {
      return <Navigate to="/placement/students" replace />;
    }
    return <Navigate to="/faculty/dashboard" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (role === "parent") {
    return <Navigate to="/parent/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
