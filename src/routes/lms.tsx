import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/lms")({
  head: () => ({
    meta: [
      { title: "LMS — EduSuite Pro" },
      { name: "description", content: "Notes, assignments and quizzes in EduSuite Pro college ERP." },
      { property: "og:title", content: "LMS — EduSuite Pro" },
      { property: "og:description", content: "Notes, assignments and quizzes." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <ModulePage
        title="LMS"
        description="Notes, assignments and quizzes"
        icon={BookOpen}
        tabs={["Courses", "Assignments", "Quizzes"]}
        highlights={[{"label": "Courses", "value": "128"}, {"label": "Assignments", "value": "412"}, {"label": "Submissions", "value": "6,204"}, {"label": "Quizzes", "value": "96"}]}
      />
    </DashboardLayout>
  );
}
