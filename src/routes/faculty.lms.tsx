import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/faculty/lms")({
  head: () => ({
    meta: [{ title: "LMS — EduSuite Pro" }],
  }),
  component: FacultyLmsPage,
});

function FacultyLmsPage() {
  return (
    <ModulePage
      title="LMS"
      description="Notes, assignments and quizzes"
      icon={BookOpen}
      tabs={["Courses", "Assignments", "Quizzes"]}
      highlights={[
        { label: "Courses", value: "128" },
        { label: "Assignments", value: "412" },
        { label: "Submissions", value: "6,204" },
        { label: "Quizzes", value: "96" },
      ]}
    />
  );
}
