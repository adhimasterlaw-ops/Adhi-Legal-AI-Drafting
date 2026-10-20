import { createFileRoute } from "@tanstack/react-router";
import { BookmarksPage } from "@/components/documents/BookmarksPage";
import { bookmarksQuery, pageHead } from "@/components/documents/queries";
import { LibraryLoading } from "@/components/documents/LibraryControls";
import { LibraryError, LibraryNotFound } from "@/components/documents/LibraryError";
export const Route = createFileRoute("/_authenticated/dashboard/bookmarks")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
    type: typeof s["type"] === "string" ? s["type"] : "all",
    sort: s["sort"] === "oldest" ? "oldest" : "newest",
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(bookmarksQuery),
  head: () => pageHead("Bookmarks", "Koleksi referensi hukum dan sumber resmi yang Anda simpan."),
  component: Page,
  pendingComponent: LibraryLoading,
  errorComponent: LibraryError,
  notFoundComponent: LibraryNotFound,
});
function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <BookmarksPage
      search={search}
      onChange={(patch) =>
        void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
      }
    />
  );
}
