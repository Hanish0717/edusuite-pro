import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ResultsModuleView } from "@/modules/results";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Institutional Results & Transcripts — EduSuite Pro" }] }),
  component: ResultsPage,
});

export function ResultsPage() {
  return (
    <DashboardLayout>
      <ResultsModuleView />
    </DashboardLayout>
  );
}
