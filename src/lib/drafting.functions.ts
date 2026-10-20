import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import { createGatewayFetch } from "@/lib/lovable-run-id.server";

const documentInput = z.object({
  documentId: z.string().uuid().nullable(),
  title: z.string().min(1).max(255),
  templateId: z.string().uuid().nullable(),
  variables: z.record(z.unknown()),
  content: z.string(),
  wizardStep: z.number().min(1).max(5),
  status: z.enum(["draft", "final"]),
});

function toDto(row: {
  id: string;
  title: string;
  status: string;
  content: string;
  variables: Json;
  wizard_step: number;
  word_count: number;
  created_at: string;
  updated_at: string;
}) {
  return {
    id: row.id,
    title: row.title,
    status: row.status as "draft" | "final",
    content: row.content,
    variables: row.variables,
    wizardStep: row.wizard_step,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const saveLegalDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => documentInput.parse(input))
  .handler(async ({ data, context }) => {
    const values = {
      user_id: context.userId,
      template_id: data.templateId,
      title: data.title,
      status: data.status,
      variables: data.variables as Json,
      content: data.content,
      wizard_step: data.wizardStep,
      word_count: data.content.trim() ? data.content.trim().split(/\s+/).length : 0,
      updated_at: new Date().toISOString(),
    };
    if (data.documentId) {
      const { data: row, error } = await context.supabase
        .from("legal_documents")
        .update(values)
        .eq("id", data.documentId)
        .select()
        .single();
      if (error || !row) throw new Error("Dokumen gagal disimpan.");
      return toDto(row);
    }
    const { data: row, error } = await context.supabase
      .from("legal_documents")
      .insert(values)
      .select()
      .single();
    if (error || !row) throw new Error("Draft gagal disimpan.");
    return toDto(row);
  });

export const generateLegalDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        documentId: z.string().uuid().nullable(),
        title: z.string().min(1).max(255),
        templateId: z.string().uuid().nullable(),
        variables: z.record(z.unknown()),
        baseContent: z.string().min(40),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const key = process.env["LOVABLE_API_KEY"];
    let content = data.baseContent.trim();
    if (key) {
      try {
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: createGatewayFetch(),
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "medium",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
          prompt: `Anda adalah penyusun dokumen hukum Indonesia. Poles draf berikut menjadi dokumen profesional, jelas, konsisten, dan siap diperiksa praktisi hukum. Pertahankan semua fakta yang diberikan, jangan mengarang identitas, angka, tanggal, atau dasar hukum. Jika data belum tersedia, pertahankan penanda dalam kurung siku. Keluarkan hanya isi dokumen tanpa markdown dan tanpa komentar.\n\nDRAF:\n${data.baseContent.slice(0, 60000)}`,
        });
        const polished = (await result.text).trim();
        if (polished) content = polished;
      } catch (err) {
        console.warn(
          "Layanan penyusunan AI tidak merespons, menggunakan draf berbasis template:",
          err,
        );
      }
    }
    if (!content) throw new Error("Dokumen kosong. Silakan lengkapi formulir.");
    const wordCount = content.split(/\s+/).length;
    const values = {
      user_id: context.userId,
      template_id: data.templateId,
      title: data.title,
      status: "final",
      variables: data.variables as Json,
      content,
      wizard_step: 5,
      word_count: wordCount,
      updated_at: new Date().toISOString(),
    };
    let saved;
    if (data.documentId) {
      const response = await context.supabase
        .from("legal_documents")
        .update(values)
        .eq("id", data.documentId)
        .select()
        .single();
      if (response.error) throw new Error("Dokumen selesai dibuat, tetapi gagal disimpan.");
      saved = response.data;
    } else {
      const response = await context.supabase
        .from("legal_documents")
        .insert(values)
        .select()
        .single();
      if (response.error) throw new Error("Dokumen selesai dibuat, tetapi gagal disimpan.");
      saved = response.data;
    }
    if (!saved) throw new Error("Dokumen gagal disimpan.");
    const { count } = await context.supabase
      .from("legal_document_versions")
      .select("id", { count: "exact", head: true })
      .eq("document_id", saved.id);
    await context.supabase.from("legal_document_versions").insert({
      document_id: saved.id,
      user_id: context.userId,
      version_number: (count ?? 0) + 1,
      content,
    });
    return toDto(saved);
  });

export const listLegalDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("legal_documents")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(30);
    if (error) throw new Error("Dokumen Anda gagal dimuat.");
    return data.map(toDto);
  });

export const duplicateLegalDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: source, error } = await context.supabase
      .from("legal_documents")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !source) throw new Error("Dokumen tidak ditemukan.");
    const { data: copy, error: copyError } = await context.supabase
      .from("legal_documents")
      .insert({
        user_id: context.userId,
        template_id: source.template_id,
        title: `${source.title} (Salinan)`,
        status: "draft",
        variables: source.variables,
        content: source.content,
        wizard_step: 5,
        word_count: source.word_count,
      })
      .select()
      .single();
    if (copyError || !copy) throw new Error("Dokumen gagal diduplikasi.");
    return toDto(copy);
  });

export const createLegalDocumentVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), content: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { count } = await context.supabase
      .from("legal_document_versions")
      .select("id", { count: "exact", head: true })
      .eq("document_id", data.id);
    const { error } = await context.supabase.from("legal_document_versions").insert({
      document_id: data.id,
      user_id: context.userId,
      version_number: (count ?? 0) + 1,
      content: data.content,
    });
    if (error) throw new Error("Versi dokumen gagal disimpan.");
    return { ok: true };
  });
