import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";
import { DashboardSectionPage } from "@/components/dashboard/DashboardSectionPage";
export const Route = createFileRoute("/_authenticated/dashboard/chat")({
  head: () => ({
    meta: [
      { title: "Chat Hukum — LegalAI Indonesia" },
      {
        name: "description",
        content: "Konsultasi hukum berbantuan AI dengan referensi hukum Indonesia.",
      },
      { property: "og:title", content: "Chat Hukum — LegalAI Indonesia" },
      { property: "og:description", content: "Konsultasi hukum berbantuan AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <DashboardSectionPage
      title="Chat Hukum"
      description="Konsultasi hukum berbantuan AI dengan referensi pasal."
      icon={MessageSquareText}
    />
  ),
});
