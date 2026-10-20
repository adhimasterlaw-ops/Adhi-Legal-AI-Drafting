import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bookmark, Search, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { removeResearchBookmark } from "@/lib/document-library.functions";
import { bookmarksQuery } from "./queries";
import { Choice } from "./LibraryControls";
import { safeSourceUrl, formatDate } from "./library-utils";
import type { ResearchBookmark } from "./types";
export type BookmarkSearch = { q: string; type: string; sort: string };
export function BookmarksPage({
  search,
  onChange,
}: {
  search: BookmarkSearch;
  onChange: (patch: Partial<BookmarkSearch>) => void;
}) {
  const { data } = useSuspenseQuery(bookmarksQuery);
  const remove = useServerFn(removeResearchBookmark);
  const client = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);
  const visible = data
    .filter(
      (b) =>
        (search.type === "all" || b.documentType === search.type) &&
        `${b.title} ${b.summary} ${b.note ?? ""}`.toLowerCase().includes(search.q.toLowerCase()),
    )
    .sort((a, b) =>
      search.sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt),
    );
  async function deleteBookmark(id: string) {
    setPending(id);
    try {
      await remove({ data: { id } });
      await client.invalidateQueries({ queryKey: ["research-bookmarks"] });
      toast.success("Bookmark dihapus.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bookmark gagal dihapus.");
    } finally {
      setPending(null);
    }
  }
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Bookmarks</h1>
        <p className="mt-2 text-sm text-muted-foreground">Referensi hukum yang Anda simpan.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Cari bookmark"
            className="pl-9"
            placeholder="Cari referensi atau catatan..."
            value={search.q}
            onChange={(e) => onChange({ q: e.target.value })}
          />
        </div>
        <Choice
          label="Filter tipe bookmark"
          value={search.type}
          onChange={(type) => onChange({ type })}
          options={[
            { value: "all", label: "Semua tipe" },
            ...Array.from(new Set(data.map((b) => b.documentType))).map((type) => ({
              value: type,
              label: type,
            })),
          ]}
        />
        <Choice
          label="Urutkan bookmark"
          value={search.sort}
          onChange={(sort) => onChange({ sort })}
          options={[
            { value: "newest", label: "Disimpan terbaru" },
            { value: "oldest", label: "Disimpan terlama" },
          ]}
        />
      </div>
      <p className="text-sm text-muted-foreground">{visible.length} bookmark</p>
      {visible.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((b) => (
            <BookmarkCard
              key={b.id}
              bookmark={b}
              pending={pending === b.id}
              onRemove={() => void deleteBookmark(b.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Bookmark className="mx-auto size-12 text-muted-foreground/50" />
          <h2 className="mt-4 font-display text-lg font-bold">
            {data.length ? "Tidak ada bookmark yang cocok" : "Belum ada bookmark"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.length
              ? "Coba kata pencarian atau filter lain."
              : "Simpan referensi penting dari Riset Hukum."}
          </p>
          <Button asChild className="mt-5" variant="outline">
            <Link to="/dashboard/riset-hukum">Buka Riset Hukum</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
export function BookmarkCard({
  bookmark: b,
  pending,
  onRemove,
}: {
  bookmark: ResearchBookmark;
  pending: boolean;
  onRemove: () => void;
}) {
  const source = safeSourceUrl(b.sourceUrl);
  return (
    <article className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{b.documentType}</Badge>
        <Badge variant="outline">{b.category}</Badge>
        {b.isDemo && <Badge variant="outline">DATA DEMO</Badge>}
      </div>
      <h2 className="mt-4 break-words font-display font-bold">{b.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{b.summary}</p>
      {b.note && (
        <p className="mt-3 break-words border-l-2 border-secondary pl-3 text-sm">{b.note}</p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Disimpan {formatDate(b.createdAt)} · {b.year}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4 mt-5">
        {source ? (
          <Button asChild variant="outline" size="sm">
            <a href={source} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Buka sumber resmi
            </a>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/riset-hukum">Buka dokumen</Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          disabled={pending}
          aria-label={`Hapus bookmark ${b.title}`}
          title="Hapus bookmark"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  );
}
