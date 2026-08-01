import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentNoticeBoard } from "@/components/notice-board/student-noticeboard";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Digital Notice Board — EduSuite Pro" },
      {
        name: "description",
        content: "Official notices published by the college for academics, examinations, placements, scholarships, and events.",
      },
      { property: "og:title", content: "Digital Notice Board — EduSuite Pro" },
      { property: "og:description", content: "Official notices published by the college for academics, examinations, placements, scholarships, and events." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <StudentNoticeBoard />
      </div>
    </DashboardLayout>
  );
}
