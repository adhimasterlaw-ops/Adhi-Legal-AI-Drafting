import { createFileRoute } from "@tanstack/react-router";
import { DocumentDetailPage } from "@/components/documents/DocumentDetailPage";
import { libraryQuery, detailQuery, pageHead } from "@/components/documents/queries";
import { LibraryLoading } from "@/components/documents/LibraryControls";
import { LibraryError, LibraryNotFound } from "@/components/documents/LibraryError";
export const Route = createFileRoute("/_authenticated/dashboard/documents/$documentId")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(libraryQuery);
    await context.queryClient.ensureQueryData(detailQuery(params.documentId));
  },
  head: () =>
    pageHead("Detail Dokumen", "Pratinjau, edit, unduh, dan kelola riwayat dokumen hukum pribadi."),
  component: Page,
  pendingComponent: LibraryLoading,
  errorComponent: LibraryError,
  notFoundComponent: LibraryNotFound,
});
function Page() {
  const { documentId } = Route.useParams();
  return <DocumentDetailPage id={documentId} />;
}
