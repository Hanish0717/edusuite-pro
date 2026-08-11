import { createFileRoute } from "@tanstack/react-router";
import { AssessmentSessionManagementWorkspace } from "@/components/dashboard/role/assessment-session-management-page";

export const Route = createFileRoute("/placement/assessment-sessions")({
  head: () => ({
    meta: [{ title: "Assessment Session Management — Placement Officer Portal" }],
  }),
  component: AssessmentSessionsPage,
});

function AssessmentSessionsPage() {
  return <AssessmentSessionManagementWorkspace />;
}
