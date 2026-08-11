import { createFileRoute } from "@tanstack/react-router";
import { TransportVerificationView } from "@/modules/transport";

export const Route = createFileRoute("/transport/routes")({
  head: () => ({
    meta: [{ title: "Transport Routes & Selection — EduSuite Pro" }],
  }),
  component: TransportRoutesPage,
});

function TransportRoutesPage() {
  return <TransportVerificationView />;
}
