import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/placement/companies")({
  head: () => ({
    meta: [{ title: "Placement Companies — EduSuite Pro" }],
  }),
  component: PlacementCompaniesPage,
});

function PlacementCompaniesPage() {
  return (
    <ModulePage
      title="Registered Recruiters"
      description="Manage corporate partnerships and campus recruiters list."
      icon={Briefcase}
      tabs={["Active Partners", "Contract Renewal", "Blacklist Logs"]}
      highlights={[
        { label: "Partner Companies", value: "84" },
        { label: "New this Year", value: "12" },
        { label: "MOU Signed", value: "76" },
        { label: "Job Postings", value: "148" },
      ]}
    />
  );
}
