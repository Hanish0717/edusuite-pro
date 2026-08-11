import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/id-cards")({
  component: () => <Navigate to="/librarian/id-cards" replace />,
});

