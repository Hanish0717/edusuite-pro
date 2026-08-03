import { createFileRoute } from "@tanstack/react-router";
import { TimetableModuleView } from "@/modules/timetable";

export const Route = createFileRoute("/super-admin/timetable")({
  head: () => ({
    meta: [{ title: "Automated Timetable Management — Super Admin Portal" }],
  }),
  component: SuperAdminTimetablePage,
});

function SuperAdminTimetablePage() {
  return <TimetableModuleView />;
}
