import { createFileRoute } from "@tanstack/react-router";
import { StudentLmsModule } from "@/components/student-lms";

export const Route = createFileRoute("/student/lms")({
  head: () => ({
    meta: [{ title: "Student LMS & Learning Hub — EduSuite Pro" }],
  }),
  component: StudentLmsPage,
});

function StudentLmsPage() {
  return <StudentLmsModule />;
}
