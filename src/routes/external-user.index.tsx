import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/external-user/")({
  beforeLoad: () => {
    throw redirect({ to: "/external-user/dashboard" });
  },
});
