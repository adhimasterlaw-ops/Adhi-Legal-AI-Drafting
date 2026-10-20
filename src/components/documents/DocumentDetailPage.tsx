import { useState } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, Pencil, FolderInput, Trash2, Save, FileText, History } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getDocumentDownload, editLibraryDocument } from "@/lib/document-library.functions";
import { libraryQuery, detailQuery } from "./queries";
import { formatDate, formatSize, downloadDocument } from "./library-utils";
import { FolderBreadcrumb, PrivacyNotice, type LibraryAction } from "./LibraryControls";
import { LibraryDialogs } from "./LibraryDialogs";
export function DocumentDetailPage({ id }: { id: string }) {
  const { data } = useSuspenseQuery(libraryQuery);
  const { data: detail } = useSuspenseQuery(detailQuery(id));
  const document = data.documents.find((d) => d.id === id);
  const [action, setAction] = useState<LibraryAction | null>(null);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const getUrl = useServerFn(getDocumentDownload);
  const edit = useServerFn(editLibraryDocument);
  const client = useQueryClient();
  const navigate = useNavigate();
  if (!document)
    return (
      <div role="alert" className="p-8">
        Dokumen tidak ditemukan atau Anda tidak memiliki izin.
      </div>
    );
  const d = document;
  const shown =
    version === null
      ? d.content
      : (detail.versions.find((v) => v.id === version)?.content ?? d.content);
  async function download() {
    setPending(true);
    try {
      await downloadDocument(d, async (id) => (await getUrl({ data: { id } })).url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unduhan gagal.");
    } finally {
      setPending(false);
    }
  }
  async function save() {
    setPending(true);
    try {
      await edit({ data: { id, content } });
      await client.invalidateQueries({ queryKey: ["document-library"] });
      await client.invalidateQueries({ queryKey: ["document-detail", id] });
      setEditing(false);
      setVersion(null);
      toast.success("Dokumen tersimpan.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <FolderBreadcrumb folders={data.folders} folderId={d.folderId} />
      <div className="flex flex-wrap justify-between gap-4">
        <div className="min-w-0">
          <h1 className="break-words font-display text-2xl font-extrabold">{d.documentName}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">{d.documentType}</Badge>
            <Badge variant="secondary">{d.status === "final" ? "Final" : "Draft"}</Badge>
            {d.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending} onClick={() => void download()}>
            <Download />
            Unduh
          </Button>
          {d.sourceType === "drafting" && (
            <Button
              variant="outline"
              onClick={() => {
                setContent(d.content ?? "");
                setEditing(true);
                setVersion(null);
              }}
              disabled={editing}
            >
              <Pencil />
              Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            title="Ganti nama"
            aria-label="Ganti nama dokumen"
            onClick={() => setAction({ kind: "rename", ids: [id], name: d.documentName })}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Pindah folder"
            aria-label="Pindah dokumen"
            onClick={() => setAction({ kind: "move", ids: [id] })}
          >
            <FolderInput />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
            title="Hapus permanen"
            aria-label="Hapus dokumen permanen"
            onClick={() => setAction({ kind: "delete", ids: [id] })}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-4 border-y border-border py-5 text-sm sm:grid-cols-4">
        {[
          ["Dibuat", formatDate(d.createdAt)],
          ["Diperbarui", formatDate(d.updatedAt)],
          ["Ukuran", formatSize(d.fileSize)],
          ["Format", d.mimeType ?? "Teks"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <FileText size={18} />
            {editing
              ? "Edit dokumen"
              : version
                ? "Pratinjau versi sebelumnya"
                : "Pratinjau dokumen"}
          </h2>
          {editing ? (
            <div className="space-y-3">
              <Textarea
                aria-label="Isi dokumen"
                className="min-h-96 leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button disabled={pending} onClick={() => void save()}>
                  <Save />
                  {pending ? "Menyimpan..." : "Simpan perubahan"}
                </Button>
                <Button variant="outline" disabled={pending} onClick={() => setEditing(false)}>
                  Batal
                </Button>
              </div>
            </div>
          ) : shown !== null ? (
            <DocumentPreview content={shown} />
          ) : (
            <div className="border-y border-border py-12 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Pratinjau file ini belum tersedia. Unduh untuk membukanya di perangkat Anda.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                disabled={pending}
                onClick={() => void download()}
              >
                <Download />
                Unduh file
              </Button>
            </div>
          )}
        </div>
        <aside>
          <h2 className="flex items-center gap-2 font-semibold">
            <History size={18} />
            Riwayat perubahan
          </h2>
          <Button
            variant="ghost"
            className="mt-3 w-full justify-start"
            onClick={() => {
              setVersion(null);
              setEditing(false);
            }}
          >
            Versi saat ini
          </Button>
          {detail.versions.length ? (
            detail.versions.map((v) => (
              <Button
                key={v.id}
                variant={version === v.id ? "secondary" : "ghost"}
                className="mt-2 h-auto w-full flex-col items-start whitespace-normal text-left"
                onClick={() => {
                  setVersion(v.id);
                  setEditing(false);
                }}
              >
                <span>Versi {v.version_number}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {formatDate(v.created_at)}
                </span>
              </Button>
            ))
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Belum ada versi tersimpan.
            </p>
          )}
        </aside>
      </div>
      <PrivacyNotice />
      {action && (
        <LibraryDialogs
          key={action.kind}
          action={action}
          folders={data.folders}
          parentId={d.folderId}
          onClose={() => setAction(null)}
          onSuccess={() => {
            if (action.kind === "delete")
              void navigate({
                to: "/dashboard/documents",
                search: {
                  q: "",
                  type: "Semua",
                  status: "all",
                  folder: "all",
                  sort: "newest",
                  view: "grid",
                  page: 1,
                },
              });
          }}
        />
      )}
    </section>
  );
}
export function DocumentPreview({ content }: { content: string }) {
  return (
    <div className="min-h-80 whitespace-pre-wrap break-words border border-border bg-background p-5 text-sm leading-7 sm:p-8">
      {content || "Dokumen ini belum memiliki isi."}
    </div>
  );
}
