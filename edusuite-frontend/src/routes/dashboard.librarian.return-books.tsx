import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/return-books")({
  component: () => <Navigate to="/librarian/return-books" replace />,
});

