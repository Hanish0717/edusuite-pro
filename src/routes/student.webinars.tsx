import { createFileRoute } from "@tanstack/react-router";
import { StudentWebinarsModule } from "@/components/student-webinars";

export const Route = createFileRoute("/student/webinars")({
  head: () => ({
    meta: [{ title: "Student Live Webinars & Expert Sessions — EduSuite Pro" }],
  }),
  component: StudentWebinarsPage,
});

function StudentWebinarsPage() {
  return <StudentWebinarsModule />;
}
