import { createFileRoute } from "@tanstack/react-router";
import { FacultyModuleView } from "@/modules/faculty";

export const Route = createFileRoute("/super-admin/academics/syllabus-tracker")({
  head: () => ({
    meta: [{ title: "Academic Calendar & Syllabus Tracker — Super Admin Portal" }],
  }),
  component: SuperAdminSyllabusTrackerPage,
});

function SuperAdminSyllabusTrackerPage() {
  return <FacultyModuleView initialTab="syllabus-tracker" />;
}
