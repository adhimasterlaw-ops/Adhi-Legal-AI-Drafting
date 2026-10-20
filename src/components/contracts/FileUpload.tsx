import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function FileUpload({
  file,
  uploadProgress,
  disabled,
  onFile,
  onAnalyze,
}: {
  file: File | null;
  uploadProgress: number;
  disabled: boolean;
  onFile: (file: File | null) => void;
  onAnalyze: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  function validate(next?: File) {
    if (!next) return;
    const extension = next.name.toLowerCase().split(".").pop();
    if (!extension || !["pdf", "docx"].includes(extension))
      return onFile(
        Object.assign(next, {
          validationError: "Format file tidak support. Gunakan PDF atau DOCX.",
        }),
      );
    if (next.size > 10 * 1024 * 1024)
      return onFile(
        Object.assign(next, {
          validationError: "File melebihi 10MB. Kompres file terlebih dahulu.",
        }),
      );
    onFile(next);
  }
  if (file)
    return (
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <FileText />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{file.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onFile(null)}
            disabled={disabled}
            aria-label="Hapus file"
          >
            <X className="text-destructive" />
          </Button>
        </div>
        {uploadProgress > 0 && (
          <div className="mt-4">
            <Progress value={uploadProgress} />
            <p className="mt-2 text-xs text-muted-foreground">Upload {uploadProgress}%</p>
          </div>
        )}
        <Button
          className="mt-5 w-full"
          size="lg"
          onClick={onAnalyze}
          disabled={
            disabled || Boolean((file as File & { validationError?: string }).validationError)
          }
        >
          Mulai Analisis
        </Button>
        {(file as File & { validationError?: string }).validationError && (
          <p className="mt-3 text-sm font-medium text-destructive">
            {(file as File & { validationError?: string }).validationError}
          </p>
        )}
      </div>
    );
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        validate(e.dataTransfer.files[0]);
      }}
      className={cn(
        "group cursor-pointer rounded-lg border-2 border-dashed bg-muted/55 px-6 py-14 text-center transition sm:px-10",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary hover:bg-primary/5",
      )}
    >
      <input
        ref={input}
        type="file"
        className="hidden"
        accept=".pdf,.docx"
        onChange={(e) => validate(e.target.files?.[0])}
      />
      <UploadCloud className="mx-auto size-16 text-primary transition-transform group-hover:-translate-y-1" />
      <h3 className="mt-5 font-display text-xl font-bold sm:text-2xl">
        Drop file PDF atau DOCX di sini
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        atau klik untuk browse file dari komputer Anda
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-5"
        onClick={(e) => {
          e.stopPropagation();
          input.current?.click();
        }}
      >
        Pilih File
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">Support: PDF, DOCX (Max 10MB)</p>
    </div>
  );
}
