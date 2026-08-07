import { createFileRoute } from "@tanstack/react-router";
import { IQACDashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/iqac/")({
  head: () => ({
    meta: [
      { title: "IQAC Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Internal Quality Assurance Cell, NAAC A++ metrics, and AQAR filings." },
    ],
  }),
  component: IqacIndexPage,
});

function IqacIndexPage() {
  return <IQACDashboard />;
}
