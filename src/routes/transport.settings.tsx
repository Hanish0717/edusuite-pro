import { createFileRoute } from "@tanstack/react-router";
import { TransportSettingsView } from "@/modules/transport";

export const Route = createFileRoute("/transport/settings")({
  head: () => ({
    meta: [{ title: "Settings & Profile Details — EduSuite Pro" }],
  }),
  component: TransportSettingsPage,
});

function TransportSettingsPage() {
  return <TransportSettingsView />;
}
