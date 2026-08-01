import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/examinations")({
  component: ExaminationsRedirect,
});

function ExaminationsRedirect() {
  const { role, flags } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === "staff") {
    if (flags.includes("isExamController")) {
      return <Navigate to="/examination/dashboard" replace />;
    }
    return <Navigate to="/faculty/examinations" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/examinations" replace />;
  }

  return <Navigate to="/login" replace />;
}
