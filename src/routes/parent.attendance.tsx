import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/parent/attendance")({
  head: () => ({
    meta: [{ title: "Ward Attendance — EduSuite Pro" }],
  }),
  component: ParentAttendancePage,
});

function ParentAttendancePage() {
  return (
    <ModulePage
      title="Ward Attendance"
      description="Track subject-wise class attendance percentage and shortages."
      icon={CalendarCheck}
      tabs={["Daily Stats", "Condonation Requests"]}
      highlights={[
        { label: "Overall Attendance", value: "86.5%" },
        { label: "Total Sessions", value: "320" },
        { label: "Present Sessions", value: "277" },
        { label: "Shortage Risk", value: "None" },
      ]}
    />
  );
}
