import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  FolderPlus,
  FileText,
  FileCheck2,
  FileClock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getDocumentDownload } from "@/lib/document-library.functions";
import { libraryQuery, type LibrarySearch } from "./queries";
import { filterDocuments, downloadDocument } from "./library-utils";
import {
  DocumentFilters,
  DocumentList,
  FolderCard,
  FolderBreadcrumb,
  BulkActionsBar,
  EmptyDocumentsState,
  PrivacyNotice,
  type LibraryAction,
} from "./LibraryControls";
import { LibraryDialogs } from "./LibraryDialogs";
import type { LibraryDocument } from "./types";
export function DocumentLibraryPage({
  search,
  onChange,
  folderId = null,
}: {
  search: LibrarySearch;
  onChange: (patch: Partial<LibrarySearch>) => void;
  folderId?: string | null;
}) {
  const { data } = useSuspenseQuery(libraryQuery);
  const [selected, setSelected] = useState<string[]>([]);
  const [action, setAction] = useState<LibraryAction | null>(null);
  const [downloading, setDownloading] = useState(false);
  const getDownload = useServerFn(getDocumentDownload);
  const folder = data.folders.find((f) => f.id === folderId);
  if (folderId && !folder)
    return (
      <div role="alert" className="p-8">
        Folder tidak ditemukan atau Anda tidak memiliki izin.
      </div>
    );
  const filtered = filterDocuments(data.documents, {
    ...search,
    folder: folderId ?? search.folder,
  });
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const page = Math.min(pages, search.page);
  const visible = filtered.slice((page - 1) * 12, page * 12);
  const children = data.folders.filter((f) => f.parentId === folderId);
  const chosen = selected.filter((id) => data.documents.some((d) => d.id === id));
  async function download(docs: LibraryDocument[]) {
    setDownloading(true);
    try {
      for (const d of docs)
        await downloadDocument(d, async (id) => (await getDownload({ data: { id } })).url);
      toast.success("Unduhan siap.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unduhan gagal.");
    } finally {
      setDownloading(false);
    }
  }
  const change = (patch: Partial<LibrarySearch>) => {
    setSelected([]);
    onChange({ ...patch, page: patch.page ?? 1 });
  };
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <FolderBreadcrumb folders={data.folders} folderId={folderId} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="break-words font-display text-2xl font-extrabold sm:text-3xl">
            {folder?.name ?? "Dokumen Saya"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Koleksi dokumen hukum pribadi Anda.</p>
        </div>
        <Button onClick={() => setAction({ kind: "create", ids: [] })}>
          <FolderPlus />
          Buat folder
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3 border-y border-border py-5">
        {[
          { label: "Total dokumen", value: data.documents.length, Icon: FileText },
          {
            label: "Draft",
            value: data.documents.filter((d) => d.status === "draft").length,
            Icon: FileClock,
          },
          {
            label: "Final",
            value: data.documents.filter((d) => d.status === "final").length,
            Icon: FileCheck2,
          },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex min-w-0 items-center gap-3">
            <Icon className="hidden size-6 shrink-0 text-primary sm:block" />
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>
      {children.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold">Folder</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {children.map((f) => (
              <FolderCard
                key={f.id}
                folder={f}
                count={data.documents.filter((d) => d.folderId === f.id).length}
                onAction={setAction}
              />
            ))}
          </div>
        </div>
      )}
      <DocumentFilters search={search} folders={data.folders} onChange={change} />
      <div className="flex flex-wrap items-center gap-3">
        <Checkbox
          aria-label="Pilih semua pada halaman"
          checked={visible.length > 0 && visible.every((d) => chosen.includes(d.id))}
          onCheckedChange={(checked) =>
            setSelected(
              checked
                ? Array.from(new Set([...chosen, ...visible.map((d) => d.id)]))
                : chosen.filter((id) => !visible.some((d) => d.id === id)),
            )
          }
        />
        <span className="mr-auto text-sm text-muted-foreground">{filtered.length} dokumen</span>
        {(search.q ||
          search.type !== "Semua" ||
          search.status !== "all" ||
          search.folder !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => change({ q: "", type: "Semua", status: "all", folder: "all" })}
          >
            <RotateCcw />
            Reset
          </Button>
        )}
      </div>
      {chosen.length > 0 && (
        <BulkActionsBar
          count={chosen.length}
          onAction={(kind) => setAction({ kind, ids: chosen })}
          onClear={() => setSelected([])}
          onDownload={() => {
            if (!downloading) void download(data.documents.filter((d) => chosen.includes(d.id)));
          }}
        />
      )}
      {downloading && (
        <p role="status" className="text-sm text-muted-foreground">
          Menyiapkan unduhan...
        </p>
      )}
      {visible.length ? (
        <DocumentList
          documents={visible}
          selected={chosen}
          onSelect={(id) =>
            setSelected(chosen.includes(id) ? chosen.filter((i) => i !== id) : [...chosen, id])
          }
          onAction={setAction}
          onDownload={(d) => {
            if (!downloading) void download([d]);
          }}
          view={search.view}
        />
      ) : (
        <EmptyDocumentsState filtered={data.documents.length > 0} />
      )}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Halaman {page} dari {pages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Halaman sebelumnya"
            disabled={page <= 1}
            onClick={() => change({ page: page - 1 })}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Halaman berikutnya"
            disabled={page >= pages}
            onClick={() => change({ page: page + 1 })}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <PrivacyNotice />
      {action && (
        <LibraryDialogs
          key={`${action.kind}:${action.ids.join(",")}`}
          action={action}
          folders={data.folders}
          parentId={folderId}
          onClose={() => setAction(null)}
          onSuccess={() => setSelected([])}
        />
      )}
    </section>
  );
}
