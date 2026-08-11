import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "./settings";

export const Route = createFileRoute("/super-admin/settings")({
  head: () => ({
    meta: [{ title: "Settings — EduSuite Pro" }],
  }),
  component: () => <SettingsPage withLayout={false} />,
});
