import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/academic-dean/settings")({
  head: () => ({
    meta: [{ title: "Settings — Academic Dean" }],
  }),
  component: () => (
    <DeanSettingsView
      role="academic_dean"
      title="Academic Dean Settings"
      subtitle="Configure academic regulations, semester rules, curriculum standards, and executive profile."
    />
  ),
});
