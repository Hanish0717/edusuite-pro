import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/super-admin/academics/attendance/mark")({
  head: () => ({
    meta: [{ title: "Faculty Attendance Marking Portal — Super Admin Portal" }],
  }),
  component: SuperAdminAttendanceMarkPage,
});

function SuperAdminAttendanceMarkPage() {
  return <AcademicsModuleView initialTab="attendance-mark" />;
}
