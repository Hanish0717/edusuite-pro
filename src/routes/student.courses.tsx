import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/student/courses")({
  head: () => ({
    meta: [{ title: "Courses — EduSuite Pro" }],
  }),
  component: StudentCoursesPage,
});

function StudentCoursesPage() {
  return (
    <ModulePage
      title="Courses"
      description="Your enrolled courses, credit score, and curriculum syllabus."
      icon={GraduationCap}
      tabs={["Active Courses", "Syllabus", "Regulations"]}
      highlights={[
        { label: "Semester Credit", value: "24" },
        { label: "Core Courses", value: "5" },
        { label: "Electives", value: "2" },
        { label: "Total Credit Earned", value: "114" },
      ]}
    />
  );
}
