import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/student/results")({
  head: () => ({
    meta: [{ title: "My Results — EduSuite Pro" }],
  }),
  component: StudentResultsPage,
});

function StudentResultsPage() {
  return (
    <ModulePage
      title="My Results"
      description="Semester CGPA, SGPA, and subject-wise score breakdown."
      icon={Award}
      tabs={["Active Semester", "Previous CGPA", "Revaluation"]}
      highlights={[
        { label: "Current CGPA", value: "9.12" },
        { label: "Last SGPA", value: "9.30" },
        { label: "Backlogs", value: "0" },
        { label: "Credits Cleared", value: "114" },
      ]}
    />
  );
}
