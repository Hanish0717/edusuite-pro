import { createFileRoute } from "@tanstack/react-router";
import { ExamScheduleView } from "@/modules/examinations/ExamScheduleComponent";

export const Route = createFileRoute("/examinations/schedule")({
  head: () => ({ meta: [{ title: "Exam Schedule — EduSuite Pro" }] }),
  component: ExamSchedulePage,
});

export function ExamSchedulePage() {
  return <ExamScheduleView />;
}
