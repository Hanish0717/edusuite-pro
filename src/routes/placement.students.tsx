import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/placement/students")({
  head: () => ({
    meta: [{ title: "Placement Students Status — EduSuite Pro" }],
  }),
  component: PlacementStudentsPage,
});

function PlacementStudentsPage() {
  return (
    <ModulePage
      title="Eligible Students"
      description="Track student registration status, resumes, and backlog filters."
      icon={Users}
      tabs={["Eligible Batch", "Resumes Submitted", "Placed Students"]}
      highlights={[
        { label: "Registered Students", value: "812" },
        { label: "Placed count", value: "665" },
        { label: "Unplaced count", value: "147" },
        { label: "Placed %", value: "82%" },
      ]}
    />
  );
}
