import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/dashboard/role/staff-dashboard";
import { FacultyModuleView } from "@/modules/faculty";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/faculty/dashboard")({
  head: () => ({
    meta: [{ title: "Faculty Dashboard — EduSuite Pro" }],
  }),
  component: FacultyDashboardPage,
});

function FacultyDashboardPage() {
  const { role } = useRole();
  const isSuperAdmin = (role as any) === "super-admin" || (role as any) === "super_admin" || role === "super_admin";

  if (isSuperAdmin) {
    return <FacultyModuleView initialTab="faculty-status" />;
  }

  return <StaffDashboard />;
}
