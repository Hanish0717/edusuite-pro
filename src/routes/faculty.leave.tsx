import { createFileRoute } from "@tanstack/react-router";
import { LeaveModuleView } from "@/modules/leave/LeaveComponents";

export const Route = createFileRoute("/faculty/leave")({
  head: () => ({
    meta: [{ title: "Leave Management — EduSuite Pro" }],
  }),
  component: FacultyLeavePage,
});

function FacultyLeavePage() {
  return <LeaveModuleView />;
}

