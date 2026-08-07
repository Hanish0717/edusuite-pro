import { createFileRoute } from "@tanstack/react-router";
import { TransportVerificationView } from "@/modules/transport";

export const Route = createFileRoute("/transport/buses")({
  head: () => ({
    meta: [{ title: "Transport Verification & Route Selection — EduSuite Pro" }],
  }),
  component: TransportBusesPage,
});

function TransportBusesPage() {
  return <TransportVerificationView />;
}
