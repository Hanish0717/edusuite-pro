import { createFileRoute } from "@tanstack/react-router";
import { ExamCellDashboard } from "@/components/dashboard/role/exam-cell-dashboard";

export const Route = createFileRoute("/examcell/dashboard")({
  head: () => ({
    meta: [{ title: "Exam Cell Dashboard — EduSuite Pro" }],
  }),
  component: ExamCellDashboard,
});
