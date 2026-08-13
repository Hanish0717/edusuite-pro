import { createFileRoute } from "@tanstack/react-router";
import { SubjectAllocationModuleView } from "@/modules/subject-allocation";

export const Route = createFileRoute("/staff/academic-dean/subject-allocation")({
  head: () => ({
    meta: [{ title: "Subject Allocation — Academic Dean ERP Portal" }],
  }),
  component: SubjectAllocationModuleView,
});
