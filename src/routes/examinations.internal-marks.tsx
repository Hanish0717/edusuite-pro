import { createFileRoute } from "@tanstack/react-router";
import { InternalMarksView } from "@/modules/examinations/InternalMarksComponent";

export const Route = createFileRoute("/examinations/internal-marks")({
  head: () => ({ meta: [{ title: "Internal Marks — EduSuite Pro" }] }),
  component: InternalMarksPage,
});

function InternalMarksPage() {
  return <InternalMarksView />;
}
