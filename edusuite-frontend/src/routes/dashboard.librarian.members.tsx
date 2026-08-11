import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/members")({
  component: () => <Navigate to="/librarian/members" replace />,
});

