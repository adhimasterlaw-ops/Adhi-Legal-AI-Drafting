import type { RiskLevel } from "@/lib/contract-analysis.functions";
import { cn } from "@/lib/utils";

export function RiskGauge({ value, risk }: { value: number; risk: RiskLevel }) {
  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "grid size-28 shrink-0 place-items-center rounded-full border-[10px] bg-card font-display text-2xl font-extrabold",
          risk === "high" && "border-destructive text-destructive",
          risk === "medium" && "border-secondary text-secondary-foreground",
          risk === "low" && "border-emerald-600 text-emerald-700",
        )}
      >
        <span>{value}%</span>
      </div>
      <div>
        <p className="font-display text-lg font-bold">Skor Risiko Keseluruhan</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Semakin tinggi skor, semakin banyak klausul yang perlu ditinjau.
        </p>
      </div>
    </div>
  );
}
