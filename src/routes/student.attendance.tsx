import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({
    meta: [{ title: "My Attendance — EduSuite Pro" }],
  }),
  component: StudentAttendancePage,
});

function StudentAttendancePage() {
  return (
    <ModulePage
      title="My Attendance"
      description="Subject-wise attendance, shortage risk alerts, and condonation history."
      icon={CalendarCheck}
      tabs={["Subject Wise", "Daily Logs", "Shortage Risk"]}
      highlights={[
        { label: "Overall Attendance", value: "86.5%" },
        { label: "Shortage Subjects", value: "0" },
        { label: "Leaves Availed", value: "4" },
        { label: "Condoned Hours", value: "0" },
      ]}
    />
  );
}
