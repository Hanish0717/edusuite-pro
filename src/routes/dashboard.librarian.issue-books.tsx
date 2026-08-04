import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/librarian/issue-books")({
  component: () => <Navigate to="/librarian/issue-books" replace />,
});

