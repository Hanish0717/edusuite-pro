import { createFileRoute } from "@tanstack/react-router";
import { HostelAttendanceView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/attendance")({
  head: () => ({
    meta: [{ title: "Hostel Daily Attendance — EduSuite Pro" }],
  }),
  component: HostelAttendancePage,
});

function HostelAttendancePage() {
  return <HostelAttendanceView />;
}
