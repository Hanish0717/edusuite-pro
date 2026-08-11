import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentPromotionModuleView } from "@/modules/promotions";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Student Promotion & Graduation — EduSuite Pro" },
      {
        name: "description",
        content: "Review academic eligibility, manage semester promotions, graduation status, and degree completion.",
      },
    ],
  }),
  component: PromotionsPage,
});

function PromotionsPage() {
  return (
    <DashboardLayout>
      <StudentPromotionModuleView />
    </DashboardLayout>
  );
}
