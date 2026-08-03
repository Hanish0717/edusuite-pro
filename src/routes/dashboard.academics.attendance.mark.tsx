import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/dashboard/academics/attendance/mark")({
  head: () => ({
    meta: [{ title: "Faculty Attendance Marking Portal — EduSuite Pro" }],
  }),
  component: DashboardAttendanceMarkPage,
});

function DashboardAttendanceMarkPage() {
  return <AcademicsModuleView initialTab="attendance-mark" />;
}
