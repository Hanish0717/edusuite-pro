import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/reports")({
  head: () => ({
    meta: [{ title: "Reports — EduSuite Pro" }],
  }),
  component: FacultyReportsPage,
});

function FacultyReportsPage() {
  return (
    <ModulePage
      title="Reports"
      description="Generate academic performance sheets, attendance reports, and NBA portfolios"
      icon={BarChart3}
      tabs={["Attendance Sheets", "Marks Portfolios", "NBA Course Files"]}
      highlights={[
        { label: "Reports Generated", value: "34" },
        { label: "Course Files Status", value: "3 / 4 Done" },
        { label: "Feedback Rating", value: "4.85 / 5" },
        { label: "Audit Readiness", value: "100%" },
      ]}
    />
  );
}
