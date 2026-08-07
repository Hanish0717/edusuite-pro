import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/digital")({
  component: () => <Navigate to="/librarian/digital" replace />,
});

