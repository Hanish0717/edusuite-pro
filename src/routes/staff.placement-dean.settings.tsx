import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/placement-dean/settings")({
  head: () => ({
    meta: [{ title: "Settings — Placement Dean" }],
  }),
  component: () => (
    <DeanSettingsView
      role="placement_dean"
      title="Placement Dean Settings"
      subtitle="Configure CTC package tier cutoffs, student eligibility CGPA thresholds, internship rules, and offer acceptance SLAs."
    />
  ),
});
