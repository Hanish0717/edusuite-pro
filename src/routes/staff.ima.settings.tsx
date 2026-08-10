import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/ima/settings")({
  head: () => ({
    meta: [{ title: "Settings — IMA Governance" }],
  }),
  component: () => (
    <DeanSettingsView
      role="ima_dean"
      title="IMA Governance & Infrastructure Settings"
      subtitle="Configure laboratory inventories, equipment maintenance, vendor empanelment, and purchase approval thresholds."
    />
  ),
});
