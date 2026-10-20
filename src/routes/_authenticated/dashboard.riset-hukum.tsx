import { createFileRoute } from "@tanstack/react-router";
import { BookOpenCheck } from "lucide-react";
import { DashboardSectionPage } from "@/components/dashboard/DashboardSectionPage";
export const Route = createFileRoute("/_authenticated/dashboard/riset-hukum")({
  head: () => ({
    meta: [
      { title: "Riset Hukum — LegalAI Indonesia" },
      { name: "description", content: "Riset peraturan dan yurisprudensi Indonesia." },
      { property: "og:title", content: "Riset Hukum — LegalAI Indonesia" },
      { property: "og:description", content: "Riset peraturan dan yurisprudensi Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <DashboardSectionPage
      title="Riset Hukum"
      description="Telusuri peraturan dan yurisprudensi Indonesia."
      icon={BookOpenCheck}
    />
  ),
});
