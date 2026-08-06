import { createFileRoute } from "@tanstack/react-router";
import { HostelLeavesSuspensionView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/leaves-suspension")({
  head: () => ({
    meta: [{ title: "Leaves & Suspension — EduSuite Pro Hostel" }],
  }),
  component: HostelLeavesSuspensionPage,
});

function HostelLeavesSuspensionPage() {
  return <HostelLeavesSuspensionView />;
}
