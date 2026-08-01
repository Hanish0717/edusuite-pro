import { createFileRoute } from "@tanstack/react-router";
import { StudentFeedbackModule } from "@/components/student-feedback";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/student/feedback")({
  head: () => ({
    meta: [{ title: "Feedback & Grievance Portal — EduSuite Pro" }],
  }),
  component: StudentFeedbackRoute,
});

function StudentFeedbackRoute() {
  return (
    <DashboardLayout activeSection="Student Workspace" activeItem="Feedback">
      <StudentFeedbackModule />
    </DashboardLayout>
  );
}
