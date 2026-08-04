import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/examinations")({
  head: () => ({ meta: [{ title: "Examinations & Evaluation — EduSuite Pro" }] }),
  component: ExaminationsPage,
});

export function ExaminationsPage() {
  const { role, flags } = useRole();

  if (role === "super-admin") {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === "staff") {
    if (flags.includes("isExamController") || flags.includes("isExamAssistant")) {
      return <Navigate to="/examcell/dashboard" replace />;
    }
    return <Navigate to="/faculty/evaluation-and-marks" replace />;
  }
  if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
