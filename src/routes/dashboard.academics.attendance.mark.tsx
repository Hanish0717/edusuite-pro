import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/dashboard/academics/attendance/mark")({
  head: () => ({
    meta: [{ title: "Faculty Attendance Marking Portal — EduSuite Pro" }],
  }),
  component: DashboardAttendanceMarkPage,
});

function DashboardAttendanceMarkPage() {
  return <FacultyModuleView initialTab="attendance-mark" />;
}
