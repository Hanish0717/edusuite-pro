import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/finance-dean")({
  component: FinanceLayout,
});

function FinanceLayout() {
  return <Outlet />;
}
