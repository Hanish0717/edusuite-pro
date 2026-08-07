import { createFileRoute } from "@tanstack/react-router";
import { ExamReportsComponent } from "@/modules/examinations/ExamReportsComponent";

export const Route = createFileRoute("/examinations/reports")({
  head: () => ({ meta: [{ title: "Exam Reports — EduSuite Pro" }] }),
  component: ExamReportsPage,
});

function ExamReportsPage() {
  return <ExamReportsComponent />;
}
