import { createFileRoute } from "@tanstack/react-router";
import { AcademicsModuleView } from "@/modules/academics";

export const Route = createFileRoute("/super-admin/academics")({
  head: () => ({
    meta: [{ title: "Academics & Faculty Governance — Super Admin Portal" }],
  }),
  component: SuperAdminAcademicsPage,
});

function SuperAdminAcademicsPage() {
  return <AcademicsModuleView initialTab="departments" />;
}
