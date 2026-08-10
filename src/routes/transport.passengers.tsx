import { createFileRoute } from "@tanstack/react-router";
import { StudentsModuleView } from "@/modules/students";

export const Route = createFileRoute("/transport/passengers")({
  head: () => ({
    meta: [{ title: "Transport Passengers & Pass Holders — EduSuite Pro" }],
  }),
  component: TransportPassengersPage,
});

function TransportPassengersPage() {
  return (
    <StudentsModuleView
      title="Transport Passengers & Pass Holders"
      description="Manage student and staff transport pass allocations, bus stops, and route subscriptions."
    />
  );
}
