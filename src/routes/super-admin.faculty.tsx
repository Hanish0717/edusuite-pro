import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/super-admin/faculty")({
  head: () => ({
    meta: [{ title: "Faculty — EduSuite Pro" }],
  }),
  component: SuperAdminFacultyPage,
});

function SuperAdminFacultyPage() {
  return (
    <ModulePage
      title="Faculty"
      description="Faculty profiles and workload"
      icon={UserCog}
      tabs={["Profiles", "Workload", "Leave"]}
      highlights={[
        { label: "Faculty", value: "186" },
        { label: "Departments", value: "8" },
        { label: "On Leave", value: "4" },
        { label: "Avg Load", value: "16 hrs" },
      ]}
    />
  );
}
