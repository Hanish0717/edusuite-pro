import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian")({
  component: () => <Navigate to="/librarian" replace />,
});
