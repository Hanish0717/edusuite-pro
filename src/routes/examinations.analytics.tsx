import { createFileRoute } from "@tanstack/react-router";
import { ExamAnalyticsComponent } from "@/modules/examinations/ExamAnalyticsComponent";

export const Route = createFileRoute("/examinations/analytics")({
  head: () => ({ meta: [{ title: "Exam Analytics — EduSuite Pro" }] }),
  component: ExamAnalyticsPage,
});

function ExamAnalyticsPage() {
  return <ExamAnalyticsComponent />;
}
