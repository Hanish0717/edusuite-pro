import { createFileRoute } from "@tanstack/react-router";
import { CompanyManagementWorkspace } from "@/components/dashboard/role/company-management";

export const Route = createFileRoute("/placement/companies")({
  head: () => ({
    meta: [{ title: "Company Management — Placement Officer Portal" }],
  }),
  component: PlacementCompaniesPage,
});

function PlacementCompaniesPage() {
  return <CompanyManagementWorkspace />;
}
