import { createFileRoute } from "@tanstack/react-router";
import { StudentLibraryModule } from "@/components/student-library";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/student/library")({
  component: StudentLibraryRoute,
});

function StudentLibraryRoute() {
  return (
    <DashboardLayout activeSection="Student Workspace" activeItem="OPAC">
      <StudentLibraryModule />
    </DashboardLayout>
  );
}
