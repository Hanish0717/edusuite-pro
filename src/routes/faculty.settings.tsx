import { createFileRoute } from "@tanstack/react-router";
import { SettingsModule } from "@/components/dashboard/settings/settings-module";

export const Route = createFileRoute("/faculty/settings")({
  head: () => ({
    meta: [{ title: "Settings — EduSuite Pro" }],
  }),
  component: FacultySettingsPage,
});

function FacultySettingsPage() {
  return <SettingsModule />;
}
