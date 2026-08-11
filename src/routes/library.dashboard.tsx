import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/library/dashboard")({
  component: () => <Navigate to="/dashboard/librarian" replace />,
});
