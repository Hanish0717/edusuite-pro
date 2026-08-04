import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/reports")({
  component: () => <Navigate to="/librarian/reports" replace />,
});

