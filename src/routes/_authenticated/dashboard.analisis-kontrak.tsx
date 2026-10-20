import { createFileRoute } from "@tanstack/react-router";
import { ContractAnalysisPage } from "@/components/contracts/ContractAnalysisPage";

export const Route = createFileRoute("/_authenticated/dashboard/analisis-kontrak")({
  head: () => ({
    meta: [
      { title: "Analisis Kontrak Otomatis — LegalAI Indonesia" },
      {
        name: "description",
        content:
          "Deteksi risiko, klausul bermasalah, dan saran revisi kontrak dengan AI hukum Indonesia.",
      },
      { property: "og:title", content: "Analisis Kontrak Otomatis — LegalAI Indonesia" },
      {
        property: "og:description",
        content:
          "Deteksi risiko, klausul bermasalah, dan saran revisi kontrak dengan AI hukum Indonesia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContractAnalysisPage,
});
