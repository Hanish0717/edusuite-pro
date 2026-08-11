import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AcademicsModuleView, type AcademicsSubpart } from "@/modules/academics";

const VALID_TABS: AcademicsSubpart[] = [
  "courses",
  "departments",
  "curriculum",
  "faculty-status",
  "attendance-mark",
  "syllabus-tracker",
  "all-classes-attendance",
];

export const Route = createFileRoute("/academics")({
  validateSearch: (search: Record<string, unknown>) => {
    const rawTab = search["tab"];
    const tabStr = typeof rawTab === "string" ? rawTab : undefined;
    const tab = VALID_TABS.includes(tabStr as AcademicsSubpart)
      ? (tabStr as AcademicsSubpart)
      : undefined;
    return { tab };
  },
  head: () => ({
    meta: [{ title: "Academics & Faculty Governance — EduSuite Pro" }],
  }),
  component: AcademicsPage,
});

export function AcademicsPage() {
  const search = Route.useSearch();
  const tab = search?.tab as AcademicsSubpart | undefined;
  return (
    <DashboardLayout>
      <AcademicsModuleView initialTab={tab || "departments"} />
    </DashboardLayout>
  );
}
