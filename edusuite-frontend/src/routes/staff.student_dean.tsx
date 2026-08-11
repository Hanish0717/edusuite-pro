import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/student_dean")({
  beforeLoad: ({ location }) => {
    const targetPath = location.pathname.replace("/staff/student_dean", "/staff/student-dean");
    throw redirect({ to: targetPath });
  },
});
