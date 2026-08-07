import { createFileRoute } from "@tanstack/react-router";
import { RevaluationComponent } from "@/modules/examinations/RevaluationComponent";

export const Route = createFileRoute("/examinations/revaluation")({
  head: () => ({ meta: [{ title: "Revaluation — EduSuite Pro" }] }),
  component: RevaluationPage,
});

export function RevaluationPage() {
  return <RevaluationComponent />;
}
