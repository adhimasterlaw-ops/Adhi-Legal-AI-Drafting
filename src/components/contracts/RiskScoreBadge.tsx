import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/contract-analysis.functions";

const labels = { high: "TINGGI", medium: "MEDIUM", low: "RENDAH" } as const;

export function RiskScoreBadge({
  risk,
  size = "small",
}: {
  risk: RiskLevel;
  size?: "small" | "medium" | "large";
}) {
  return (
    <Badge
      className={cn(
        "border-transparent",
        risk === "high" && "bg-destructive text-destructive-foreground",
        risk === "medium" && "bg-secondary text-secondary-foreground",
        risk === "low" && "bg-emerald-600 text-primary-foreground",
        size === "medium" && "px-3 py-1 text-sm",
        size === "large" && "px-4 py-2 text-base",
      )}
    >
      {labels[risk]}
    </Badge>
  );
}
