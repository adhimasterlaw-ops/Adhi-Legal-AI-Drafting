import { FilePenLine, Scale, ScrollText, ShieldCheck, Stamp, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocumentTemplate } from "./types";

const icons = {
  Somasi: Stamp,
  Gugatan: Scale,
  Kontrak: FilePenLine,
  "Surat Kuasa": UsersRound,
  Perjanjian: ShieldCheck,
  Lainnya: ScrollText,
};

export function TemplateCard({
  template,
  onSelect,
}: {
  template: DocumentTemplate;
  onSelect: (template: DocumentTemplate) => void;
}) {
  const Icon = icons[template.category];
  return (
    <article className="group flex min-h-72 flex-col rounded-lg border bg-card p-5 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-md bg-accent text-primary">
          <Icon size={24} />
        </span>
        <Badge variant={template.isPremium ? "secondary" : "outline"}>
          {template.isPremium ? "Pro" : "Gratis"}
        </Badge>
      </div>
      <h3 className="mt-5 text-base font-bold">{template.name}</h3>
      <Badge variant="outline" className="mt-2 w-fit font-normal">
        {template.category}
      </Badge>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {template.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span>{template.usageCount.toLocaleString("id-ID")} penggunaan</span>
        <span>★ {template.rating}</span>
      </div>
      <Button variant="outline" className="mt-4 w-full" onClick={() => onSelect(template)}>
        Pilih Template
      </Button>
    </article>
  );
}
