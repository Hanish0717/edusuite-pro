import { createFileRoute } from "@tanstack/react-router";
import { IMADashboard } from "@/modules/deans";

export const Route = createFileRoute("/staff/ima/")({
  head: () => ({
    meta: [
      { title: "IMA Dean Cockpit — EduSuite Pro" },
      { name: "description", content: "Institutional management, infrastructure projects, and compliance." },
    ],
  }),
  component: ImaIndexPage,
});

function ImaIndexPage() {
  return <IMADashboard />;
}
