import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dean/")({
  beforeLoad: () => {
    throw redirect({ to: "/dean/dashboard" });
  },
});
