import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/examination/")({
  beforeLoad: () => {
    throw redirect({ to: "/examination/dashboard" });
  },
});
