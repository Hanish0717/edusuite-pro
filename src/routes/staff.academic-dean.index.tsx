import { createFileRoute } from "@tanstack/react-router";
import { AcademicDeanDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/academic-dean/")({
  head: () => ({
    meta: [
      { title: "Academic Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Academic leadership, outcome-based education (OBE), and curriculum management." },
    ],
  }),
  component: AcademicDeanIndexPage,
});

function AcademicDeanIndexPage() {
  return <AcademicDeanDashboard />;
}
