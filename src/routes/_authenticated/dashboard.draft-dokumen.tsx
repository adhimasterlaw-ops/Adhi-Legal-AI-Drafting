import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/dashboard/draft-dokumen")({
  head: () => ({
    meta: [
      { title: "Draft Dokumen — LegalAI Indonesia" },
      { name: "description", content: "Susun dokumen hukum Indonesia dengan bantuan AI." },
      { property: "og:title", content: "Draft Dokumen — LegalAI Indonesia" },
      { property: "og:description", content: "Susun dokumen hukum Indonesia dengan bantuan AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Navigate to="/dashboard/drafting" replace />,
});
