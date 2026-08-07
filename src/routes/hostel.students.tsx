import { createFileRoute } from "@tanstack/react-router";
import { HostelResidentsView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/students")({
  head: () => ({
    meta: [{ title: "Hostel Resident Scholars — EduSuite Pro" }],
  }),
  component: HostelStudentsPage,
});

function HostelStudentsPage() {
  return <HostelResidentsView />;
}
