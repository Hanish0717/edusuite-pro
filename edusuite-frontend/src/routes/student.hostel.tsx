import { createFileRoute } from "@tanstack/react-router";
import { StudentHostelModule } from "@/components/student-hostel";

export const Route = createFileRoute("/student/hostel")({
  head: () => ({
    meta: [
      { title: "Hostel Management — EduSuite Pro" },
      {
        name: "description",
        content: "Manage hostel accommodation, room details, mess services, gate passes, complaints and hostel payments.",
      },
      { property: "og:title", content: "Hostel Management — EduSuite Pro" },
      { property: "og:description", content: "Manage hostel accommodation, room details, mess services, gate passes, complaints and hostel payments." },
    ],
  }),
  component: StudentHostelRoute,
});

function StudentHostelRoute() {
  return <StudentHostelModule />;
}
