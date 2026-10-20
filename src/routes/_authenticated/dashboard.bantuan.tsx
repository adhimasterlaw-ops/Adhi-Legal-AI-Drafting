import { createFileRoute } from "@tanstack/react-router";
import { CircleHelp } from "lucide-react";
import { DashboardSectionPage } from "@/components/dashboard/DashboardSectionPage";
export const Route = createFileRoute("/_authenticated/dashboard/bantuan")({
  head: () => ({
    meta: [
      { title: "Bantuan — LegalAI Indonesia" },
      { name: "description", content: "Panduan penggunaan LegalAI Indonesia." },
      { property: "og:title", content: "Bantuan — LegalAI Indonesia" },
      { property: "og:description", content: "Panduan penggunaan LegalAI Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <DashboardSectionPage
      title="Bantuan"
      description="Panduan dan jawaban untuk pertanyaan umum."
      icon={CircleHelp}
    />
  ),
});
