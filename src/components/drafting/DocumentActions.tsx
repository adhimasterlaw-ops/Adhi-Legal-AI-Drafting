import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import { Copy, Download, FileDown, Mail, Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DocumentActions({
  title,
  content,
  onSave,
  onDuplicate,
}: {
  title: string;
  content: string;
  onSave: () => void;
  onDuplicate: () => void;
}) {
  const safeName = title.replace(/[^a-zA-Z0-9_-]+/g, "_");
  const downloadDocx = async () => {
    const paragraphs = content.split("\n").map(
      (line, index) =>
        new Paragraph({
          ...(index === 0 ? { heading: HeadingLevel.TITLE } : {}),
          children: [new TextRun(line)],
          spacing: { line: 360 },
        }),
    );
    const blob = await Packer.toBlob(
      new Document({
        sections: [
          {
            properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1701 } } },
            children: paragraphs,
          },
        ],
      }),
    );
    downloadBlob(blob, `${safeName}.docx`);
  };
  const downloadPdf = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 165) as string[];
    let y = 20;
    lines.forEach((line) => {
      if (y > 282) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 25, y);
      y += 7;
    });
    pdf.save(`${safeName}.pdf`);
  };
  const share = async () => {
    if (navigator.share) await navigator.share({ title, text: content });
    else await navigator.clipboard.writeText(content);
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={downloadDocx}>
        <Download />
        Download DOCX
      </Button>
      <Button variant="outline" onClick={downloadPdf}>
        <FileDown />
        Download PDF
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(content.slice(0, 1800))}`;
        }}
      >
        <Mail />
        Kirim Email
      </Button>
      <Button variant="outline" onClick={onSave}>
        <Save />
        Simpan
      </Button>
      <Button variant="outline" onClick={onDuplicate}>
        <Copy />
        Duplikasi
      </Button>
      <Button variant="ghost" size="icon" onClick={share} aria-label="Bagikan dokumen">
        <Share2 />
      </Button>
    </div>
  );
}
