import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Check, Clock, FileCheck, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import {
  analyzeContract,
  deleteContractAnalysis,
  listContractAnalyses,
  type ContractAnalysis,
} from "@/lib/contract-analysis.functions";
import { AnalysisHistoryTable } from "./AnalysisHistoryTable";
import { AnalysisReport } from "./AnalysisReport";
import { FileUpload } from "./FileUpload";

export function ContractAnalysisPage() {
  const { user } = useAuth();
  const runAnalysis = useServerFn(analyzeContract);
  const loadHistory = useServerFn(listContractAnalyses);
  const removeAnalysis = useServerFn(deleteContractAnalysis);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<ContractAnalysis | null>(null);
  const [history, setHistory] = useState<ContractAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContractAnalysis | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    void loadHistory()
      .then(setHistory)
      .catch(() => toast.error("Riwayat analisis gagal dimuat."))
      .finally(() => setLoadingHistory(false));
  }, [loadHistory]);
  useEffect(() => {
    if (!processing) return undefined;
    const timer = window.setInterval(
      () => setProgress((value) => Math.min(value + (value < 45 ? 7 : 2), 92)),
      900,
    );
    return () => window.clearInterval(timer);
  }, [processing]);
  const step = progress < 30 ? 1 : progress < 62 ? 2 : progress < 86 ? 3 : 4;
  const stats = useMemo(
    () => ({
      contracts: history.length,
      risky: history.reduce(
        (sum, item) => sum + item.clauses.filter((c) => c.risk !== "low").length,
        0,
      ),
    }),
    [history],
  );
  const pageCount = Math.max(1, Math.ceil(history.length / 10));
  const paginatedHistory = history.slice((historyPage - 1) * 10, historyPage * 10);

  function selectFile(next: File | null) {
    setFile(next);
    setUploadProgress(0);
  }
  async function start() {
    if (!file || !user) return;
    const validationError = (file as File & { validationError?: string }).validationError;
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setProcessing(true);
    setProgress(8);
    setUploadProgress(20);
    setActive(null);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
    try {
      const uploadOptions = file.type
        ? { contentType: file.type, upsert: false }
        : { upsert: false };
      const { error } = await supabase.storage.from("contracts").upload(path, file, uploadOptions);
      if (error) throw new Error("Upload gagal. Periksa koneksi internet dan coba lagi.");
      setUploadProgress(100);
      setProgress(28);
      const result = await runAnalysis({
        data: {
          filePath: path,
          fileName: file.name,
          fileSize: file.size,
          mimeType:
            file.type ||
            (file.name.endsWith(".pdf")
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        },
      });
      setProgress(100);
      setActive(result);
      setHistory((items) => [result, ...items]);
      toast.success("Analisis kontrak selesai");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analisis gagal. Coba lagi atau hubungi support.";
      toast.error(
        message.includes("timed out")
          ? "Analisis timeout untuk dokumen yang sangat besar. Coba bagi menjadi beberapa file."
          : message,
      );
    } finally {
      setProcessing(false);
    }
  }
  async function remove() {
    if (!deleteTarget) return;
    try {
      await removeAnalysis({ data: { id: deleteTarget.id } });
      setHistory((items) => items.filter((item) => item.id !== deleteTarget.id));
      if (active?.id === deleteTarget.id) setActive(null);
      setHistoryPage((page) => Math.min(page, Math.max(1, Math.ceil((history.length - 1) / 10))));
      toast.success("Laporan dihapus");
    } catch {
      toast.error("Laporan gagal dihapus.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <p className="text-sm font-semibold text-primary">Pemeriksaan dokumen berbasis AI</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">Analisis Kontrak Otomatis</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Upload kontrak Anda, AI akan deteksi klausul berisiko dan berikan saran revisi profesional
          dalam hitungan detik.
        </p>
      </header>
      <section className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Kontrak Dianalisis", value: String(stats.contracts), icon: FileCheck },
          { label: "Klausul Berisiko Terdeteksi", value: String(stats.risky), icon: AlertTriangle },
          { label: "Rata-rata Waktu Analisis", value: "± 1 menit", icon: Clock },
        ].map((stat) => (
          <div
            key={stat.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center rounded-lg border bg-card p-4"
          >
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-display text-2xl font-extrabold">{stat.value}</p>
            </div>
            <stat.icon className="text-primary/55" />
          </div>
        ))}
      </section>
      {!processing && !active && (
        <section className="mt-7">
          <FileUpload
            file={file}
            uploadProgress={uploadProgress}
            disabled={processing}
            onFile={selectFile}
            onAnalyze={() => void start()}
          />
        </section>
      )}
      {processing && (
        <section className="mt-7 rounded-lg border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <LoaderCircle className="mt-1 animate-spin text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">Menganalisis kontrak...</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ini bisa memakan waktu 1-2 menit tergantung ukuran dokumen.
              </p>
            </div>
          </div>
          <Progress value={progress} className="mt-6 h-2.5" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{progress}%</span>
            <span>Sekitar {Math.max(5, Math.ceil((100 - progress) * 0.6))} detik lagi...</span>
          </div>
          <div className="mt-7 space-y-3">
            {[
              "File diupload",
              "Ekstraksi teks dari dokumen...",
              "Analisis klausul per klausul...",
              "Menyusun laporan risiko...",
            ].map((label, index) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid size-6 place-items-center rounded-full ${index + 1 < step ? "bg-emerald-600 text-primary-foreground" : index + 1 === step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {index + 1 < step ? (
                    <Check size={14} />
                  ) : index + 1 === step ? (
                    <LoaderCircle className="animate-spin" size={14} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className={index + 1 <= step ? "font-semibold" : "text-muted-foreground"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-7" onClick={() => setCancelOpen(true)}>
            Batal
          </Button>
        </section>
      )}
      {active && (
        <div className="mt-7">
          <AnalysisReport
            analysis={active}
            onReset={() => {
              setActive(null);
              setFile(null);
              setUploadProgress(0);
              setProgress(0);
            }}
          />
        </div>
      )}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">Riwayat Analisis</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Semua laporan tersimpan aman di akun Anda.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary">{history.length} laporan</span>
        </div>
        {loadingHistory ? (
          <div className="grid h-40 place-items-center rounded-lg border bg-card">
            <LoaderCircle className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            <AnalysisHistoryTable
              items={paginatedHistory}
              onView={(item) => {
                setActive(item);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDownload={(item) => {
                setActive(item);
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.info("Pilih Download Laporan PDF pada laporan");
              }}
              onDelete={setDeleteTarget}
            />
            {pageCount > 1 && (
              <Pagination className="mt-5">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={historyPage === 1}
                      className={historyPage === 1 ? "pointer-events-none opacity-50" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setHistoryPage((page) => Math.max(1, page - 1));
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-sm text-muted-foreground">
                      Halaman {historyPage} dari {pageCount}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={historyPage === pageCount}
                      className={
                        historyPage === pageCount ? "pointer-events-none opacity-50" : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        setHistoryPage((page) => Math.min(pageCount, page + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan analisis?</AlertDialogTitle>
            <AlertDialogDescription>
              Proses AI yang sedang berjalan akan dihentikan dari tampilan ini. Analisis yang sudah
              dikirim mungkin tetap menyelesaikan proses di server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjutkan Analisis</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setProcessing(false);
                setProgress(0);
                setCancelOpen(false);
              }}
            >
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus laporan?</AlertDialogTitle>
            <AlertDialogDescription>
              Laporan dan file kontrak akan dihapus permanen dari akun Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => void remove()}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
