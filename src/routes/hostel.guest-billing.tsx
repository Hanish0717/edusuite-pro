import { createFileRoute } from "@tanstack/react-router";
import { HostelGuestBillingView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/guest-billing")({
  head: () => ({
    meta: [{ title: "Guest Billing — EduSuite Pro Hostel" }],
  }),
  component: HostelGuestBillingPage,
});

function HostelGuestBillingPage() {
  return <HostelGuestBillingView />;
}
