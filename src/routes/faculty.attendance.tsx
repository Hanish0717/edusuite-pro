import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/attendance")({
  head: () => ({
    meta: [{ title: "Attendance — EduSuite Pro" }],
  }),
  component: FacultyAttendancePage,
});

function FacultyAttendancePage() {
  return (
    <ModulePage
      title="Attendance"
      description="Period-wise attendance and shortage alerts"
      icon={CalendarCheck}
      tabs={["Daily", "Subject Wise", "Shortage"]}
      highlights={[
        { label: "Today", value: "92%" },
        { label: "This Month", value: "89%" },
        { label: "Shortage", value: "112" },
        { label: "Condoned", value: "23" },
      ]}
    />
  );
}
