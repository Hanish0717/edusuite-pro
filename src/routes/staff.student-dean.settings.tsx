import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/student-dean/settings")({
  head: () => ({
    meta: [{ title: "Settings — Student Dean" }],
  }),
  component: () => (
    <DeanSettingsView
      role="student_dean"
      title="Student Dean Settings"
      subtitle="Configure student welfare, scholarship rules, grievance SLAs, hostel curfew, and discipline policy."
    />
  ),
});
