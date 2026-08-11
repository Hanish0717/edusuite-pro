import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/dashboard/academics/syllabus-tracker")({
  head: () => ({
    meta: [{ title: "Academic Calendar & Syllabus Tracker — EduSuite Pro" }],
  }),
  component: DashboardSyllabusTrackerPage,
});

function DashboardSyllabusTrackerPage() {
  return <FacultyModuleView initialTab="syllabus-tracker" />;
}
