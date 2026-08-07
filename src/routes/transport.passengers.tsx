import { createFileRoute } from "@tanstack/react-router";
import { StudentsModuleView } from "@/modules/students";

export const Route = createFileRoute("/transport/passengers")({
  head: () => ({
    meta: [{ title: "Transport Passengers & Pass Holders — EduSuite Pro" }],
  }),
  component: TransportPassengersPage,
});

function TransportPassengersPage() {
  return <StudentsModuleView />;
}
