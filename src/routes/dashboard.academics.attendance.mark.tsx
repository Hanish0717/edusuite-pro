import { createFileRoute } from "@tanstack/react-router";
import { AttendanceModuleView } from "@/modules/attendance";

export const Route = createFileRoute("/dashboard/academics/attendance/mark")({
  head: () => ({
    meta: [{ title: "Faculty Attendance Marking Portal — EduSuite Pro" }],
  }),
  component: DashboardAttendanceMarkPage,
});

function DashboardAttendanceMarkPage() {
  return <AttendanceModuleView initialTab="attendance-mark" />;
}
