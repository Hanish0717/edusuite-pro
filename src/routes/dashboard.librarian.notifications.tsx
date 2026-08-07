import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/notifications")({
  component: () => <Navigate to="/librarian/notifications" replace />,
});

