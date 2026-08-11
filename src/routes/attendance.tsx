import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AttendanceModuleView } from "@/modules/attendance";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [{ title: "Attendance & Biometric Tracking — EduSuite Pro" }],
  }),
  component: AttendancePage,
});

export function AttendancePage() {
  return (
    <DashboardLayout>
      <AttendanceModuleView />
    </DashboardLayout>
  );
}
