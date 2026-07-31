import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/transport/")({
  beforeLoad: () => {
    throw redirect({ to: "/transport/dashboard" });
  },
});
