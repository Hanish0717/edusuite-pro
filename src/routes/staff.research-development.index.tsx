import { createFileRoute } from "@tanstack/react-router";
import { ResearchDeanDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/research-development/")({
  head: () => ({
    meta: [
      { title: "Research & Development Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Sponsored research, patents, SCI journals, and innovation grants." },
    ],
  }),
  component: ResearchIndexPage,
});

function ResearchIndexPage() {
  return <ResearchDeanDashboard />;
}
