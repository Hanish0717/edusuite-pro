import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hod/attendance")({
  head: () => ({
    meta: [{ title: "HOD Attendance Controls — EduSuite Pro" }],
  }),
  component: HodAttendancePage,
});

function HodAttendancePage() {
  return (
    <ModulePage
      title="Department Attendance Control"
      description="Manage student shortage logs, condonation approvals, and alerts."
      icon={CalendarCheck}
      tabs={["Shortage Alerts", "Condonation Approvals", "Daily Stats"]}
      highlights={[
        { label: "Students Below 75%", value: "14" },
        { label: "Pending Approvals", value: "3" },
        { label: "Average Attendance", value: "88.2%" },
        { label: "Condoned Today", value: "0" },
      ]}
    />
  );
}
