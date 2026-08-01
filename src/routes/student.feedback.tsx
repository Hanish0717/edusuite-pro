import { createFileRoute } from "@tanstack/react-router";
import { StudentFeedbackModule } from "@/components/student-feedback";

export const Route = createFileRoute("/student/feedback")({
  head: () => ({
    meta: [{ title: "Feedback Portal — EduSuite Pro" }],
  }),
  component: StudentFeedbackRoute,
});

function StudentFeedbackRoute() {
  return <StudentFeedbackModule />;
}
