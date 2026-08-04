import { createFileRoute } from "@tanstack/react-router";
import { TimetableModuleView } from "@/modules/timetable";

export const Route = createFileRoute("/dashboard/academics/timetable")({
  head: () => ({
    meta: [{ title: "Automated Timetable Management — EduSuite Pro" }],
  }),
  component: DashboardTimetablePage,
});

function DashboardTimetablePage() {
  return <TimetableModuleView />;
}
