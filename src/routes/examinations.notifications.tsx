import { createFileRoute } from "@tanstack/react-router";
import { ExamNotificationsComponent } from "@/modules/examinations/ExamNotificationsComponent";

export const Route = createFileRoute("/examinations/notifications")({
  head: () => ({ meta: [{ title: "Exam Notifications — EduSuite Pro" }] }),
  component: ExamNotificationsPage,
});

export function ExamNotificationsPage() {
  return <ExamNotificationsComponent />;
}
