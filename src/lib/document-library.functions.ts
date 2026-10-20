/* eslint-disable no-control-regex */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  DocumentLibraryData,
  LibraryDocument,
  ResearchBookmark,
} from "@/components/documents/types";

const uuid = z.string().uuid();
const nullableUuid = uuid.nullable();
const documentIds = z.array(uuid).min(1).max(100);

function cleanName(value: string) {
  return value.trim().replace(/[\u0000-\u001f]/g, " ");
}

async function syncSources(context: { userId: string; supabase: SupabaseClient<Database> }) {
  const [
    { data: drafts, error: draftError },
    { data: analyses, error: analysisError },
    { data: existing, error: existingError },
  ] = await Promise.all([
    context.supabase
      .from("legal_documents")
      .select("id,title,status,content,created_at,updated_at,document_templates(category)"),
    context.supabase
      .from("contract_analyses")
      .select("id,file_name,file_path,file_size,mime_type,summary,created_at"),
    context.supabase.from("documents").select("id,source_type,source_id,content,status"),
  ]);
  if (draftError || analysisError || existingError) throw new Error("Sumber dokumen gagal dimuat.");
  const sourceMap = new Map(
    (existing ?? []).map((row) => [`${row.source_type}:${row.source_id}`, row]),
  );
  for (const draft of drafts ?? []) {
    const previous = sourceMap.get(`drafting:${draft.id}`);
    const content = draft.content;
    if (previous) {
      if (previous.content !== content || previous.status !== draft.status) {
        const { error } = await context.supabase
          .from("documents")
          .update({
            content,
            status: draft.status === "final" ? "final" : "draft",
            file_size: new TextEncoder().encode(content).length,
          })
          .eq("id", previous.id);
        if (error) throw new Error("Pembaruan dokumen gagal.");
      }
    } else {
      const category = draft.document_templates?.category ?? "Lainnya";
      const type =
        ["Kontrak", "Somasi", "Gugatan", "Perjanjian"].find(
          (t) =>
            category.toLowerCase().includes(t.toLowerCase()) ||
            draft.title.toLowerCase().includes(t.toLowerCase()),
        ) ?? "Lainnya";
      const { error } = await context.supabase.from("documents").insert({
        user_id: context.userId,
        document_type: type,
        document_name: draft.title,
        description: "Dokumen dari Draft Dokumen",
        content,
        status: draft.status === "final" ? "final" : "draft",
        file_size: new TextEncoder().encode(content).length,
        mime_type: "text/plain",
        source_type: "drafting",
        source_id: draft.id,
        created_at: draft.created_at,
        updated_at: draft.updated_at,
      });
      if (error && error.code !== "23505") throw new Error("Dokumen gagal disinkronkan.");
    }
  }
  for (const item of analyses ?? []) {
    if (sourceMap.has(`contract_analysis:${item.id}`)) continue;
    const { error } = await context.supabase.from("documents").insert({
      user_id: context.userId,
      document_type: "Kontrak",
      document_name: item.file_name,
      description: item.summary,
      file_path: item.file_path,
      file_size: item.file_size,
      mime_type: item.mime_type,
      status: "final",
      source_type: "contract_analysis",
      source_id: item.id,
      created_at: item.created_at,
      updated_at: item.created_at,
    });
    if (error && error.code !== "23505") throw new Error("Kontrak gagal disinkronkan.");
  }
}

function validPrivatePath(path: string, userId: string) {
  return (
    path.startsWith(`${userId}/`) &&
    !path.includes("..") &&
    !path.includes("\\") &&
    !/[\u0000-\u001f]/.test(path)
  );
}

export const listDocumentLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await syncSources(context);
    const [
      { data: documents, error },
      { data: folders, error: folderError },
      { data: tags, error: tagError },
    ] = await Promise.all([
      context.supabase.from("documents").select("*").order("updated_at", { ascending: false }),
      context.supabase.from("folders").select("*").order("name"),
      context.supabase.from("document_tags").select("document_id,tag_name").order("tag_name"),
    ]);
    if (error || folderError || tagError) throw new Error("Dokumen Anda gagal dimuat.");
    const folderNames = new Map((folders ?? []).map((folder) => [folder.id, folder.name]));
    const tagsByDocument = new Map<string, string[]>();
    for (const tag of tags ?? [])
      tagsByDocument.set(tag.document_id, [
        ...(tagsByDocument.get(tag.document_id) ?? []),
        tag.tag_name,
      ]);
    return {
      documents: (documents ?? []).map((row): LibraryDocument => ({
        id: row.id,
        documentType: row.document_type,
        documentName: row.document_name,
        description: row.description,
        content: row.content,
        status: row.status as "draft" | "final",
        folderId: row.folder_id,
        folderName: row.folder_id ? (folderNames.get(row.folder_id) ?? null) : null,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        sourceType: row.source_type as LibraryDocument["sourceType"],
        sourceId: row.source_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        tags: tagsByDocument.get(row.id) ?? [],
      })),
      folders: (folders ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    } satisfies DocumentLibraryData;
  });

export const createFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ name: z.string().min(1).max(100), parentId: nullableUuid }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const name = cleanName(data.name);
    if (!name) throw new Error("Nama folder wajib diisi.");
    const { data: row, error } = await context.supabase
      .from("folders")
      .insert({ user_id: context.userId, name, parent_id: data.parentId })
      .select()
      .single();
    if (error || !row)
      throw new Error(
        error?.code === "23505" ? "Nama folder sudah digunakan." : "Folder gagal dibuat.",
      );
    return { id: row.id };
  });

export const renameFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid, name: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const name = cleanName(data.name);
    if (!name) throw new Error("Nama folder wajib diisi.");
    const { error } = await context.supabase.from("folders").update({ name }).eq("id", data.id);
    if (error) throw new Error("Folder gagal diganti nama.");
    return { ok: true };
  });

export const deleteFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { error: moveError } = await context.supabase
      .from("documents")
      .update({ folder_id: null })
      .eq("folder_id", data.id);
    if (moveError) throw new Error("Dokumen di dalam folder gagal dipindahkan ke root.");
    const { error } = await context.supabase.from("folders").delete().eq("id", data.id);
    if (error) throw new Error("Folder gagal dihapus.");
    return { ok: true };
  });

export const renameLibraryDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid, name: z.string().min(1).max(255) }).parse(input))
  .handler(async ({ data, context }) => {
    const name = cleanName(data.name);
    if (!name) throw new Error("Nama dokumen wajib diisi.");
    const { error } = await context.supabase
      .from("documents")
      .update({ document_name: name })
      .eq("id", data.id);
    if (error) throw new Error("Dokumen gagal diganti nama.");
    return { ok: true };
  });

export const moveLibraryDocuments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ ids: documentIds, folderId: nullableUuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("documents")
      .update({ folder_id: data.folderId })
      .in("id", data.ids);
    if (error) throw new Error("Dokumen gagal dipindahkan.");
    return { ok: true };
  });

export const tagLibraryDocuments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ ids: documentIds, tag: z.string().min(1).max(40) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const tag = cleanName(data.tag);
    if (!tag) throw new Error("Tag wajib diisi.");
    const { data: owned, error: readError } = await context.supabase
      .from("documents")
      .select("id")
      .in("id", data.ids);
    if (readError || owned?.length !== data.ids.length)
      throw new Error("Tidak memiliki izin untuk dokumen ini.");
    const { data: existing, error: tagError } = await context.supabase
      .from("document_tags")
      .select("document_id,tag_name")
      .in("document_id", data.ids);
    if (tagError) throw new Error("Tag gagal dimuat.");
    const rows = owned
      .filter(
        (item) =>
          !(existing ?? []).some(
            (t) => t.document_id === item.id && t.tag_name.toLowerCase() === tag.toLowerCase(),
          ),
      )
      .map((item) => ({ user_id: context.userId, document_id: item.id, tag_name: tag }));
    if (rows.length) {
      const { error } = await context.supabase.from("document_tags").insert(rows);
      if (error && error.code !== "23505") throw new Error("Tag gagal ditambahkan.");
    }
    return { ok: true };
  });

export const deleteLibraryDocuments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ ids: documentIds }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error: readError } = await context.supabase
      .from("documents")
      .select("id,source_type,source_id,file_path")
      .in("id", data.ids);
    if (readError || rows?.length !== data.ids.length)
      throw new Error("Dokumen tidak ditemukan atau tidak diizinkan.");
    for (const row of rows ?? []) {
      if (row.source_type === "drafting" && row.source_id) {
        const { error } = await context.supabase
          .from("legal_documents")
          .delete()
          .eq("id", row.source_id);
        if (error) throw new Error("Dokumen sumber gagal dihapus.");
      }
      if (row.source_type === "contract_analysis" && row.source_id) {
        if (row.file_path) {
          if (!validPrivatePath(row.file_path, context.userId))
            throw new Error("Path file tidak diizinkan.");
          const { error } = await context.supabase.storage
            .from("contracts")
            .remove([row.file_path]);
          if (error) throw new Error("File privat gagal dihapus.");
        }
        const { error } = await context.supabase
          .from("contract_analyses")
          .delete()
          .eq("id", row.source_id);
        if (error) throw new Error("Analisis sumber gagal dihapus.");
      }
    }
    const { error } = await context.supabase.from("documents").delete().in("id", data.ids);
    if (error) throw new Error("Dokumen gagal dihapus.");
    return { ok: true };
  });

export const getDocumentDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("documents")
      .select("file_path,source_type")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Dokumen tidak ditemukan.");
    if (
      !row.file_path ||
      row.source_type !== "contract_analysis" ||
      !validPrivatePath(row.file_path, context.userId)
    )
      return { url: null };
    const { data: signed, error: signedError } = await context.supabase.storage
      .from("contracts")
      .createSignedUrl(row.file_path, 60);
    if (signedError) throw new Error("Tautan unduhan gagal dibuat.");
    return { url: signed.signedUrl };
  });

export const listResearchBookmarks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: bookmarks, error } = await context.supabase
      .from("legal_research_bookmarks")
      .select("id,document_id,note,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Bookmark gagal dimuat.");
    const ids = (bookmarks ?? []).map((item) => item.document_id);
    const { data: documents } = ids.length
      ? await context.supabase
          .from("legal_research_documents")
          .select("id,title,summary,document_type,category,number,year,source_url,is_demo")
          .in("id", ids)
      : { data: [] };
    const byId = new Map((documents ?? []).map((item) => [item.id, item]));
    return (bookmarks ?? []).flatMap((item): ResearchBookmark[] => {
      const document = byId.get(item.document_id);
      if (!document) return [];
      return [
        {
          id: item.id,
          documentId: item.document_id,
          note: item.note,
          createdAt: item.created_at,
          title: document.title,
          summary: document.summary,
          documentType: document.document_type,
          category: document.category,
          number: document.number,
          year: document.year,
          sourceUrl: document.source_url,
          isDemo: document.is_demo,
        },
      ];
    });
  });

export const removeResearchBookmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("legal_research_bookmarks")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error("Bookmark gagal dihapus.");
    return { ok: true };
  });
export const getLibraryDocumentDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("documents")
      .select("id,source_type,source_id")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Dokumen tidak ditemukan atau Anda tidak memiliki izin.");
    if (row.source_type !== "drafting" || !row.source_id) return { versions: [] };
    const { data: versions, error: versionError } = await context.supabase
      .from("legal_document_versions")
      .select("id,version_number,content,created_at")
      .eq("document_id", row.source_id)
      .order("version_number", { ascending: false });
    if (versionError) throw new Error("Riwayat gagal dimuat.");
    return { versions: versions ?? [] };
  });

export const editLibraryDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuid, content: z.string().max(500000) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("documents")
      .select("source_type,source_id")
      .eq("id", data.id)
      .single();
    if (error || !row || row.source_type !== "drafting" || !row.source_id)
      throw new Error("Dokumen ini tidak dapat diedit.");
    const { error: saveError } = await context.supabase
      .from("legal_documents")
      .update({
        content: data.content,
        word_count: data.content.trim().split(/\s+/).filter(Boolean).length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.source_id);
    if (saveError) throw new Error("Perubahan gagal disimpan.");
    const { data: last } = await context.supabase
      .from("legal_document_versions")
      .select("version_number")
      .eq("document_id", row.source_id)
      .order("version_number", { ascending: false })
      .limit(1);
    const { error: versionError } = await context.supabase.from("legal_document_versions").insert({
      document_id: row.source_id,
      user_id: context.userId,
      version_number: (last?.[0]?.version_number ?? 0) + 1,
      content: data.content,
    });
    if (versionError) throw new Error("Isi tersimpan, tetapi riwayat gagal disimpan.");
    const { error: updateError } = await context.supabase
      .from("documents")
      .update({ content: data.content, file_size: new TextEncoder().encode(data.content).length })
      .eq("id", data.id);
    if (updateError) throw new Error("Katalog gagal diperbarui.");
    return { ok: true };
  });
