import { createFileRoute } from "@tanstack/react-router";
import { StudentsModuleView } from "@/modules/students";

export const Route = createFileRoute("/students/")({
  component: StudentsIndexPage,
});

function StudentsIndexPage() {
  return <StudentsModuleView />;
}
