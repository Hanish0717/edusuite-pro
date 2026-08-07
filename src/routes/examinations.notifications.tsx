import { createFileRoute } from "@tanstack/react-router";
import { ExamNotificationsComponent } from "@/modules/examinations/ExamNotificationsComponent";

export const Route = createFileRoute("/examinations/notifications")({
  head: () => ({ meta: [{ title: "Exam Notifications — EduSuite Pro" }] }),
  component: ExamNotificationsPage,
});

function ExamNotificationsPage() {
  return <ExamNotificationsComponent />;
}
