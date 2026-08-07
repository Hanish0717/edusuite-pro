import { createFileRoute } from "@tanstack/react-router";
import { HostelOutingApprovalsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/outing-approvals")({
  head: () => ({
    meta: [{ title: "Outing Approvals — EduSuite Pro Hostel" }],
  }),
  component: HostelOutingApprovalsPage,
});

function HostelOutingApprovalsPage() {
  return <HostelOutingApprovalsView />;
}
