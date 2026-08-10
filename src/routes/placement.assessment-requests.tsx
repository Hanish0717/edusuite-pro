import { createFileRoute } from "@tanstack/react-router";
import { AssessmentRequestsApprovalWorkspace } from "@/components/dashboard/role/assessment-requests-approval-page";

export const Route = createFileRoute("/placement/assessment-requests")({
  head: () => ({
    meta: [{ title: "Assessment Requests Approval Center — Placement Officer Portal" }],
  }),
  component: AssessmentRequestsPage,
});

function AssessmentRequestsPage() {
  return <AssessmentRequestsApprovalWorkspace />;
}
