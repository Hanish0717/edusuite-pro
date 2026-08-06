import { createFileRoute } from "@tanstack/react-router";
import { ExaminationDeanDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/examination-dean/")({
  head: () => ({
    meta: [
      { title: "Examination Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Controller of examinations, schedules, hall tickets, and results." },
    ],
  }),
  component: ExaminationIndexPage,
});

function ExaminationIndexPage() {
  return <ExaminationDeanDashboard />;
}
