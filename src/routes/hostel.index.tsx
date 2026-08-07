import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/hostel/")({
  component: () => <Navigate to="/hostel/dashboard" replace />,
});
