export type DocumentFolder = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LibraryDocument = {
  id: string;
  documentType: string;
  documentName: string;
  description: string | null;
  content: string | null;
  status: "draft" | "final";
  folderId: string | null;
  folderName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  sourceType: "drafting" | "contract_analysis" | "upload" | null;
  sourceId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

export type DocumentLibraryData = {
  documents: LibraryDocument[];
  folders: DocumentFolder[];
};

export type ResearchBookmark = {
  id: string;
  documentId: string;
  note: string | null;
  createdAt: string;
  title: string;
  summary: string;
  documentType: string;
  category: string;
  number: string;
  year: number;
  sourceUrl: string | null;
  isDemo: boolean;
};
