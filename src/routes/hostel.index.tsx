import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hostel/")({
  beforeLoad: () => {
    throw redirect({ to: "/hostel/dashboard" });
  },
});
