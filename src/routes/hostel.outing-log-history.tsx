import { createFileRoute } from "@tanstack/react-router";
import { HostelOutingLogHistoryView } from "@/modules/hostel";

export const Route = createFileRoute("/hostel/outing-log-history")({
  head: () => ({
    meta: [{ title: "Outing Log History — EduSuite Pro Hostel" }],
  }),
  component: HostelOutingLogHistoryPage,
});

function HostelOutingLogHistoryPage() {
  return <HostelOutingLogHistoryView />;
}
