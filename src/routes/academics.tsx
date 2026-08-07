import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicsModuleView } from "@/modules/academics";

const academicsSearchSchema = z.object({
  tab: z.enum(["courses", "departments", "curriculum"]).optional(),
});

export const Route = createFileRoute("/academics")({
  validateSearch: (search: Record<string, unknown>) => {
    const rawTab = search["tab"];
    const tabStr = typeof rawTab === "string" ? rawTab : undefined;
    const validTabs = ["courses", "departments", "curriculum"];
    const tab = validTabs.includes(tabStr || "") ? (tabStr as any) : undefined;
    return { tab };
  },
  head: () => ({
    meta: [{ title: "Academics & Curriculum — EduSuite Pro" }],
  }),
  component: AcademicsPage,
});

export function AcademicsPage() {
  const search = Route.useSearch();
  return (
    <DashboardLayout>
      <AcademicsModuleView initialTab={search.tab || "departments"} />
    </DashboardLayout>
  );
}

