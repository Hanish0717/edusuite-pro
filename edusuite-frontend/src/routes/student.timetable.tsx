import { createFileRoute } from "@tanstack/react-router";
import { StudentTimetableModule } from "@/components/student-timetable";

export const Route = createFileRoute("/student/timetable")({
  head: () => ({
    meta: [{ title: "Student Timetable & Schedule — EduSuite Pro" }],
  }),
  component: StudentTimetablePage,
});

function StudentTimetablePage() {
  return <StudentTimetableModule />;
}
