import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/examcell/corrections")({
  beforeLoad: () => {
    throw redirect({ to: "/examcell/correction-requests" });
  },
});
