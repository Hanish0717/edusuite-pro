import { createFileRoute } from "@tanstack/react-router";
import { ExamCellDashboard } from "@/components/dashboard/role/exam-cell-dashboard";

export const Route = createFileRoute("/examination/dashboard")({
  head: () => ({
    meta: [{ title: "Exam Controller Dashboard — EduSuite Pro" }],
  }),
  component: ExamCellDashboard,
});
