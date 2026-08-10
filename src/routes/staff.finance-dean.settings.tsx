import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/finance-dean/settings")({
  head: () => ({
    meta: [{ title: "Settings — Finance Dean" }],
  }),
  component: () => (
    <DeanSettingsView
      role="finance_dean"
      title="Finance Dean Settings"
      subtitle="Configure tuition fee structures, budget allocation cycles, vendor payment terms, and payment gateway rules."
    />
  ),
});
