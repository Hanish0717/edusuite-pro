import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicCalendarModuleView } from "@/modules/academic-calendar";

export const Route = createFileRoute("/academic-calendar")({
  head: () => ({
    meta: [
      { title: "Academic Calendar & Events — EduSuite Pro" },
      {
        name: "description",
        content: "Plan and manage academic schedules, examinations, holidays, and milestones.",
      },
    ],
  }),
  component: AcademicCalendarPage,
});

function AcademicCalendarPage() {
  return (
    <DashboardLayout>
      <AcademicCalendarModuleView />
    </DashboardLayout>
  );
}
