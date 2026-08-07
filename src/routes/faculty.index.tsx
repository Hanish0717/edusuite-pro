import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useRole } from "@/context/role-context";
import { FacultyModuleView } from "@/modules/faculty";
import { normalizeRole } from "@/lib/roleResolver";

export const Route = createFileRoute("/faculty/")({
  component: FacultyIndexPage,
});

function FacultyIndexPage() {
  const { role } = useRole();
  const normalized = normalizeRole(role);

  if (normalized !== "super_admin" && normalized !== "admin") {
    return <Navigate to="/faculty/dashboard" />;
  }

  return <FacultyModuleView />;
}
