import { createFileRoute } from "@tanstack/react-router";
import { PlacementOffersWorkspace } from "@/components/dashboard/role/placement-offers-page";

export const Route = createFileRoute("/placement/offers")({
  head: () => ({
    meta: [{ title: "Offer Verification & Placement Center — Placement Officer Portal" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  return <PlacementOffersWorkspace />;
}
