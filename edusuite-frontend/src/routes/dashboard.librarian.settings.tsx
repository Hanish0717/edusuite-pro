import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/settings")({
  component: () => <Navigate to="/librarian/settings" replace />,
});

