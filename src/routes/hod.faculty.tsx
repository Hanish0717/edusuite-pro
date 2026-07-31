import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hod/faculty")({
  head: () => ({
    meta: [{ title: "HOD Faculty Control — EduSuite Pro" }],
  }),
  component: HodFacultyPage,
});

function HodFacultyPage() {
  return (
    <ModulePage
      title="Department Faculty"
      description="Manage department faculty profiles, load distribution, and leaves."
      icon={UserCog}
      tabs={["Active Faculty", "Load Distribution", "Leave Approvals"]}
      highlights={[
        { label: "Dept Faculty", value: "32" },
        { label: "Avg Load Hour", value: "14 hrs" },
        { label: "Pending Leaves", value: "2" },
        { label: "Vacant Slots", value: "1" },
      ]}
    />
  );
}
