import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TimetableModuleView } from "@/modules/timetable";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [{ title: "Timetable & Schedule — EduSuite Pro" }],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  return (
    <DashboardLayout>
      <TimetableModuleView />
    </DashboardLayout>
  );
}
