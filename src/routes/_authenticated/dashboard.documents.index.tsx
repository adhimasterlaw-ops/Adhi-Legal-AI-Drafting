import { createFileRoute } from "@tanstack/react-router";
import { DocumentLibraryPage } from "@/components/documents/DocumentLibraryPage";
import { libraryQuery, pageHead, validateLibrarySearch } from "@/components/documents/queries";
import { LibraryLoading } from "@/components/documents/LibraryControls";
import { LibraryError, LibraryNotFound } from "@/components/documents/LibraryError";
export const Route = createFileRoute("/_authenticated/dashboard/documents/")({
  validateSearch: validateLibrarySearch,
  loader: ({ context }) => context.queryClient.ensureQueryData(libraryQuery),
  head: () =>
    pageHead(
      "Dokumen Saya",
      "Kelola dokumen hukum pribadi, folder, tag, dan riwayat perubahan Anda.",
    ),
  component: Page,
  pendingComponent: LibraryLoading,
  errorComponent: LibraryError,
  notFoundComponent: LibraryNotFound,
});
function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <DocumentLibraryPage
      search={search}
      onChange={(patch) =>
        void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
      }
    />
  );
}
