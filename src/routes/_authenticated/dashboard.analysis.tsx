import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/analysis")({
  component: () => <Navigate to="/dashboard/analisis-kontrak" replace />,
});
