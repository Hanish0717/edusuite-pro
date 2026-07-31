import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/super-admin/courses")({
  head: () => ({
    meta: [{ title: "Academics — EduSuite Pro" }],
  }),
  component: SuperAdminCoursesPage,
});

function SuperAdminCoursesPage() {
  return (
    <ModulePage
      title="Academics"
      description="Departments, courses and curriculum"
      icon={GraduationCap}
      tabs={["Departments", "Courses", "Curriculum"]}
      highlights={[
        { label: "Departments", value: "8" },
        { label: "Programmes", value: "14" },
        { label: "Courses", value: "326" },
        { label: "Regulations", value: "3" },
      ]}
    />
  );
}
