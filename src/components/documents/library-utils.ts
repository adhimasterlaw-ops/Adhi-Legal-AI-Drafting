import type { LibraryDocument, DocumentFolder } from "./types";
export const documentTypes = ["Semua", "Kontrak", "Somasi", "Gugatan", "Perjanjian", "Lainnya"];
export function formatSize(bytes: number | null) {
  if (bytes === null) return "—";
  return bytes < 1024
    ? `${bytes} B`
    : bytes < 1048576
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1048576).toFixed(1)} MB`;
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));
}
export function folderTrail(folders: DocumentFolder[], id: string | null): DocumentFolder[] {
  const trail: DocumentFolder[] = [];
  const visited = new Set<string>();
  while (id && !visited.has(id)) {
    visited.add(id);
    const folder = folders.find((f) => f.id === id);
    if (!folder) break;
    trail.unshift(folder);
    id = folder.parentId;
  }
  return trail;
}
export function filterDocuments(
  documents: LibraryDocument[],
  filters: { q: string; type: string; status: string; folder: string; sort: string },
) {
  const q = filters.q.toLocaleLowerCase("id");
  return documents
    .filter(
      (d) =>
        (filters.type === "Semua" || d.documentType === filters.type) &&
        (filters.status === "all" || d.status === filters.status) &&
        (filters.folder === "all" ||
          (filters.folder === "root" ? !d.folderId : d.folderId === filters.folder)) &&
        `${d.documentName} ${d.description ?? ""} ${d.tags.join(" ")}`
          .toLocaleLowerCase("id")
          .includes(q),
    )
    .sort((a, b) =>
      filters.sort === "oldest"
        ? a.updatedAt.localeCompare(b.updatedAt)
        : filters.sort === "az"
          ? a.documentName.localeCompare(b.documentName)
          : filters.sort === "za"
            ? b.documentName.localeCompare(a.documentName)
            : filters.sort === "size"
              ? (b.fileSize ?? 0) - (a.fileSize ?? 0)
              : b.updatedAt.localeCompare(a.updatedAt),
    );
}
export async function downloadDocument(
  document: LibraryDocument,
  getUrl: (id: string) => Promise<string | null>,
) {
  const name = document.documentName.replace(/[\\/:*?"<>|]/g, "_");
  if (document.content !== null) {
    const { Document, Packer, Paragraph } = await import("docx");
    const blob = await Packer.toBlob(
      new Document({
        sections: [{ children: document.content.split("\n").map((text) => new Paragraph(text)) }],
      }),
    );
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${name}.docx`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }
  const url = await getUrl(document.id);
  if (!url) throw new Error("File unduhan tidak tersedia untuk dokumen ini.");
  const response = await fetch(url);
  if (!response.ok) throw new Error("File gagal diunduh.");
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = objectUrl;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
}
export function safeSourceUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
