import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/library/issues")({
  component: () => <Navigate to="/dashboard/librarian/issue-books" replace />,
});
