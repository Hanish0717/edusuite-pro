import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/placement/drives")({
  head: () => ({
    meta: [{ title: "Placement Drives — EduSuite Pro" }],
  }),
  component: PlacementDrivesPage,
});

function PlacementDrivesPage() {
  return (
    <ModulePage
      title="Placement Drives"
      description="Active placement drives schedules, eligibility checks, and shortlist criteria."
      icon={Briefcase}
      tabs={["Scheduled Drives", "Completed Drives", "Shortlisted Logs"]}
      highlights={[
        { label: "Active Drives", value: "8" },
        { label: "Upcoming drives", value: "14" },
        { label: "Total Offers", value: "738" },
        { label: "Highest Package", value: "Rs 24 LPA" },
      ]}
    />
  );
}
