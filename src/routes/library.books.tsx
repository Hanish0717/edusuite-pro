import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/library/books")({
  component: () => <Navigate to="/dashboard/librarian/books" replace />,
});
