import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/faculty/")({
  beforeLoad: () => {
    throw redirect({ to: "/faculty/dashboard" });
  },
});
