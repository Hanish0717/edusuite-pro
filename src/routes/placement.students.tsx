import { createFileRoute } from "@tanstack/react-router";
import { PlacementStudentsWorkspace } from "@/components/dashboard/role/placement-students-page";

export const Route = createFileRoute("/placement/students")({
  head: () => ({
    meta: [{ title: "Student Placement Directory — Placement Officer Portal" }],
  }),
  component: PlacementStudentsPage,
});

function PlacementStudentsPage() {
  return <PlacementStudentsWorkspace />;
}
