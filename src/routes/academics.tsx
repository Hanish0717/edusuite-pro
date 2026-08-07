import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicsModuleView } from "@/modules/academics";

const academicsSearchSchema = z.object({
  tab: z.enum(["courses", "departments", "curriculum"]).optional(),
});

export const Route = createFileRoute("/academics")({
  validateSearch: (search) => academicsSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Academics & Curriculum — EduSuite Pro" }],
  }),
  component: AcademicsPage,
});

function AcademicsPage() {
  const search = Route.useSearch();
  return (
    <DashboardLayout>
      <AcademicsModuleView initialTab={search.tab || "departments"} />
    </DashboardLayout>
  );
}

