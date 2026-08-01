import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/examinations")({
  component: ExaminationsRedirect,
});

function ExaminationsRedirect() {
  const { role, flags } = useRole();

  if (role === "super-admin" || role === "super_admin") {
    return <Navigate to="/faculty/examinations" replace />;
  }
  if (role === "staff") {
    if (flags.includes("isExamController")) {
      return <Navigate to="/examination/dashboard" replace />;
    }
    return <Navigate to="/faculty/examinations" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
