import { createFileRoute } from "@tanstack/react-router";
import { StudentDiscussionForumModule } from "@/components/student-discussion-forum";

export const Route = createFileRoute("/student/discussion-forum")({
  head: () => ({
    meta: [{ title: "Discussion Forum — EduSuite Pro" }],
  }),
  component: StudentDiscussionForumRoute,
});

function StudentDiscussionForumRoute() {
  return <StudentDiscussionForumModule />;
}
