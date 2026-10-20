import { queryOptions } from "@tanstack/react-query";
import {
  listDocumentLibrary,
  listResearchBookmarks,
  getLibraryDocumentDetail,
} from "@/lib/document-library.functions";
export const libraryQuery = queryOptions({
  queryKey: ["document-library"],
  queryFn: () => listDocumentLibrary(),
  staleTime: 30000,
});
export const bookmarksQuery = queryOptions({
  queryKey: ["research-bookmarks"],
  queryFn: () => listResearchBookmarks(),
  staleTime: 30000,
});
export const detailQuery = (id: string) =>
  queryOptions({
    queryKey: ["document-detail", id],
    queryFn: () => getLibraryDocumentDetail({ data: { id } }),
  });
export type LibrarySearch = {
  q: string;
  type: string;
  status: string;
  folder: string;
  sort: string;
  view: "grid" | "list";
  page: number;
};
export function validateLibrarySearch(search: Record<string, unknown>): LibrarySearch {
  return {
    q: typeof search["q"] === "string" ? search["q"] : "",
    type: typeof search["type"] === "string" ? search["type"] : "Semua",
    status: ["draft", "final"].includes(String(search["status"]))
      ? String(search["status"])
      : "all",
    folder: typeof search["folder"] === "string" ? search["folder"] : "all",
    sort: ["oldest", "az", "za", "size"].includes(String(search["sort"]))
      ? String(search["sort"])
      : "newest",
    view: search["view"] === "list" ? "list" : "grid",
    page: Math.max(1, Math.floor(Number(search["page"]) || 1)),
  };
}
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — LegalAI Indonesia` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — LegalAI Indonesia` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
