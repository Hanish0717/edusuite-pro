import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/leave")({
  head: () => ({
    meta: [{ title: "Leave — EduSuite Pro" }],
  }),
  component: FacultyLeavePage,
});

function FacultyLeavePage() {
  return (
    <ModulePage
      title="Leave Request"
      description="Apply for leave, view status and track balance quotas"
      icon={CalendarRange}
      tabs={["Leave Application", "My Leave History", "Leave Balance"]}
      highlights={[
        { label: "Casual Leaves Left", value: "8 Days" },
        { label: "Sick Leaves Left", value: "12 Days" },
        { label: "Duty Leaves Used", value: "5 Days" },
        { label: "Pending Approvals", value: "1 Request" },
      ]}
    />
  );
}
