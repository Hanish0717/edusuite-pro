import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/results")({
  component: ResultsRedirect,
});

function ResultsRedirect() {
  const { role } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/results" replace />;
  }
  if (role === "staff") {
    return <Navigate to="/faculty/results" replace />;
  }

  return <Navigate to="/login" replace />;
}
