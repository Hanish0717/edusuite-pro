import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/super-admin/academics/attendance/mark")({
  head: () => ({
    meta: [{ title: "Faculty Attendance Marking Portal — Super Admin Portal" }],
  }),
  component: SuperAdminAttendanceMarkPage,
});

function SuperAdminAttendanceMarkPage() {
  return <FacultyModuleView initialTab="attendance-mark" />;
}
