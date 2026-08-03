import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicsModuleView } from "@/modules/academics";

const academicsSearchSchema = z.object({
  tab: z
    .enum([
      "courses",
      "departments",
      "curriculum",
      "faculty-status",
      "attendance-mark",
      "syllabus-tracker",
    ])
    .optional(),
});

export const Route = createFileRoute("/academics")({
  validateSearch: (search) => academicsSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Academics & Faculty Management — EduSuite Pro" }],
  }),
  component: AcademicsPage,
});

export function AcademicsPage() {
  const { tab } = Route.useSearch();
  return (
    <DashboardLayout>
      <AcademicsModuleView initialTab={tab || "faculty-status"} />
    </DashboardLayout>
  );
}
