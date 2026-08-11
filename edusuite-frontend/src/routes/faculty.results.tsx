import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/results")({
  head: () => ({
    meta: [{ title: "Results — EduSuite Pro" }],
  }),
  component: FacultyResultsPage,
});

function FacultyResultsPage() {
  return (
    <ModulePage
      title="Results"
      description="Result publishing and analytics"
      icon={Award}
      tabs={["Published", "Revaluation", "Toppers"]}
      highlights={[
        { label: "Pass %", value: "93.4" },
        { label: "Distinctions", value: "486" },
        { label: "Revaluations", value: "38" },
        { label: "Backlogs", value: "212" },
      ]}
    />
  );
}
