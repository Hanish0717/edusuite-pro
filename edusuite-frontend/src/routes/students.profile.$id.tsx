import { createFileRoute } from "@tanstack/react-router";
import { StudentProfile } from "@/modules/students";

export const Route = createFileRoute("/students/profile/$id")({
  head: () => ({
    meta: [{ title: "Student Dossier — EduSuite Pro" }],
  }),
  component: StudentProfileRoutePage,
});

function StudentProfileRoutePage() {
  const { id } = Route.useParams();
  return <StudentProfile studentId={id} />;
}
