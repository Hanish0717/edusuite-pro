import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentNoticeBoard } from "@/components/notice-board/student-noticeboard";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Updates — EduSuite Pro" },
      {
        name: "description",
        content: "Stay informed with the latest academic announcements, examination updates, placement notifications, scholarships, campus events, and departmental circulars.",
      },
      { property: "og:title", content: "Updates — EduSuite Pro" },
      { property: "og:description", content: "Stay informed with the latest academic announcements, examination updates, placement notifications, scholarships, campus events, and departmental circulars." },
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
