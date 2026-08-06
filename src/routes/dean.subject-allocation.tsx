import { createFileRoute } from "@tanstack/react-router";
import { SubjectAllocationModuleView } from "@/modules/subject-allocation";

export const Route = createFileRoute("/dean/subject-allocation")({
  head: () => ({
    meta: [{ title: "Subject Allocation & Workload — EduSuite Pro" }],
  }),
  component: SubjectAllocationModuleView,
});
