import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/attendance")({
  component: AttendanceRedirect,
});

function AttendanceRedirect() {
  const { role, flags } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/attendance" replace />;
  }
  if (role === "parent") {
    return <Navigate to="/parent/attendance" replace />;
  }
  if (role === "staff") {
    if (flags.includes("isHod")) return <Navigate to="/hod/attendance" replace />;
    return <Navigate to="/faculty/attendance" replace />;
  }

  return <Navigate to="/login" replace />;
}
