import { Download, Eye, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskScoreBadge } from "./RiskScoreBadge";
import type { ContractAnalysis } from "@/lib/contract-analysis.functions";

export function AnalysisHistoryTable({
  items,
  onView,
  onDownload,
  onDelete,
}: {
  items: ContractAnalysis[];
  onView: (item: ContractAnalysis) => void;
  onDownload: (item: ContractAnalysis) => void;
  onDelete: (item: ContractAnalysis) => void;
}) {
  if (items.length === 0)
    return (
      <div className="grid min-h-40 place-items-center rounded-lg border border-dashed bg-card text-center">
        <div>
          <FileText className="mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm font-bold">Belum ada analisis kontrak</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Laporan pertama Anda akan tampil di sini.
          </p>
        </div>
      </div>
    );
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Risiko</TableHead>
            <TableHead>Klausul Berisiko</TableHead>
            <TableHead className="w-14">
              <span className="sr-only">Aksi</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <button
                  className="flex max-w-64 items-center gap-2 text-left font-semibold hover:text-primary"
                  onClick={() => onView(item)}
                >
                  <FileText className="shrink-0 text-primary" size={17} />
                  <span className="truncate">{item.fileName}</span>
                </button>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                  new Date(item.createdAt),
                )}
              </TableCell>
              <TableCell>
                <RiskScoreBadge risk={item.overallRisk} />
              </TableCell>
              <TableCell>{item.clauses.filter((c) => c.risk !== "low").length}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label={`Aksi ${item.fileName}`}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onView(item)}>
                      <Eye />
                      Lihat
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onDownload(item)}>
                      <Download />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => onDelete(item)}
                    >
                      <Trash2 />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
