import { createFileRoute } from "@tanstack/react-router";
import { StudentLibraryModule } from "@/components/student-library";

export const Route = createFileRoute("/student/library")({
  head: () => ({
    meta: [{ title: "Library — EduSuite Pro" }],
  }),
  component: StudentLibraryRoute,
});

function StudentLibraryRoute() {
  return <StudentLibraryModule />;
}
