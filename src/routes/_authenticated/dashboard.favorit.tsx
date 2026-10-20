import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/dashboard/favorit")({
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard/bookmarks",
      search: { q: "", type: "all", sort: "newest" },
      statusCode: 301,
    });
  },
});
