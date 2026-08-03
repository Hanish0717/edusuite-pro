import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/dashboard/academics/syllabus-tracker")({
  head: () => ({
    meta: [{ title: "Academic Calendar & Syllabus Tracker — EduSuite Pro" }],
  }),
  component: DashboardSyllabusTrackerPage,
});

function DashboardSyllabusTrackerPage() {
  return <AcademicsModuleView initialTab="syllabus-tracker" />;
}
