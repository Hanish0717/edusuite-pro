import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/student/lms")({
  head: () => ({
    meta: [{ title: "Student LMS — EduSuite Pro" }],
  }),
  component: StudentLmsPage,
});

function StudentLmsPage() {
  return (
    <ModulePage
      title="Student LMS"
      description="View class notes, pending assignments, and attempt online quizzes."
      icon={BookOpen}
      tabs={["My Assignments", "Class Notes", "Attempt Quizzes"]}
      highlights={[
        { label: "Pending Tasks", value: "3" },
        { label: "Notes Downloaded", value: "24" },
        { label: "Quizzes Attempted", value: "12" },
        { label: "Avg Quiz Score", value: "88%" },
      ]}
    />
  );
}
