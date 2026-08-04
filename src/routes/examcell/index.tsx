import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/examcell/")({
  beforeLoad: () => {
    throw redirect({ to: "/examcell/updates" });
  },
});
