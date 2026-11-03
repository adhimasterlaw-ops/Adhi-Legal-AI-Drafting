export type ServiceHealth = {
  configured: boolean;
  name: string;
  description: string;
};

export function getSupabaseConfigStatus(): ServiceHealth {
  const url =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
    process.env["SUPABASE_URL"];
  const key =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]) ||
    process.env["SUPABASE_PUBLISHABLE_KEY"];

  const configured = Boolean(url && key);
  return {
    configured,
    name: "Supabase Database & Auth",
    description: configured
      ? "Terhubung ke instans Supabase."
      : "Belum dikonfigurasi. Atur SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY di environment.",
  };
}

export function getAiConfigStatus(): ServiceHealth {
  const key = process.env["LOVABLE_API_KEY"];
  const configured = Boolean(key);
  return {
    configured,
    name: "Layanan Pemrosesan AI",
    description: configured
      ? "Terhubung ke Lovable AI Gateway."
      : "Belum dikonfigurasi. Menggunakan mesin analisis hukum lokal.",
  };
}
