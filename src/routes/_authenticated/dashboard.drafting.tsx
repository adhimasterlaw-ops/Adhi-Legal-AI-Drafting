import { createFileRoute } from "@tanstack/react-router";
import { DraftingPage } from "@/components/drafting/DraftingPage";

export const Route = createFileRoute("/_authenticated/dashboard/drafting")({
  head: () => ({
    meta: [
      { title: "Drafting Dokumen Hukum — LegalAI Indonesia" },
      {
        name: "description",
        content:
          "Buat, edit, simpan, dan unduh dokumen hukum Indonesia dengan template dan bantuan AI.",
      },
      { property: "og:title", content: "Drafting Dokumen Hukum — LegalAI Indonesia" },
      {
        property: "og:description",
        content: "Buat dokumen hukum profesional dengan template dan bantuan AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DraftingPage,
});
