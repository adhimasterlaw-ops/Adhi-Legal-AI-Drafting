import { useMemo, useState } from "react";
import { Bookmark, Download, FileText, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClauseAccordion } from "./ClauseAccordion";
import { RiskGauge } from "./RiskGauge";
import { RiskScoreBadge } from "./RiskScoreBadge";
import type { ContractAnalysis, RiskLevel } from "@/lib/contract-analysis.functions";

const filters: { value: "all" | RiskLevel; label: string }[] = [
  { value: "all", label: "Semua Klausul" },
  { value: "high", label: "Risiko Tinggi" },
  { value: "medium", label: "Risiko Medium" },
  { value: "low", label: "Risiko Rendah" },
];
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(
    new Date(value),
  );
const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export function AnalysisReport({
  analysis,
  onReset,
}: {
  analysis: ContractAnalysis;
  onReset: () => void;
}) {
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");
  const counts = useMemo(
    () => ({
      high: analysis.clauses.filter((c) => c.risk === "high").length,
      medium: analysis.clauses.filter((c) => c.risk === "medium").length,
      low: analysis.clauses.filter((c) => c.risk === "low").length,
    }),
    [analysis],
  );
  const visible =
    filter === "all"
      ? analysis.clauses
      : analysis.clauses.filter((clause) => clause.risk === filter);

  async function downloadReport() {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    let y = 18;
    const addText = (text: string, size = 10, bold = false) => {
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, 178);
      if (y + lines.length * 5 > 278) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(lines, 16, y);
      y += lines.length * 5 + 3;
    };
    addText("Laporan Analisis Kontrak", 18, true);
    addText(analysis.fileName, 12, true);
    addText(`Tanggal: ${formatDate(analysis.createdAt)}`);
    addText(
      `Skor Risiko: ${analysis.riskPercentage}% (${analysis.overallRisk.toUpperCase()})`,
      11,
      true,
    );
    addText("Ringkasan Eksekutif", 13, true);
    addText(analysis.summary);
    analysis.clauses.forEach((clause) => {
      addText(`${clause.number}: ${clause.title}`, 12, true);
      addText(`Risiko: ${clause.risk.toUpperCase()}`);
      addText(`Teks: ${clause.text}`);
      addText(`Analisis: ${clause.analysis}`);
      addText(`Saran: ${clause.suggestion}`);
      addText(`Dasar hukum: ${clause.references.join(", ") || "-"}`);
    });
    addText(
      "Catatan: Laporan AI ini merupakan peninjauan awal dan bukan pengganti nasihat hukum profesional.",
      8,
    );
    pdf.save(`laporan-${analysis.fileName.replace(/\.[^.]+$/, "")}.pdf`);
  }
  async function share() {
    const text = `Hasil analisis ${analysis.fileName}: risiko ${analysis.riskPercentage}% (${analysis.overallRisk}).`;
    if (navigator.share) await navigator.share({ title: "Analisis Kontrak LegalAI", text });
    else {
      await navigator.clipboard.writeText(text);
      toast.success("Ringkasan disalin untuk dibagikan");
    }
  }

  return (
    <section className="animate-fade-up space-y-6" aria-label="Hasil analisis">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <FileText />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-bold">{analysis.fileName}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatSize(analysis.fileSize)} · {formatDate(analysis.createdAt)}
            </p>
          </div>
        </div>
        <RiskScoreBadge risk={analysis.overallRisk} size="large" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <FileText className="text-primary" />
            Ringkasan Eksekutif
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">{analysis.summary}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <RiskGauge value={analysis.riskPercentage} risk={analysis.overallRisk} />
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            {[
              ["Tinggi", counts.high, "text-destructive"],
              ["Medium", counts.medium, "text-secondary-foreground"],
              ["Rendah", counts.low, "text-emerald-700"],
              ["Total", analysis.clauses.length, "text-foreground"],
            ].map(([label, value, color]) => (
              <div key={String(label)} className="rounded-md bg-muted p-3">
                <p className="text-muted-foreground">{label}</p>
                <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-display text-xl font-bold">Analisis Klausul</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tinjau risiko dan saran revisi untuk setiap klausul penting.
        </p>
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as "all" | RiskLevel)}
          className="mt-5"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1">
            {filters.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                {item.value !== "all" && (
                  <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">
                    {counts[item.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={filter} className="mt-4">
            <ClauseAccordion clauses={visible} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-wrap gap-2 border-t pt-6">
        <Button onClick={() => void downloadReport()}>
          <Download />
          Download Laporan PDF
        </Button>
        <Button variant="outline" onClick={onReset}>
          <Plus />
          Analisis Kontrak Lain
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.success("Laporan sudah tersimpan di akun Anda")}
        >
          <Bookmark />
          Simpan ke Dokumen Saya
        </Button>
        <Button variant="ghost" onClick={() => void share()}>
          <Share2 />
          Bagikan
        </Button>
      </div>
    </section>
  );
}
