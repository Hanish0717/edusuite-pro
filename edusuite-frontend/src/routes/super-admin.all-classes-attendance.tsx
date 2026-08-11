import { createFileRoute } from "@tanstack/react-router";
import { AttendanceModuleView } from "@/modules/attendance";

export const Route = createFileRoute("/super-admin/all-classes-attendance")({
  head: () => ({
    meta: [{ title: "All Classes Attendance Governance — Super Admin Portal" }],
  }),
  component: SuperAdminAllClassesAttendancePage,
});

function SuperAdminAllClassesAttendancePage() {
  return <AttendanceModuleView initialTab="all-classes-attendance" />;
}
