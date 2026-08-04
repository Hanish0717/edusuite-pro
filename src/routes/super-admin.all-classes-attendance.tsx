import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/super-admin/all-classes-attendance")({
  head: () => ({
    meta: [{ title: "All Classes Attendance Governance — Super Admin Portal" }],
  }),
  component: SuperAdminAllClassesAttendancePage,
});

function SuperAdminAllClassesAttendancePage() {
  return <FacultyModuleView initialTab="all-classes-attendance" />;
}
