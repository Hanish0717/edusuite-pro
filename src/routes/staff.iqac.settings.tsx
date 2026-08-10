import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/iqac/settings")({
  head: () => ({
    meta: [{ title: "Settings — IQAC Dean" }],
  }),
  component: () => (
    <DeanSettingsView
      role="iqac_dean"
      title="IQAC Quality Settings"
      subtitle="Configure NAAC/NBA targets, AQAR deadlines, quality metrics, and internal audit schedules."
    />
  ),
});
