import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/examinations")({
  head: () => ({
    meta: [{ title: "Examinations — EduSuite Pro" }],
  }),
  component: FacultyExaminationsPage,
});

function FacultyExaminationsPage() {
  return (
    <ModulePage
      title="Examinations"
      description="Schedules, hall tickets and internals"
      icon={FileSpreadsheet}
      tabs={["Exam Schedule", "Hall Tickets", "Internal Marks"]}
      highlights={[
        { label: "Upcoming", value: "3" },
        { label: "Halls", value: "24" },
        { label: "Hall Tickets", value: "2,980" },
        { label: "Invigilators", value: "140" },
      ]}
    />
  );
}
