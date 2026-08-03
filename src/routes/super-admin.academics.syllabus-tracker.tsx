import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/super-admin/academics/syllabus-tracker")({
  head: () => ({
    meta: [{ title: "Academic Calendar & Syllabus Tracker — Super Admin Portal" }],
  }),
  component: SuperAdminSyllabusTrackerPage,
});

function SuperAdminSyllabusTrackerPage() {
  return <AcademicsModuleView initialTab="syllabus-tracker" />;
}
