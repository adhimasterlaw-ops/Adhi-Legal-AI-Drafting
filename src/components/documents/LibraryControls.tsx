import { Link } from "@tanstack/react-router";
import {
  FileText,
  FileSignature,
  Scale,
  Download,
  Pencil,
  FolderInput,
  Trash2,
  Folder,
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  ShieldCheck,
  X,
  Tag,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentFolder, LibraryDocument } from "./types";
import type { LibrarySearch } from "./queries";
import { documentTypes, folderTrail, formatDate, formatSize } from "./library-utils";
export type LibraryAction = {
  kind: "create" | "rename" | "move" | "delete" | "tag" | "renameFolder" | "deleteFolder";
  ids: string[];
  name?: string;
};
export function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="w-full min-w-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function DocumentFilters({
  search,
  folders,
  onChange,
}: {
  search: LibrarySearch;
  folders: DocumentFolder[];
  onChange: (value: Partial<LibrarySearch>) => void;
}) {
  return (
    <div className="space-y-4">
      <Tabs value={search.type} onValueChange={(type) => onChange({ type })}>
        <TabsList className="h-auto w-full justify-start overflow-x-auto bg-transparent p-0 border-b rounded-none">
          {documentTypes.map((type) => (
            <TabsTrigger
              className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              key={type}
              value={type}
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_150px_180px_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            aria-label="Cari dokumen"
            placeholder="Cari nama atau tag dokumen..."
            value={search.q}
            onChange={(e) => onChange({ q: e.target.value })}
          />
        </div>
        <Choice
          label="Filter status"
          value={search.status}
          onChange={(status) => onChange({ status })}
          options={[
            { value: "all", label: "Semua status" },
            { value: "draft", label: "Draft" },
            { value: "final", label: "Final" },
          ]}
        />
        <Choice
          label="Filter folder"
          value={search.folder}
          onChange={(folder) => onChange({ folder })}
          options={[
            { value: "all", label: "Semua folder" },
            { value: "root", label: "Tanpa folder" },
            ...folders.map((f) => ({
              value: f.id,
              label: folderTrail(folders, f.id)
                .map((p) => p.name)
                .join(" / "),
            })),
          ]}
        />
        <Choice
          label="Urutkan dokumen"
          value={search.sort}
          onChange={(sort) => onChange({ sort })}
          options={[
            { value: "newest", label: "Terbaru" },
            { value: "oldest", label: "Terlama" },
            { value: "az", label: "Nama A–Z" },
            { value: "za", label: "Nama Z–A" },
            { value: "size", label: "Ukuran terbesar" },
          ]}
        />
        <div className="flex gap-1">
          <Button
            variant={search.view === "grid" ? "secondary" : "outline"}
            size="icon"
            aria-label="Tampilan grid"
            title="Tampilan grid"
            onClick={() => onChange({ view: "grid" })}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant={search.view === "list" ? "secondary" : "outline"}
            size="icon"
            aria-label="Tampilan list"
            title="Tampilan list"
            onClick={() => onChange({ view: "list" })}
          >
            <List />
          </Button>
        </div>
      </div>
    </div>
  );
}
export function DocumentCard({
  document: d,
  selected,
  onSelect,
  onAction,
  onDownload,
  list = false,
}: {
  document: LibraryDocument;
  selected: boolean;
  onSelect: () => void;
  onAction: (a: LibraryAction) => void;
  onDownload: () => void;
  list?: boolean;
}) {
  const Icon =
    d.documentType === "Gugatan"
      ? Scale
      : d.documentType === "Perjanjian" || d.documentType === "Kontrak"
        ? FileSignature
        : FileText;
  return (
    <article
      className={`min-w-0 rounded-lg border bg-card p-4 transition-colors ${selected ? "border-primary" : "border-border"} ${list ? "sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon size={23} />
        </span>
        <Checkbox
          aria-label={`Pilih ${d.documentName}`}
          checked={selected}
          onCheckedChange={onSelect}
        />
      </div>
      <div className="min-w-0">
        <Link
          to="/dashboard/documents/$documentId"
          params={{ documentId: d.id }}
          className="mt-4 block break-words font-display font-bold hover:text-primary sm:line-clamp-2"
        >
          {d.documentName}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">{d.documentType}</span>
          <Badge variant={d.status === "final" ? "secondary" : "outline"}>
            {d.status === "final" ? "Final" : "Draft"}
          </Badge>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {formatDate(d.updatedAt)} · {formatSize(d.fileSize)}
        </p>
        {d.folderName && (
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Folder size={13} />
            <span className="truncate">{d.folderName}</span>
          </p>
        )}
        {d.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {d.tags.map((tag) => (
              <Badge className="max-w-full truncate" variant="outline" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/documents/$documentId" params={{ documentId: d.id }}>
            Buka
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title="Unduh"
          aria-label={`Unduh ${d.documentName}`}
          onClick={onDownload}
        >
          <Download />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title="Ganti nama"
          aria-label={`Ganti nama ${d.documentName}`}
          onClick={() => onAction({ kind: "rename", ids: [d.id], name: d.documentName })}
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title="Pindah folder"
          aria-label={`Pindahkan ${d.documentName}`}
          onClick={() => onAction({ kind: "move", ids: [d.id] })}
        >
          <FolderInput />
        </Button>
        <Button
          variant="ghost"
          className="text-destructive"
          size="icon-sm"
          title="Hapus"
          aria-label={`Hapus ${d.documentName}`}
          onClick={() => onAction({ kind: "delete", ids: [d.id] })}
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  );
}
export function DocumentList(props: {
  documents: LibraryDocument[];
  selected: string[];
  onSelect: (id: string) => void;
  onAction: (a: LibraryAction) => void;
  onDownload: (d: LibraryDocument) => void;
  view: string;
}) {
  return (
    <div
      className={props.view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}
    >
      {props.documents.map((d) => (
        <DocumentCard
          key={d.id}
          document={d}
          selected={props.selected.includes(d.id)}
          onSelect={() => props.onSelect(d.id)}
          onAction={props.onAction}
          onDownload={() => props.onDownload(d)}
          list={props.view === "list"}
        />
      ))}
    </div>
  );
}
export function FolderCard({
  folder,
  count,
  onAction,
}: {
  folder: DocumentFolder;
  count: number;
  onAction: (a: LibraryAction) => void;
}) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-card p-3">
      <Folder className="shrink-0 text-secondary" />
      <Link
        to="/dashboard/documents/folder/$folderId"
        params={{ folderId: folder.id }}
        search={{
          q: "",
          type: "Semua",
          status: "all",
          folder: "all",
          sort: "newest",
          view: "grid",
          page: 1,
        }}
        className="min-w-0 flex-1"
      >
        <span className="block truncate text-sm font-semibold">{folder.name}</span>
        <span className="text-xs text-muted-foreground">{count} dokumen</span>
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        title="Ganti nama folder"
        aria-label={`Ganti nama folder ${folder.name}`}
        onClick={() => onAction({ kind: "renameFolder", ids: [folder.id], name: folder.name })}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        title="Hapus folder"
        aria-label={`Hapus folder ${folder.name}`}
        onClick={() => onAction({ kind: "deleteFolder", ids: [folder.id], name: folder.name })}
      >
        <Trash2 />
      </Button>
    </article>
  );
}
export function FolderBreadcrumb({
  folders,
  folderId,
}: {
  folders: DocumentFolder[];
  folderId: string | null;
}) {
  return (
    <nav
      aria-label="Lokasi folder"
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      <Link
        to="/dashboard/documents"
        search={{
          q: "",
          type: "Semua",
          status: "all",
          folder: "all",
          sort: "newest",
          view: "grid",
          page: 1,
        }}
        className="hover:text-primary"
      >
        Dokumen Saya
      </Link>
      {folderTrail(folders, folderId).map((f) => (
        <span key={f.id} className="flex min-w-0 items-center gap-2">
          <ChevronRight size={14} />
          <Link
            className="break-all hover:text-primary"
            to="/dashboard/documents/folder/$folderId"
            params={{ folderId: f.id }}
            search={{
              q: "",
              type: "Semua",
              status: "all",
              folder: "all",
              sort: "newest",
              view: "grid",
              page: 1,
            }}
          >
            {f.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
export function BulkActionsBar({
  count,
  onAction,
  onDownload,
  onClear,
}: {
  count: number;
  onAction: (a: LibraryAction["kind"]) => void;
  onDownload: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-primary/20 bg-primary/5 px-3 py-3">
      <span className="mr-auto text-sm font-semibold">{count} dipilih</span>
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download />
        Unduh
      </Button>
      <Button variant="outline" size="sm" onClick={() => onAction("move")}>
        <FolderInput />
        Pindah
      </Button>
      <Button variant="outline" size="sm" onClick={() => onAction("tag")}>
        <Tag />
        Tag
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive"
        onClick={() => onAction("delete")}
      >
        <Trash2 />
        Hapus
      </Button>
      <Button variant="ghost" size="icon" aria-label="Bersihkan pilihan" onClick={onClear}>
        <X />
      </Button>
    </div>
  );
}
export function EmptyDocumentsState({ filtered = false }: { filtered?: boolean }) {
  return (
    <div className="py-16 text-center">
      <FileText className="mx-auto size-12 text-muted-foreground/50" />
      <h2 className="mt-4 font-display text-lg font-bold">
        {filtered ? "Tidak ada dokumen yang cocok" : "Belum ada dokumen"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {filtered
          ? "Coba kata pencarian atau filter lain."
          : "Dokumen yang Anda buat atau analisis akan tampil di sini."}
      </p>
      {!filtered && (
        <Button asChild className="mt-5">
          <Link to="/dashboard/drafting">
            <FolderPlus />
            Buat dokumen
          </Link>
        </Button>
      )}
    </div>
  );
}
export function PrivacyNotice() {
  return (
    <p className="flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
      <ShieldCheck className="size-4 shrink-0" />
      Dokumen hukum bersifat rahasia dan hanya dapat diakses melalui akun Anda. Tautan file privat
      berlaku selama 60 detik.
    </p>
  );
}
export function LibraryLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 p-6">
      <Skeleton className="h-9 w-60" />
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}
