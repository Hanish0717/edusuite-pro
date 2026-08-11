import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/examination-dean/settings")({
  head: () => ({
    meta: [{ title: "Settings — Examination Dean" }],
  }),
  component: () => (
    <DeanSettingsView
      role="examination_dean"
      title="Examination Dean Settings"
      subtitle="Configure exam durations, hall ticket attendance cutoffs, revaluation windows, and invigilator ratios."
    />
  ),
});
