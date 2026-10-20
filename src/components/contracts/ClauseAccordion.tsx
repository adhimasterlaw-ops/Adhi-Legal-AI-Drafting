import { useState } from "react";
import { Check, Copy, Lightbulb, Scale } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RiskScoreBadge } from "./RiskScoreBadge";
import type { ContractClause } from "@/lib/contract-analysis.functions";

export function ClauseAccordion({ clauses }: { clauses: ContractClause[] }) {
  const [reference, setReference] = useState<string | null>(null);
  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} disalin`);
  }
  return (
    <>
      <Accordion type="multiple" className="rounded-lg border bg-card px-4">
        {clauses.map((clause, index) => (
          <AccordionItem key={`${clause.number}-${index}`} value={`${index}`}>
            <AccordionTrigger className="gap-4 hover:no-underline">
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-xs font-semibold text-muted-foreground">
                  {clause.number}
                </span>
                <span className="mt-1 block font-display text-base font-bold">{clause.title}</span>
              </span>
              <RiskScoreBadge risk={clause.risk} />
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <section>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold">Teks Klausul</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void copy(clause.text, "Teks klausul")}
                  >
                    <Copy />
                    Salin
                  </Button>
                </div>
                <blockquote className="rounded-md border-l-4 border-secondary bg-gold-soft p-4 font-mono text-sm leading-relaxed">
                  {clause.text}
                </blockquote>
              </section>
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="text-sm font-bold">Analisis Risiko</h4>
                  <RiskScoreBadge risk={clause.risk} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{clause.analysis}</p>
              </section>
              <section className="rounded-md border border-emerald-600/30 bg-emerald-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <Lightbulb size={17} />
                    Saran Revisi
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void copy(clause.suggestion, "Saran revisi")}
                  >
                    <Copy />
                    Salin Saran
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-emerald-950">{clause.suggestion}</p>
              </section>
              {clause.references.length > 0 && (
                <section>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold">
                    <Scale size={16} />
                    Dasar Hukum
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {clause.references.map((item) => (
                      <Button
                        key={item}
                        size="sm"
                        variant="outline"
                        onClick={() => setReference(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </section>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Dialog open={Boolean(reference)} onOpenChange={(open) => !open && setReference(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reference}</DialogTitle>
            <DialogDescription>Referensi hukum terkait klausul yang dianalisis.</DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Silakan verifikasi bunyi pasal terbaru melalui sumber resmi sebelum menjadikannya dasar
            tindakan hukum. Hasil AI merupakan bahan peninjauan awal, bukan pengganti pendapat hukum
            profesional.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
