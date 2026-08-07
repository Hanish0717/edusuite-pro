import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/library/issues")({
  head: () => ({
    meta: [{ title: "Library Circulation — EduSuite Pro" }],
  }),
  component: LibraryIssuesPage,
});

function LibraryIssuesPage() {
  return (
    <ModulePage
      title="Circulation Control"
      description="Manage book issue, return registry, student fines, and dues check."
      icon={BookOpen}
      tabs={["Issued Books", "Return Registry", "Fines & Dues"]}
      highlights={[
        { label: "Issued Today", value: "48" },
        { label: "Returns Pending", value: "112" },
        { label: "Overdue Notices", value: "24" },
        { label: "Fines Collected", value: "Rs 1,240" },
      ]}
    />
  );
}
