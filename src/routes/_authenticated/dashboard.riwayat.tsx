import { createFileRoute } from "@tanstack/react-router";
import { FileClock } from "lucide-react";
import { DashboardSectionPage } from "@/components/dashboard/DashboardSectionPage";
export const Route = createFileRoute("/_authenticated/dashboard/riwayat")({
  head: () => ({
    meta: [
      { title: "Riwayat — LegalAI Indonesia" },
      { name: "description", content: "Riwayat aktivitas LegalAI Indonesia." },
      { property: "og:title", content: "Riwayat — LegalAI Indonesia" },
      { property: "og:description", content: "Riwayat aktivitas LegalAI Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <DashboardSectionPage
      title="Riwayat"
      description="Lihat kembali percakapan dan dokumen Anda."
      icon={FileClock}
    />
  ),
});
