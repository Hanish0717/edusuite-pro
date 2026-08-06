import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/fines")({
  component: () => <Navigate to="/librarian/fines" replace />,
});

