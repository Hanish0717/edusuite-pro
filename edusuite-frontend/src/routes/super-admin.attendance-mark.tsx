import { createFileRoute } from "@tanstack/react-router";
import { AttendanceModuleView } from "@/modules/attendance";

export const Route = createFileRoute("/super-admin/attendance-mark")({
  head: () => ({
    meta: [{ title: "Faculty Attendance Marking Portal — Super Admin Portal" }],
  }),
  component: SuperAdminAttendanceMarkPage,
});

function SuperAdminAttendanceMarkPage() {
  return <AttendanceModuleView initialTab="attendance-mark" />;
}
