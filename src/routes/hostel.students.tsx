import { createFileRoute } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/hostel/students")({
  head: () => ({
    meta: [{ title: "Hostel Students — EduSuite Pro" }],
  }),
  component: HostelStudentsPage,
});

function HostelStudentsPage() {
  return (
    <ModulePage
      title="Hostel Students"
      description="Track hostel inmates details, gate passes, and discipline reports."
      icon={BedDouble}
      tabs={["Active Inmates", "Gate Passes Logs", "Disciplinary Reports"]}
      highlights={[
        { label: "Active Inmates", value: "1,058" },
        { label: "Checked Out", value: "24" },
        { label: "Late Entries Today", value: "6" },
        { label: "Gate Passes Pending", value: "3" },
      ]}
    />
  );
}
