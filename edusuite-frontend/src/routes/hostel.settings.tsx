import { createFileRoute } from "@tanstack/react-router";
import { HostelSettingsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/settings")({
  head: () => ({
    meta: [{ title: "Hostel Settings — EduSuite Pro" }],
  }),
  component: HostelSettingsPage,
});

function HostelSettingsPage() {
  return <HostelSettingsView />;
}
