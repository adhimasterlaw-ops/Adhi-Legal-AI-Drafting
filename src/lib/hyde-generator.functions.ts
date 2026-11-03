import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createGatewayFetch } from "@/lib/lovable-run-id.server";

const hydeInputSchema = z.object({
  query: z.string().min(1),
});

export const generateHydeDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => hydeInputSchema.parse(data))
  .handler(async ({ data }) => {
    const rawQuery = data.query;
    const key = process.env["LOVABLE_API_KEY"];

    const prompt = `Anda adalah QUERY EXPANDER untuk search engine hukum Indonesia.
Berdasarkan pertanyaan user, tulis SATU paragraf "dokumen hipotetis" (HyDE) seolah-olah Anda adalah cuplikan dari peraturan/putusan yang PALING MUNGKIN menjawab pertanyaan tersebut.

ATURAN:
1. Gunakan istilah & gaya bahasa hukum Indonesia formal
2. Sertakan kemungkinan nomor pasal, struktur UU, dan terminologi yang relevan
3. Panjang: 100-200 kata
4. Jangan sertakan disclaimer atau meta-komentar. HANYA paragraf dokumen hipotetis tanpa judul.

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
        return res.text.trim();
      } catch (e) {
        console.warn("AI HyDE generation fallback:", e);
      }
    }

    return `Berdasarkan peraturan perundang-undangan yang berlaku di Indonesia terkait "${rawQuery}", ketentuan umum memuat definisi, hak dan kewajiban subjek hukum, serta prosedur pelaksanaan hak dan sanksi administratif maupun perdata atas pelanggaran yang terjadi. Pasal-pasal krusial yang mengatur hal ini merujuk pada asas kepastian hukum, perlindungan hak asasi manusia, serta kepatuhan terhadap prosedur yuridis formil dan materiil sesuai ketentuan hukum positif yang berlaku.`;
  });
