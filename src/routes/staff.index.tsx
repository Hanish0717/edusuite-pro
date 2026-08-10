import { createFileRoute } from "@tanstack/react-router";
import { DeanSelectionView } from "@/modules/deans";

export const Route = createFileRoute("/staff/")({
  head: () => ({
    meta: [
      { title: "Dean Selection Hub — EduSuite Pro" },
      {
        name: "description",
        content: "Select from 8 Executive Dean Cockpits: Academic, Student, IQAC, IMA, R&D, Finance, Examination, and Placement.",
      },
    ],
  }),
  component: StaffIndexPage,
});

function StaffIndexPage() {
  return <DeanSelectionView />;
}
