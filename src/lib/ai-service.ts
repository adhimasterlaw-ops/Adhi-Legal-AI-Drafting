import { createOpenAI } from "@ai-sdk/openai";
import { createGatewayFetch } from "@/lib/lovable-run-id.server";

export type AiServiceInfo = {
  isConfigured: boolean;
  status: "configured" | "not_configured";
  message: string;
};

export function getAiServiceInfo(): AiServiceInfo {
  const key = process.env["LOVABLE_API_KEY"];
  if (key) {
    return {
      isConfigured: true,
      status: "configured",
      message: "Layanan AI aktif melalui Lovable AI Gateway.",
    };
  }
  return {
    isConfigured: false,
    status: "not_configured",
    message:
      "Layanan AI belum dikonfigurasi (kunci LOVABLE_API_KEY belum disetel). Mode analisis aturan lokal aktif.",
  };
}

export function getAiClient(): ReturnType<typeof createOpenAI> | null {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return null;
  try {
    return createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: createGatewayFetch(),
    });
  } catch (error) {
    console.warn("[AIService] Gagal menginisialisasi AI provider:", error);
    return null;
  }
}
