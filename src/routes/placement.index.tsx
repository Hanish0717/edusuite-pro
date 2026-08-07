import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/placement/")({
  beforeLoad: () => {
    throw redirect({ to: "/placement/dashboard" });
  },
});
