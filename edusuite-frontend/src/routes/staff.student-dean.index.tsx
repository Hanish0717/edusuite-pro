import { createFileRoute } from "@tanstack/react-router";
import { StudentDeanDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/student-dean/")({
  head: () => ({
    meta: [
      { title: "Student Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Student affairs, grievance redressal, and campus life." },
    ],
  }),
  component: StudentDeanIndexPage,
});

function StudentDeanIndexPage() {
  return <StudentDeanDashboard />;
}
