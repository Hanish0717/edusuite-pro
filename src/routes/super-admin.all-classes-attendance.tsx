import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/super-admin/all-classes-attendance")({
  head: () => ({
    meta: [{ title: "All Classes Attendance Governance — Super Admin Portal" }],
  }),
  component: SuperAdminAllClassesAttendancePage,
});

function SuperAdminAllClassesAttendancePage() {
  return <AcademicsModuleView initialTab="all-classes-attendance" />;
}
