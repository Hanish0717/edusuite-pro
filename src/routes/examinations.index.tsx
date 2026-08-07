import { createFileRoute } from "@tanstack/react-router";
import { ExaminationsModuleView } from "@/modules/examinations";

export const Route = createFileRoute("/examinations/")({
  component: ExaminationsIndexPage,
});

function ExaminationsIndexPage() {
  return <ExaminationsModuleView />;
}
