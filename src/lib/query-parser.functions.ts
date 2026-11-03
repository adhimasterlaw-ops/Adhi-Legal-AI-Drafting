import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createGatewayFetch } from "@/lib/lovable-run-id.server";

const queryInputSchema = z.object({
  query: z.string().min(1),
});

export const parseLegalQuery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => queryInputSchema.parse(data))
  .handler(async ({ data }) => {
    const rawQuery = data.query;
    const key = process.env["LOVABLE_API_KEY"];

    const prompt = `Anda adalah QUERY PARSER untuk platform "LegalAI Indonesia".
Analisis pertanyaan user di "Chat Hukum" berikut dan ubah menjadi struktur pencarian yang akurat. JANGAN menjawab pertanyaan. HANYA output JSON valid tanpa teks tambahan.

ATURAN:
1. Identifikasi INTENT user:
   - "explain_regulation" → jelaskan suatu peraturan
   - "find_article" → cari pasal spesifik
   - "compare_regulations" → bandingkan peraturan
   - "legal_question" → pertanyaan hukum umum
   - "find_precedent" → cari putusan/yurisprudensi
   - "draft_document" → minta draft dokumen

2. Ekstrak ENTITAS:
   - regulation_number: nomor & tahun
   - regulation_type: UU/PP/Perpres/Permen/Putusan MA/Putusan MK
   - article: nomor pasal jika disebut
   - topic: topik hukum (ketenagakerjaan, kesehatan, pidana, perdata, dll)
   - entities: pihak/konsep yang disebut

3. NORMALISASI:
   - Koreksi typo & singkatan ("UU" → "Undang-Undang")
   - Hapus kata percakapan ("coba", "tolong", "dong")

4. OUTPUT FORMAT (JSON saja, tanpa penjelasan):
{
  "intent": "explain_regulation",
  "confidence": 0.95,
  "entities": {
    "regulation_type": "UU",
    "regulation_number": "17",
    "regulation_year": 2023,
    "regulation_title": "Kesehatan",
    "article": null,
    "topic": "kesehatan"
  },
  "query_original": "${rawQuery}",
  "query_primary": "...",
  "query_expanded": ["...", "..."],
  "filters": {
    "type": "UU",
    "year": 2023,
    "number": "17"
  },
  "search_strategy": "exact_match_first_then_semantic"
}

PERTANYAAN USER: "${rawQuery}"`;

    if (key) {
      try {
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: createGatewayFetch(),
        });
        const res = await generateText({
          model: provider.responses("openai/gpt-6-astra"),
          prompt,
        });
        const text = res.text.trim();
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start >= 0 && end > start) {
          const parsed = JSON.parse(text.slice(start, end + 1));
          return parsed;
        }
      } catch (e) {
        console.warn("AI Query Parser fallback to local parser:", e);
      }
    }

    const lower = rawQuery.toLowerCase();
    let intent = "legal_question";
    if (lower.includes("jelaskan") || lower.includes("tentang uu")) intent = "explain_regulation";
    else if (lower.includes("pasal") || lower.includes("mengatur")) intent = "find_article";
    else if (lower.includes("bandingkan") || lower.includes("perbedaan")) intent = "compare_regulations";
    else if (lower.includes("putusan") || lower.includes("yurisprudensi")) intent = "find_precedent";
    else if (lower.includes("buatkan") || lower.includes("draft")) intent = "draft_document";

    return {
      intent,
      confidence: 0.85,
      entities: {
        regulation_type: lower.includes("uu") ? "UU" : null,
        regulation_number: null,
        regulation_year: null,
        regulation_title: null,
        article: null,
        topic: lower.includes("phk") || lower.includes("kerja") ? "ketenagakerjaan" : "hukum umum",
      },
      query_original: rawQuery,
      query_primary: rawQuery.replace(/coba|tolong|dong/gi, "").trim(),
      query_expanded: [rawQuery, `analisis ${rawQuery}`],
      filters: {},
      search_strategy: "exact_match_first_then_semantic",
    };
  });
