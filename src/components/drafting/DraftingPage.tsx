import { useServerFn } from "@tanstack/react-start";
import {
  Clock3,
  Copy,
  FileCheck2,
  FileText,
  MoreHorizontal,
  PencilLine,
  RotateCcw,
  Star,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  duplicateLegalDocument,
  generateLegalDocument,
  listLegalDocuments,
  saveLegalDocument,
} from "@/lib/drafting.functions";
import { DocumentActions } from "./DocumentActions";
import { DocumentEditor } from "./DocumentEditor";
import { FormWizard } from "./FormWizard";
import { TemplateGrid } from "./TemplateGrid";
import {
  createEmptyDraft,
  type DocumentTemplate,
  type DraftFormData,
  type SavedLegalDocument,
} from "./types";

type View = "templates" | "wizard" | "result";

export function DraftingPage() {
  const saveFn = useServerFn(saveLegalDocument);
  const generateFn = useServerFn(generateLegalDocument);
  const listFn = useServerFn(listLegalDocuments);
  const duplicateFn = useServerFn(duplicateLegalDocument);
  const [view, setView] = useState<View>("templates");
  const [selected, setSelected] = useState<DocumentTemplate | null>(null);
  const [details, setDetails] = useState<DocumentTemplate | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DraftFormData>(createEmptyDraft());
  const [document, setDocument] = useState<SavedLegalDocument | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<SavedLegalDocument[]>([]);
  const loadHistory = async () => {
    try {
      const items = await listFn();
      setHistory(items as SavedLegalDocument[]);
    } catch {
      toast.error("Riwayat dokumen belum dapat dimuat.");
    }
  };
  useEffect(() => {
    void loadHistory();
  }, []);
  useEffect(() => {
    if (!documentId || view !== "result") return;
    const timer = window.setInterval(() => {
      void saveCurrent(false);
    }, 30000);
    return () => window.clearInterval(timer);
  }, [documentId, view, content]);
  const choose = (template: DocumentTemplate) => {
    setDetails(template);
  };
  const useTemplate = () => {
    if (!details) return;
    setSelected(details);
    setFormData({ ...createEmptyDraft(), documentType: details.name });
    setDetails(null);
    setDocumentId(null);
    setView("wizard");
  };
  const saveDraft = async (data: DraftFormData, step: number) => {
    if (!selected) return;
    setSaving(true);
    try {
      const saved = await saveFn({
        data: {
          documentId,
          title: selected.name,
          templateId: selected.id,
          variables: data,
          content,
          wizardStep: step,
          status: "draft",
        },
      });
      setDocumentId(saved.id);
      setFormData(data);
      toast.success("Draft tersimpan.");
      await loadHistory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Draft gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };
  const generate = async (data: DraftFormData, baseContent: string) => {
    if (!selected) return;
    setGenerating(true);
    try {
      const saved = await generateFn({
        data: {
          documentId,
          title: selected.name,
          templateId: selected.id,
          variables: data,
          baseContent,
        },
      });
      setDocument(saved as SavedLegalDocument);
      setDocumentId(saved.id);
      setFormData(data);
      setContent(saved.content);
      setView("result");
      toast.success("Dokumen berhasil dibuat.");
      await loadHistory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Dokumen gagal dibuat.");
    } finally {
      setGenerating(false);
    }
  };
  const saveCurrent = async (showToast = true) => {
    if (!document || !selected) return;
    try {
      const saved = await saveFn({
        data: {
          documentId: document.id,
          title: document.title,
          templateId: selected.id,
          variables: formData,
          content,
          wizardStep: 5,
          status: "final",
        },
      });
      setDocument(saved as SavedLegalDocument);
      if (showToast) toast.success("Perubahan tersimpan.");
    } catch {
      if (showToast) toast.error("Perubahan gagal disimpan.");
    }
  };
  const duplicate = async () => {
    if (!document) return;
    try {
      await duplicateFn({ data: { id: document.id } });
      toast.success("Salinan dokumen dibuat.");
      await loadHistory();
    } catch {
      toast.error("Dokumen gagal diduplikasi.");
    }
  };
  const openHistory = (item: SavedLegalDocument) => {
    setDocument(item);
    setDocumentId(item.id);
    setContent(item.content);
    setFormData(item.variables);
    setSelected({
      id: "a0000000-0000-4000-8000-000000000006",
      name: item.title,
      category: "Lainnya",
      description: "Dokumen tersimpan",
      templateContent: item.content,
      variablesSchema: [],
      isPremium: false,
      usageCount: 0,
      rating: 0,
    });
    setView(item.content ? "result" : "wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <WandSparkles size={17} />
            Workspace Dokumen
          </div>
          <h1 className="mt-2 text-3xl font-extrabold">Drafting Dokumen Hukum</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Pilih template, isi form wizard, dan AI akan generate dokumen hukum profesional dalam
            hitungan detik.
          </p>
        </div>
        {view !== "templates" && (
          <Button variant="outline" onClick={() => setView("templates")}>
            <RotateCcw />
            Pilih Template Lain
          </Button>
        )}
      </header>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <FileText className="text-primary" />
          <p className="mt-3 text-2xl font-bold">50+</p>
          <p className="text-xs text-muted-foreground">Template Tersedia</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <FileCheck2 className="text-primary" />
          <p className="mt-3 text-2xl font-bold">1.234</p>
          <p className="text-xs text-muted-foreground">Dokumen Dihasilkan</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <Star className="text-secondary" />
          <p className="mt-3 text-2xl font-bold">4.8/5</p>
          <p className="text-xs text-muted-foreground">Rating User</p>
        </div>
      </div>
      {view === "templates" && <TemplateGrid onSelect={choose} />}
      {view === "wizard" && selected && (
        <FormWizard
          template={selected}
          initialData={formData}
          onSave={saveDraft}
          onGenerate={generate}
          saving={saving}
          generating={generating}
        />
      )}
      {view === "result" && document && (
        <section className="mt-7 space-y-5">
          <div className="rounded-lg border bg-card p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold">
                    {document.title}_
                    {new Date(document.updatedAt).toISOString().slice(0, 10).replaceAll("-", "")}
                    .docx
                  </h2>
                  <Badge>{document.status === "final" ? "Final" : "Draft"}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(document.updatedAt))}{" "}
                  · {content.trim().split(/\s+/).filter(Boolean).length} kata · {content.length}{" "}
                  karakter
                </p>
              </div>
              <DocumentActions
                title={document.title}
                content={content}
                onSave={() => void saveCurrent()}
                onDuplicate={() => void duplicate()}
              />
            </div>
          </div>
          <DocumentEditor content={content} onChange={(_nextHtml, text) => setContent(text)} />
          <p className="text-center text-xs text-muted-foreground">
            Perubahan disimpan otomatis setiap 30 detik. Tetap tinjau dokumen sebelum digunakan.
          </p>
        </section>
      )}
      <Dialog open={Boolean(details)} onOpenChange={(open) => !open && setDetails(null)}>
        {details && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{details.name}</DialogTitle>
                <Badge variant="outline">{details.category}</Badge>
              </div>
              <DialogDescription>{details.description}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-64 rounded-md border bg-muted/30 p-4">
              <pre className="whitespace-pre-wrap font-serif text-sm leading-6">
                {details.templateContent}
              </pre>
            </ScrollArea>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <strong>Data diperlukan:</strong> {details.variablesSchema.length} kelompok
              </p>
              <p>
                <strong>Estimasi:</strong> 5 menit
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetails(null)}>
                Batal
              </Button>
              <Button onClick={useTemplate}>Gunakan Template</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      {history.length > 0 && view === "templates" && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Dokumen Saya</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lanjutkan draft atau buka dokumen final Anda.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dokumen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diperbarui</TableHead>
                  <TableHead className="w-14">
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto px-0 font-semibold"
                        onClick={() => openHistory(item)}
                      >
                        {item.title}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "final" ? "default" : "outline"}>
                        {item.status === "final" ? "Final" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={14} />
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                          new Date(item.updatedAt),
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" aria-label={`Aksi ${item.title}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => openHistory(item)}>
                            <PencilLine />
                            Buka
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={async () => {
                              await duplicateFn({ data: { id: item.id } });
                              toast.success("Salinan dibuat.");
                              await loadHistory();
                            }}
                          >
                            <Copy />
                            Duplikasi
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
}
