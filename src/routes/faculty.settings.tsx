import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/settings")({
  head: () => ({
    meta: [{ title: "Settings — EduSuite Pro" }],
  }),
  component: FacultySettingsPage,
});

function FacultySettingsPage() {
  return (
    <ModulePage
      title="Settings"
      description="Update security profiles, layout preferences, and course defaults"
      icon={Settings}
      tabs={["Account & Security", "Course Preferences", "Integrations"]}
      highlights={[
        { label: "MFA Status", value: "Enabled" },
        { label: "Active Sessions", value: "1 (Windows)" },
        { label: "API Sync Status", value: "Connected" },
        { label: "Last Password Reset", value: "3 mos ago" },
      ]}
    />
  );
}
