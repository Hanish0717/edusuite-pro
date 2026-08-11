import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/faculty/examinations")({
  beforeLoad: () => {
    throw redirect({ to: "/faculty/evaluation-and-marks" });
  },
});
