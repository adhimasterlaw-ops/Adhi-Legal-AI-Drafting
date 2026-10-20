import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { DashboardSectionPage } from "@/components/dashboard/DashboardSectionPage";
export const Route = createFileRoute("/_authenticated/dashboard/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan — LegalAI Indonesia" },
      { name: "description", content: "Kelola profil dan preferensi akun LegalAI Indonesia." },
      { property: "og:title", content: "Pengaturan — LegalAI Indonesia" },
      {
        property: "og:description",
        content: "Kelola profil dan preferensi akun LegalAI Indonesia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <DashboardSectionPage
      title="Pengaturan"
      description="Kelola profil, keamanan, dan preferensi akun."
      icon={Settings}
    />
  ),
});
