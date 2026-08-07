import { createFileRoute } from "@tanstack/react-router";
import { DeanSettingsView } from "@/modules/deans/components/DeanSettingsView";

export const Route = createFileRoute("/staff/research-development/settings")({
  head: () => ({
    meta: [{ title: "Settings — Research & Development" }],
  }),
  component: () => (
    <DeanSettingsView
      role="research_dean"
      title="Research & Development Settings"
      subtitle="Configure funding agency guidelines, seed money limits, patent filing support, and DRC review schedules."
    />
  ),
});
